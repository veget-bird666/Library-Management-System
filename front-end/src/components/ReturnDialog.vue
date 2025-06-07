<template>
    <el-dialog
      :model-value="dialogVisible"
      @update:model-value="emit('update:dialogVisible', $event)"
      title="还书"
      width="70%"
      :before-close="handleClose"
    >
      <div class="return-container">
        <!-- 借阅卡号输入区域 -->
        <div class="search-section">
          <el-input
            v-model="userAccount"
            placeholder="请输入借阅卡号"
            clearable
            @input="handleUserAccountInput"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </div>
  
        <!-- 已借图书列表区域 -->
        <div class="books-list">
          <el-table
            v-loading="loading"
            :data="books"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="title" label="书名" />
            <el-table-column prop="author" label="作者" />
            <el-table-column prop="borrow_time" label="借阅时间" />
            <el-table-column prop="should_return_time" label="应还时间" />
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
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleReturn" 
            :loading="returning"
            :disabled="!selectedBooks.length"
          >
            确认还书
          </el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { User } from '@element-plus/icons-vue'
  import { getBorrowedBooks, returnBook } from '../api/borrow'
  import { ElMessage } from 'element-plus'
  
  const props = defineProps({
    dialogVisible: {
      type: Boolean,
      required: true
    }
  })
  
  const emit = defineEmits(['update:dialogVisible', 'return-success'])
  
  const userAccount = ref('')
  const books = ref([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const selectedBooks = ref([])
  const returning = ref(false)
  
  // 获取已借图书列表
  const fetchBorrowedBooks = async () => {
    if (!userAccount.value) {
      books.value = []
      total.value = 0
      return
    }
  
    loading.value = true
    try {
      const response = await getBorrowedBooks({
        userAccount: userAccount.value,
        page: currentPage.value,
        size: pageSize.value
      })
      
      if (response.data.success) {
        books.value = response.data.data
        total.value = response.data.pagination.total
      } else {
        ElMessage.error(response.data.message || '获取借阅记录失败')
        books.value = []
        total.value = 0
      }
    } catch (error) {
      console.error('获取借阅记录失败:', error)
      ElMessage.error(error.response?.data?.message || '获取借阅记录失败')
      books.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }
  
  // 处理借阅卡号输入
  const handleUserAccountInput = () => {
    currentPage.value = 1
    fetchBorrowedBooks()
  }
  
  // 处理选择变化
  const handleSelectionChange = (selection) => {
    selectedBooks.value = selection
  }
  
  // 分页处理
  const handleSizeChange = (val) => {
    pageSize.value = val
    fetchBorrowedBooks()
  }
  
  const handleCurrentChange = (val) => {
    currentPage.value = val
    fetchBorrowedBooks()
  }
  
  // 关闭弹窗
  const handleClose = () => {
    emit('update:dialogVisible', false)
    // 重置状态
    userAccount.value = ''
    selectedBooks.value = []
    books.value = []
    currentPage.value = 1
  }
  
  // 确认还书
  const handleReturn = async () => {
    if (!selectedBooks.value.length) {
      ElMessage.warning('请选择要归还的图书')
      return
    }
  
    returning.value = true
    try {
      // 逐个归还选中的图书
      for (const book of selectedBooks.value) {
        try {
          const response = await returnBook({
            bookId: book.book_id,
            userAccount: userAccount.value
          })
          
          if (!response.data.success) {
            throw new Error(response.data.message || '归还失败')
          }
        } catch (error) {
          ElMessage.error(`《${book.title}》归还失败: ${error.message || '未知错误'}`)
          throw error
        }
      }
      
      ElMessage.success('归还成功')
      emit('return-success')
      handleClose()
      
      // 重置状态
      selectedBooks.value = []
      currentPage.value = 1
      await fetchBorrowedBooks()
    } catch (error) {
      console.error('归还图书时发生错误:', error)
    } finally {
      returning.value = false
    }
  }
  
  // 监听弹窗显示状态
  watch(() => props.dialogVisible, (newVal) => {
    if (newVal && userAccount.value) {
      fetchBorrowedBooks()
    }
  })
  </script>
  
  <style scoped>
  .return-container {
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
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  </style>