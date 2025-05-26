<template>
  <div class="admin-container">
    <!-- 左侧菜单 -->
    <div class="sidebar">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo" />
        <span>图书管理</span>
      </div>
      
      <div class="menu">
        <div class="menu-group">
          <div class="menu-title">功能管理</div>
          <div class="menu-items">
            <router-link to="/admin/borrow" class="menu-item active">
              <i class="icon borrow-icon"></i>
              <span>借阅管理</span>
            </router-link>
            <router-link to="/admin/books" class="menu-item">
              <i class="icon book-icon"></i>
              <span>图书管理</span>
            </router-link>
            <router-link to="/admin/readers" class="menu-item">
              <i class="icon reader-icon"></i>
              <span>读者管理</span>
            </router-link>
            <router-link to="/admin/categories" class="menu-item">
              <i class="icon category-icon"></i>
              <span>类型管理</span>
            </router-link>
            <router-link to="/admin/announcements" class="menu-item">
              <i class="icon announcement-icon"></i>
              <span>公告管理</span>
            </router-link>
            <router-link to="/admin/settings" class="menu-item">
              <i class="icon setting-icon"></i>
              <span>管理员管理</span>
            </router-link>
          </div>
        </div>
        
        <div class="menu-group">
          <div class="menu-title">统计分析</div>
          <div class="menu-items">
            <router-link to="/admin/statistics" class="menu-item">
              <i class="icon stats-icon"></i>
              <span>统计分析</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <div class="top-bar">
        <div class="breadcrumb">
          <span class="location">首页</span>
          <span class="separator">/</span>
          <span class="current">借阅管理</span>
        </div>
        
        <div class="admin-info" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <div class="admin-info-content">
            <span class="admin-name">{{ username }}</span>
            <svg class="admin-avatar" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#009688"/>
            </svg>
          </div>
          
          <!-- 管理员下拉菜单 -->
          <div class="dropdown-wrapper" v-show="showDropdown">
            <div class="dropdown-menu">
              <div class="dropdown-item">
                <i class="icon profile-icon"></i>
                <span>个人信息</span>
              </div>
              <div class="dropdown-item">
                <i class="icon settings-icon"></i>
                <span>账号设置</span>
              </div>
              <div class="divider"></div>
              <div class="dropdown-item" @click="handleLogout">
                <i class="icon logout-icon"></i>
                <span>切换账号</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 借阅管理内容 -->
      <div class="content-area">
        <div class="search-bar">
          <div class="search-inputs">
            <input type="text" placeholder="借书卡" class="search-input" />
            <div class="select-wrapper">
              <select class="search-select">
                <option value="">图书类型</option>
                <!-- 添加更多选项 -->
              </select>
            </div>
            <div class="select-wrapper">
              <select class="search-select">
                <option value="">图书类型</option>
                <!-- 添加更多选项 -->
              </select>
            </div>
            <button class="search-btn">搜索</button>
          </div>
        </div>

        <!-- 借阅列表 -->
        <div class="borrow-list">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>图书名称</th>
                <th>借书卡</th>
                <th>借阅人</th>
                <th>借阅时间</th>
                <th>还书时间</th>
                <th>还书类型</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="checkbox" /></td>
                <td>大宋的智慧</td>
                <td>8120116042</td>
                <td>辛弃</td>
                <td>2021-04-05 21:42:35</td>
                <td>-</td>
                <td><span class="status pending">在借中</span></td>
                <td>
                  <button class="action-btn return">还书处理</button>
                  <button class="action-btn delete">删除</button>
                </td>
              </tr>
              <!-- 添加更多行 -->
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <span class="page-text">共 5 页</span>
          <select class="page-size">
            <option value="15">15条/页</option>
            <option value="20">20条/页</option>
            <option value="30">30条/页</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showDropdown = ref(false)
const username = ref('admin')

onMounted(() => {
  const userInfo = localStorage.getItem('user')
  if (userInfo) {
    const user = JSON.parse(userInfo)
    username.value = user.username
  }
})

const handleLogout = () => {
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f6fa;
}

.sidebar {
  width: 240px;
  background-color: #1e2837;
  color: white;
  padding: 20px 0;
}

.logo {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 30px;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.logo span {
  font-size: 18px;
  font-weight: 500;
}

.menu-group {
  margin-bottom: 20px;
}

.menu-title {
  padding: 10px 20px;
  color: #8c8c8c;
  font-size: 14px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.3s;
}

.menu-item:hover, .menu-item.active {
  background-color: #009688;
}

.menu-item i {
  margin-right: 10px;
  font-size: 16px;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.breadcrumb {
  font-size: 14px;
  color: #666;
}

.separator {
  margin: 0 8px;
  color: #d9d9d9;
}

.admin-info {
  position: relative;
  cursor: pointer;
}

.admin-info-content {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.admin-info:hover .admin-info-content {
  background-color: #f0f0f0;
}

.admin-name {
  margin-right: 10px;
}

.admin-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #E0F2F1;
  padding: 4px;
}

.dropdown-wrapper {
  position: absolute;
  top: 100%;
  right: 0;
  padding-top: 8px;
}

.dropdown-menu {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  padding: 8px 0;
  z-index: 1000;
  position: relative;
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -4px;
  right: 20px;
  width: 8px;
  height: 8px;
  background-color: white;
  transform: rotate(45deg);
  box-shadow: -2px -2px 2px rgba(0, 0, 0, 0.03);
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #666;
  transition: background-color 0.3s;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f6fa;
  color: #009688;
}

.dropdown-item i {
  margin-right: 8px;
  font-size: 16px;
}

.divider {
  height: 1px;
  background-color: #e8e8e8;
  margin: 4px 0;
}

/* 图标样式 */
.icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.profile-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
}

.settings-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z'/%3E%3C/svg%3E");
}

.logout-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z'/%3E%3C/svg%3E");
}

.search-bar {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-inputs {
  display: flex;
  gap: 15px;
}

.search-input, .search-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-width: 200px;
}

.search-btn {
  padding: 8px 20px;
  background-color: #009688;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.borrow-list {
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  background-color: #fafafa;
  font-weight: 500;
}

.status {
  padding: 4px 8px;
  border-radius: 2px;
  font-size: 12px;
}

.status.pending {
  background-color: #e6f7ff;
  color: #1890ff;
}

.action-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  margin-right: 8px;
  cursor: pointer;
}

.action-btn.return {
  background-color: #009688;
  color: white;
}

.action-btn.delete {
  background-color: #ff4d4f;
  color: white;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.page-btn {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  background-color: white;
  cursor: pointer;
}

.page-btn.active {
  background-color: #009688;
  color: white;
  border-color: #009688;
}

.page-text {
  color: #666;
}

.page-size {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
</style> 