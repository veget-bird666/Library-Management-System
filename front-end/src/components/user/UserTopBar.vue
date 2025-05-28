<template>
  <div class="top-bar">
    <div class="breadcrumb">
      <span class="location">首页</span>
      <span class="separator">/</span>
      <span class="current">{{ currentTitle }}</span>
    </div>

    <div class="admin-info" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
      <div class="admin-info-content">
        <span class="admin-name">{{ username }}</span>
        <svg class="admin-avatar" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#ecf5ff" />
          <path d="M12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5Z" fill="#409EFF"/>
          <path d="M12 12.9C10 12.9 6.03 13.99 6 15.98C7.29 17.92 9.5 19.2 12 19.2C14.5 19.2 16.71 17.92 18 15.98C17.97 13.99 13.99 12.9 12 12.9Z" fill="#409EFF"/>
        </svg>
      </div>
      <div v-show="showDropdown" class="dropdown-wrapper">
        <div class="dropdown-menu">
          <div class="dropdown-item">
            <i class="icon profile-icon"></i><span>个人信息</span>
          </div>
          <div class="dropdown-item">
            <i class="icon settings-icon"></i><span>账号设置</span>
          </div>
          <div class="divider"></div>
          <div class="dropdown-item" @click="handleLogout">
            <i class="icon logout-icon"></i><span>切换账号</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const showDropdown = ref(false);
const username = ref('读者');

onMounted(() => {
  const userInfo = localStorage.getItem('user');
  if (userInfo) {
    username.value = JSON.parse(userInfo).nickname;
  }
});

const handleLogout = () => {
  localStorage.removeItem('user');
  router.push('/');
};

const currentTitle = computed(() => {
  const map: Record<string, string> = {
    '/user/books': '图书浏览',
    '/user/borrow': '我的借阅',
    '/user/profile': '个人中心'
  };
  return map[route.path] || '';
});
</script>

<style scoped>
/* 完全复制管理员顶栏样式 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  height: 60px;
  padding: 0 20px;
}

.breadcrumb {
  font-size: 14px;
  color: #666;
}
.separator {
  margin: 0 8px;
  color: #d9d9d9;
}
.current {
  color: #409EFF;
}

.admin-info {
  position: relative;
}
.admin-info-content {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
  cursor: pointer;
}
.admin-info-content:hover {
  background-color: #f5f7fa;
}

.admin-name {
  margin-right: 8px;
  color: #333;
  font-weight: 500;
}
.admin-avatar {
  width: 32px;
  height: 32px;
}

.dropdown-wrapper {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
}
.dropdown-menu {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 160px;
  overflow: hidden;
}
.divider {
  height: 1px;
  background-color: #ebeef5;
  margin: 4px 0;
}
.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #666;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
}
.dropdown-item i {
  margin-right: 8px;
  font-size: 16px;
}
.dropdown-item:hover {
  background-color: #ecf5ff;
  color: #409EFF;
}
</style>