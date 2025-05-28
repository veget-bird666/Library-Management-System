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
              <button class="action-btn borrow" @click="handleBorrow(book.book_id)">
                借阅申请
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页保持原样 -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchBooks } from '../api/books'; // 移除addBook, deleteBook

// 保留原始数据结构
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

// 保持原始分页逻辑
const books = ref<Book[]>([]);
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
});

// 加载数据逻辑不变
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
  }
};

onMounted(load);

// 分页切换逻辑保留
const changePage = (p: number) => {
  pagination.value.page = p;
  load();
};

// 新增借阅处理（模拟功能）
const handleBorrow = async (bookId: string) => {
  if (!confirm('确认申请借阅该图书？')) return;
  try {
    // 此处预留接口位置
    alert('借阅申请已提交（功能开发中）');
  } catch (err) {
    console.error('操作失败:', err);
  }
};
</script>

<style scoped>
/* 保留原有样式，仅修改按钮颜色 */
.action-btn.borrow {
  background: #67C23A;  /* 新的绿色色值 */
  /* 保持其他样式完全一致 */
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.action-btn.borrow:hover {
  background: #5daf34;  /* 加深的绿色 */
  /* 原效果保留 */
  opacity: 0.9;
}

/* 移除原删除按钮样式 */
.action-btn.delete { 
  display: none;
}

/* 其他样式保持完全一致 */
.content-area { padding: 20px; }
.search-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.borrow-list table { width: 100%; border-collapse: collapse; }
.borrow-list th, .borrow-list td { padding: 8px; border: 1px solid #ebeef5; text-align: left; }
.pagination { margin: 10px 0; text-align: center; }
.pagination button { margin: 0 5px; padding: 4px 8px; }
</style>