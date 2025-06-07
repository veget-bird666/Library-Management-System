<template>
    <el-dialog
      :model-value="dialogVisible"
      @update:model-value="emit('update:dialogVisible', $event)"
      title="借书"
      width="70%"
      :before-close="handleClose"
    >
      <div class="borrow-container">
        <!-- 搜索区域 -->
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="请输入书籍名称搜索"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
  
        <!-- 图书列表区域 -->
        <div class="books-list">
          <el-table
            v-loading="loading"
            :data="books"
            style="width: 100%"
          >
            <el-table-column prop="title" label="书名" />
            <el-table-column prop="author" label="作者" />
            <el-table-column prop="isbn" label="ISBN" />
            <el-table-column prop="publisher" label="出版社" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="selectBook(scope.row)"
                >
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
  
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="total"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
  
        <!-- 借阅信息区域 -->
        <div class="borrow-info" v-if="selectedBook">
          <div class="selected-book-info">
            <h3>已选图书：{{ selectedBook.title }}</h3>
          </div>
          <el-input
            v-model="userAccount"
            placeholder="请输入借阅卡号"
            style="width: 300px; margin: 20px 0;"
          />
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleBorrow" :loading="borrowing">
            确认借书
          </el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, onMounted, defineProps, defineEmits } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { getAvailableBooks, borrowBook } from '../api/borrow'
  import { ElMessage } from 'element-plus'
  
  const props = defineProps({
    dialogVisible: {
      type: Boolean,
      required: true
    }
  })
  
  const emit = defineEmits(['update:dialogVisible', 'borrow-success'])
  
  const searchQuery = ref('')
  const books = ref([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const selectedBook = ref(null)
  const userAccount = ref('')
  const borrowing = ref(false)
  
  // 获取图书列表
  const fetchBooks = async () => {
    loading.value = true
    try {
      const response = await getAvailableBooks({
        keyword: searchQuery.value || '',
        page: currentPage.value,
        size: pageSize.value
      })
      if (response.data.success) {
        books.value = response.data.data
        total.value = response.data.pagination.total
      }
    } catch (error) {
      ElMessage.error('获取图书列表失败')
    } finally {
      loading.value = false
    }
  }
  
  // 搜索处理
  const handleSearch = () => {
    currentPage.value = 1
    fetchBooks()
  }
  
  // 分页处理
  const handleSizeChange = (val) => {
    pageSize.value = val
    fetchBooks()
  }
  
  const handleCurrentChange = (val) => {
    currentPage.value = val
    fetchBooks()
  }
  
  // 选择图书
  const selectBook = (book) => {
    selectedBook.value = book
  }
  
  // 关闭弹窗
  const handleClose = () => {
    emit('update:dialogVisible', false)
    // 重置状态
    selectedBook.value = null
    userAccount.value = ''
    searchQuery.value = ''
    currentPage.value = 1
  }
  
  // 确认借阅
  const handleBorrow = async () => {
    if (!selectedBook.value) {
      ElMessage.warning('请先选择要借阅的图书')
      return
    }
    if (!userAccount.value) {
      ElMessage.warning('请输入借阅卡号')
      return
    }
  
    borrowing.value = true
    try {
      console.log('借阅信息：', {
        bookId: selectedBook.value.book_id,
        userAccount: userAccount.value
      });
      
      const response = await borrowBook({
        bookId: selectedBook.value.book_id,
        userAccount: userAccount.value
      })
      
      if (response.data.success) {
        ElMessage.success('借阅成功')
        emit('borrow-success')
        handleClose()
      }
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '借阅失败')
    } finally {
      borrowing.value = false
    }
  }
  
  onMounted(() => {
    fetchBooks()
  })
  </script>
  
  <style scoped>
  .borrow-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .search-section {
    max-width: 500px;
  }
  
  .books-list {
    background: #fff;
    border-radius: 8px;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .borrow-info {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #ebeef5;
  }
  
  .selected-book-info {
    margin-bottom: 20px;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  </style>