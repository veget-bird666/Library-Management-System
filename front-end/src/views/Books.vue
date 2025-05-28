//Books.vue
<template>
  <div class="content-area">
    <!-- 标题和 “新增” 按钮 -->
    <div class="search-bar">
      <h2>图书管理</h2>
      <button class="search-btn" @click="openAddModal">新增图书</button>
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
              <button class="action-btn delete" @click="onDelete(book.book_id)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 简单分页 -->
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

    <!-- 新增图书弹窗 -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal">
        <span class="close" @click="showAddModal = false">×</span>
        <h3>新增图书</h3>
        <form @submit.prevent="onSubmit">
          <div class="form-row">
            <label>图书编号 <span class="required">*</span></label>
            <input v-model="form.book_id" placeholder="13位ISBN+4位附加码" required />
          </div>
          <div class="form-row">
            <label>图书名称 <span class="required">*</span></label>
            <input v-model="form.title" required />
          </div>
          <div class="form-row">
            <label>图书作者 <span class="required">*</span></label>
            <input v-model="form.author" required />
          </div>
          <div class="form-row">
            <label>图书出版社 <span class="required">*</span></label>
            <input v-model="form.publisher" required />
          </div>
          <div class="form-row">
            <label>图书分类 <span class="required">*</span></label>
            <select v-model="form.category" required>
              <option disabled value="">请选择</option>
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="form-row">
            <label>图书语言</label>
            <input v-model="form.language" />
          </div>
          <div class="form-row">
            <label>图书价格 <span class="required">*</span></label>
            <input type="number" step="0.01" v-model.number="form.price" required />
          </div>
          <div class="form-row">
            <label>出版日期</label>
            <input type="date" v-model="form.publication_date" />
          </div>
          <div class="form-row">
            <label>图书简介</label>
            <textarea v-model="form.description" placeholder="请输入介绍信息"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="action-btn return">提交</button>
            <button type="button" class="action-btn delete" @click="showAddModal = false">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchBooks, addBook, deleteBook } from '../api/books';

interface Form {
  book_id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  language: string;
  price: number;
  publication_date: string;  // yyyy-MM-dd
  description?: string;
}

const books = ref<Array<Record<string, any>>>([]);
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
});

const showAddModal = ref(false);
const categories = ref<string[]>([
  '计算机', '文学', '历史', '艺术', '经济', '其他'
]);

const form = ref<Form>({
  book_id: '',
  title: '',
  author: '',
  publisher: '',
  category: '',
  language: '中文',
  price: 0,
  publication_date: '',
  description: '',
});

// 拉数据
const load = async () => {
  try {
    const resp = await fetchBooks({
      page: pagination.value.page,
      size: pagination.value.pageSize
    });
    
    // 修复点2: 确保数据结构正确
    books.value = resp.data; // 正确获取数据数组
    pagination.value = resp.pagination; 
    
    // 正确获取分页信息
  } catch (error) {
    console.error('加载图书失败:', error);
  }
};

onMounted(load);

// 分页切换
const changePage = (p: number) => {
  pagination.value.page = p;
  load();
};

const openAddModal = () => {
  showAddModal.value = true;
};

// 提交
const onSubmit = async () => {
  // 1. ISBN 去除所有非数字
  const normalized = form.value.book_id.replace(/\D/g, '');
  if (!/^\d{17}$/.test(normalized)) {
    alert('ISBN 格式不正确，应为 17 位纯数字（13 位 ISBN + 4 位附加码）');
    return;
  }
  // 2. 获取年份
  const year = form.value.publication_date
    ? new Date(form.value.publication_date).getFullYear()
    : new Date().getFullYear();

  try {
    await addBook({
      book_id: normalized,
      title: form.value.title,
      author: form.value.author,
      publisher: form.value.publisher,
      category: form.value.category,
      language: form.value.language,
      price: form.value.price,
      publication_year: year,
      description: form.value.description,
    });
    showAddModal.value = false;
    // 重置表单
    form.value = {
      book_id: '',
      title: '',
      author: '',
      publisher: '',
      category: '',
      language: '中文',
      price: 0,
      publication_date: '',
      description: '',
    };
    load();
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || '添加失败');
  }
};

// 删除
const onDelete = async (id: string) => {
  if (!confirm('确定要删除这本书吗？')) return;
  try {
    await deleteBook(id);
    load();
  } catch (err) {
    console.error(err);
    alert('删除失败');
  }
};
</script>

<style scoped>
.content-area { padding: 20px; }
.search-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.search-btn { padding: 6px 12px; border: none; background: #409EFF; color: #fff; border-radius: 4px; cursor: pointer; }
.borrow-list table { width: 100%; border-collapse: collapse; }
.borrow-list th, .borrow-list td { padding: 8px; border: 1px solid #ebeef5; text-align: left; }
.pagination { margin: 10px 0; text-align: center; }
.pagination button { margin: 0 5px; padding: 4px 8px; }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
}
.modal {
  background: #fff; padding: 20px; border-radius: 8px; width: 600px; position: relative;
}
.close {
  position: absolute; top: 10px; right: 12px; font-size: 20px; cursor: pointer;
}
.form-row {
  display: flex; align-items: center; margin-bottom: 12px;
}
.form-row label { width: 100px; font-weight: 500; }
.form-row .required { color: red; }
.form-row input,
.form-row select,
.form-row textarea {
  flex: 1; padding: 6px 10px; border: 1px solid #d9d9d9; border-radius: 4px;
}
.form-row textarea { height: 80px; resize: vertical; }
.form-actions {
  display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;
}
.action-btn.return { padding: 6px 12px; border: none; background: #67C23A; color: #fff; border-radius: 4px; cursor: pointer; }
.action-btn.delete { padding: 6px 12px; border: none; background: #F56C6C; color: #fff; border-radius: 4px; cursor: pointer; }
</style>
