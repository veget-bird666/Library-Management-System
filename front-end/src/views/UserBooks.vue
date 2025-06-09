<template>
  <div class="content-area">
    <!-- 标题 -->
    <div class="search-bar">
      <h2>图书浏览</h2>
    </div>

    <!-- 图书列表 -->
    <div class="borrow-list">
      <table>
        <thead>
          <tr>
            <th>ISBN</th>
            <th>书名</th>
            <th>作者</th>
            <th>出版社</th>
            <th>年份</th>
            <th>分类</th>
            <th>定价</th>
            <th>语言</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.book_id">
            <td>{{ book.book_id }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.publisher }}</td>
            <td>{{ book.publication_year }}</td>
            <td>{{ book.category }}</td>
            <td>{{ Number(book.price).toFixed(2) }}</td>
            <td>{{ book.language }}</td>
            <td>
              <button class="action-btn borrow" @click="handleBorrow(book)">
                借阅申请
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button 
        :disabled="pagination.page === 1" 
        @click="changePage(pagination.page - 1)"
      >
        上一页
      </button>
      <span>第 {{ pagination.page }} / {{ pagination.totalPages }} 页</span>
      <button 
        :disabled="pagination.page === pagination.totalPages" 
        @click="changePage(pagination.page + 1)"
      >
        下一页
      </button>
    </div>

    <!-- 借阅申请弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="借阅申请"
      width="500px"
    >
      <div class="borrow-dialog">
        <!-- 管理员搜索 -->
        <div class="admin-search">
          <el-input
            v-model="adminKeyword"
            placeholder="请输入管理员名称搜索"
            @input="handleAdminSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 管理员列表 -->
        <div class="admin-list" v-if="adminList.length > 0">
          <el-table :data="adminList" style="width: 100%">
            <el-table-column prop="admin_account" label="账号" />
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="selectAdmin(scope.row)"
                  :disabled="selectedAdmin?.admin_account === scope.row.admin_account"
                >
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 已选管理员 -->
        <div class="selected-admin" v-if="selectedAdmin">
          <p>已选管理员：{{ selectedAdmin.nickname }} ({{ selectedAdmin.admin_account }})</p>
        </div>

        <!-- 借阅人信息 -->
        <div class="user-info">
          <el-form :model="borrowForm" label-width="100px">
            <el-form-item label="借阅人ID">
              <el-input v-model="borrowForm.userAccount" placeholder="请输入借阅人ID" />
            </el-form-item>
            <el-form-item label="借阅人密码">
              <el-input
                v-model="borrowForm.userPassword"
                type="password"
                placeholder="请输入借阅人密码"
                show-password
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="borrowForm.userRemark"
                type="textarea"
                placeholder="请输入备注信息（选填）"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBorrowApplication" :disabled="!canSubmit">
            确认申请
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue'
import { fetchBooks } from '../api/books';
import { searchAdmins } from '../api/auth';
import { applyBorrowBook } from '../api/userborrow';
import { ElMessage } from 'element-plus';

// 图书类型定义
interface Book {
  book_id: string;
  title: string;
  author: string;
  publisher: string;
  publication_year: number;
  category: string;
  price: number;
  language: string;
}

// 管理员类型定义
interface Admin {
  admin_account: string;
  nickname: string;
}

// 状态变量
const books = ref<Book[]>([]);
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
});

// 弹窗相关
const dialogVisible = ref(false);
const adminKeyword = ref('');
const adminList = ref<Admin[]>([]);
const selectedAdmin = ref<Admin | null>(null);
const selectedBook = ref<Book | null>(null);
const borrowForm = ref({
  userAccount: '',
  userPassword: '',
  userRemark: ''
});

// 计算属性：是否可以提交
const canSubmit = computed(() => {
  return selectedAdmin.value &&
         borrowForm.value.userAccount &&
         borrowForm.value.userPassword &&
         selectedBook.value;
});

// 加载图书列表
const load = async () => {
  try {
    const resp = await fetchBooks({
      page: pagination.value.page,
      size: pagination.value.pageSize
    });
    
    books.value = resp.data;
    pagination.value = resp.pagination;
  } catch (error) {
    console.error('加载失败:', error);
    ElMessage.error('加载图书列表失败');
  }
};

// 分页切换
const changePage = (p: number) => {
  pagination.value.page = p;
  load();
};

// 打开借阅弹窗
const handleBorrow = (book: Book) => {
  selectedBook.value = book;
  dialogVisible.value = true;
  // 重置表单
  adminKeyword.value = '';
  adminList.value = [];
  selectedAdmin.value = null;
  borrowForm.value = {
    userAccount: '',
    userPassword: '',
    userRemark: ''
  };
};

// 搜索管理员
const handleAdminSearch = async () => {
  if (!adminKeyword.value.trim()) {
    adminList.value = [];
    return;
  }
  
  try {
    const response = await searchAdmins({
      keyword: adminKeyword.value.trim()
    });
    
    if (response.data.success) {
      adminList.value = response.data.data;
    }
  } catch (error) {
    console.error('搜索管理员失败:', error);
    ElMessage.error('搜索管理员失败');
  }
};

// 选择管理员
const selectAdmin = (admin: Admin) => {
  selectedAdmin.value = admin;
};

// 提交借阅申请
const submitBorrowApplication = async () => {
  if (!selectedBook.value || !selectedAdmin.value) return;
  
  try {
    const response = await applyBorrowBook({
      bookId: selectedBook.value.book_id,
      userAccount: borrowForm.value.userAccount,
      userPassword: borrowForm.value.userPassword,
      adminAccount: selectedAdmin.value.admin_account,
      userRemark: borrowForm.value.userRemark || undefined
    });
    
    if (response.data.success) {
      ElMessage.success('借阅申请提交成功');
      dialogVisible.value = false;
    }
  } catch (error: any) {
    console.error('提交借阅申请失败:', error);
    ElMessage.error(error.response?.data?.message || '提交借阅申请失败');
  }
};

// 组件挂载时加载数据
onMounted(load);
</script>

<style scoped>
.content-area { padding: 20px; }
.search-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.borrow-list table { width: 100%; border-collapse: collapse; }
.borrow-list th, .borrow-list td { padding: 8px; border: 1px solid #ebeef5; text-align: left; }
.pagination { margin: 10px 0; text-align: center; }
.pagination button { margin: 0 5px; padding: 4px 8px; }

.action-btn.borrow {
  background: #67C23A;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.action-btn.borrow:hover {
  background: #5daf34;
  opacity: 0.9;
}

/* 弹窗样式 */
.borrow-dialog {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.admin-search {
  margin-bottom: 10px;
}

.admin-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.selected-admin {
  padding: 10px;
  background: #f0f9eb;
  border-radius: 4px;
  margin-bottom: 10px;
}

.user-info {
  margin-top: 20px;
}
</style>