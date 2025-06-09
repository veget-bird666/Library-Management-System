<template>
  <div class="content-area">
    <div class="borrow-container">
      <!-- 标签页 -->
      <el-tabs v-model="activeTab">
        <!-- 我的借阅标签 -->
        <el-tab-pane label="我的借阅" name="myBorrows">
          <div class="my-borrows-list">
            <el-table
              v-loading="borrowedLoading"
              :data="borrowedBooks"
              style="width: 100%"
            >
              <el-table-column prop="title" label="书名" />
              <el-table-column prop="author" label="作者" />
              <el-table-column prop="publisher" label="出版社" />
              <el-table-column prop="category" label="分类" />
              <el-table-column prop="formatted_borrow_time" label="借阅时间" />
              <el-table-column prop="formatted_should_return_time" label="应还时间" />
              <el-table-column label="状态">
                <template #default="{ row }">
                  <el-tag
                    :type="getStatusType(row.status, row.is_overdue)"
                  >
                    {{ row.status_text }}
                    <template v-if="row.status === 1 && !row.is_overdue">
                      (剩余{{ row.remaining_days }}天)
                    </template>
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>

            <div class="pagination">
              <el-pagination
                v-model:current-page="borrowedCurrentPage"
                v-model:page-size="borrowedPageSize"
                :total="borrowedTotal"
                :page-sizes="[10, 20, 30, 50]"
                layout="total, sizes, prev, pager, next"
                @size-change="handleBorrowedSizeChange"
                @current-change="handleBorrowedCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>

        <!-- 搜索借阅标签 -->
        <el-tab-pane label="借阅图书" name="borrow">
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
              <el-table-column prop="book_id" label="ISBN" />
              <el-table-column prop="publisher" label="出版社" />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleBorrow(scope.row)"
                  >
                    借阅
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getUserBorrowedBooks, applyBorrowBook, searchAvailableBooks } from '@/api/userborrow'
import useUserStore from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()
const activeTab = ref('myBorrows')

// 搜索相关
const searchQuery = ref('')
const books = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 已借阅图书相关
const borrowedBooks = ref([])
const borrowedLoading = ref(false)
const borrowedCurrentPage = ref(1)
const borrowedPageSize = ref(10)
const borrowedTotal = ref(0)

// 获取图书列表
const fetchBooks = async () => {
  loading.value = true;
  try {
    const response = await searchAvailableBooks({
      keyword: searchQuery.value,
      page: currentPage.value,
      size: pageSize.value
    });
    
    if (response.data.success) {
      books.value = response.data.data;
      total.value = response.data.pagination.total;
    }
  } catch (error) {
    console.error('获取图书列表失败：', error);
    ElMessage.error(error.response?.data?.message || '获取图书列表失败');
  } finally {
    loading.value = false;
  }
};

// 检查用户登录状态
const checkUserLogin = () => {
  // 从localStorage获取用户信息
  const storedUserInfo = localStorage.getItem('userInfo')
  if (!storedUserInfo) {
    ElMessage.warning('请先登录')
    router.push('/')  // 改为跳转到根路径
    return false
  }

  // 如果store中没有用户信息，但localStorage有，则恢复用户信息
  if (!userStore.userInfo && storedUserInfo) {
    const parsedUserInfo = JSON.parse(storedUserInfo)
    userStore.setUserInfo(parsedUserInfo)
  }

  return true
}

// 获取已借阅图书
const fetchBorrowedBooks = async () => {
  if (!checkUserLogin()) return

  const userAccount = userStore.userInfo?.user_account
  if (!userAccount) {
    ElMessage.warning('用户信息不完整，请重新登录')
    router.push('/')  // 改为跳转到根路径
    return
  }

  borrowedLoading.value = true
  try {
    const response = await getUserBorrowedBooks({
      userAccount,
      page: borrowedCurrentPage.value,
      size: borrowedPageSize.value
    })
    
    if (response.data.success) {
      borrowedBooks.value = response.data.data
      borrowedTotal.value = response.data.pagination.total
    }
  } catch (error) {
    console.error('获取借阅记录失败：', error)
    ElMessage.error(error.response?.data?.message || '获取借阅记录失败')
  } finally {
    borrowedLoading.value = false
  }
}

// 获取状态标签类型
const getStatusType = (status, isOverdue) => {
  if (status === 1) {
    return isOverdue ? 'danger' : 'success';
  } else if (status === 2) {
    return 'info';
  } else if (status === 3) {
    return 'danger';
  }
  return 'info';
};

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1;
  fetchBooks();
};

// 分页处理 - 图书列表
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchBooks()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchBooks()
}

// 分页处理 - 借阅记录
const handleBorrowedSizeChange = (val) => {
  borrowedPageSize.value = val
  fetchBorrowedBooks()
}

const handleBorrowedCurrentChange = (val) => {
  borrowedCurrentPage.value = val
  fetchBorrowedBooks()
}

// 借阅处理
const handleBorrow = async (book) => {
  if (!checkUserLogin()) return

  const userAccount = userStore.userInfo?.user_account
  if (!userAccount) {
    ElMessage.warning('用户信息不完整，请重新登录')
    router.push('/')  // 改为跳转到根路径
    return
  }

  try {
    const response = await applyBorrowBook({
      bookId: book.book_id,
      userAccount
    })
    
    if (response.data.success) {
      ElMessage.success('借阅申请提交成功')
      fetchBooks()
      fetchBorrowedBooks()
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '借阅申请失败')
  }
}

// 监听标签页切换
watch(activeTab, (newTab) => {
  if (newTab === 'myBorrows') {
    fetchBorrowedBooks()
  } else if (newTab === 'borrow') {
    fetchBooks()
  }
})

// 组件挂载时获取数据
onMounted(() => {
  if (checkUserLogin()) {
    fetchBorrowedBooks()
  }
})
</script>

<style scoped>
.content-area {
  padding: 20px;
}

.borrow-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-section {
  max-width: 500px;
  margin-bottom: 20px;
}

.books-list,
.my-borrows-list {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>