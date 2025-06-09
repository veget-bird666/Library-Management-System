<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentPage = ref('主页')
const showDropdown = ref(false)
const username = ref('默认用户')

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

<template>
  <div class="user-container">
    <!-- 左侧菜单 -->
    <div class="sidebar">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo" />
        <span>图书管理</span>
      </div>
      
      <div class="menu">
        <div class="menu-group">
          <div class="menu-title">功能导航</div>
          <div class="menu-items">
            <router-link to="/user" class="menu-item active">
              <i class="icon home-icon"></i>
              <span>主页</span>
            </router-link>
            <router-link to="/user/function1" class="menu-item">
              <i class="icon function1-icon"></i>
              <span>功能1</span>
            </router-link>
            <router-link to="/user/function2" class="menu-item">
              <i class="icon function2-icon"></i>
              <span>功能2</span>
            </router-link>
            <router-link to="/user/function3" class="menu-item">
              <i class="icon function3-icon"></i>
              <span>功能3</span>
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
          <span class="current">{{ currentPage }}</span>
        </div>
        
        <div class="user-info" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <div class="user-info-content">
            <span class="user-name">{{ username }}</span>
            <svg class="user-avatar" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#4F6EF7"/>
            </svg>
          </div>
          
          <!-- 用户下拉菜单 -->
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

      <!-- 主页内容 -->
      <div class="content-area">
        <div class="welcome-section">
          <h1>欢迎使用图书管理系统</h1>
          <p>这里是系统主页，您可以通过左侧菜单访问各项功能。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-container {
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

.user-info {
  position: relative;
  cursor: pointer;
}

.user-info-content {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover .user-info-content {
  background-color: #f0f0f0;
}

.user-name {
  margin-right: 10px;
  color: #666;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #E3E8FF;
  padding: 4px;
}

.content-area {
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  min-height: calc(100vh - 100px);
}

.welcome-section {
  text-align: center;
  padding: 40px 0;
}

.welcome-section h1 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.welcome-section p {
  color: #666;
  font-size: 16px;
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
</style> 