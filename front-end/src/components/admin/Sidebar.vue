// src/components/admin/Sidebar.vue
<template>
  <div class="sidebar">
    <div class="logo">
      <img src="@/assets/logo.png" alt="Logo" />
      <span>图书管理</span>
    </div>
    <div class="menu">
      <div class="menu-group">
        <div class="menu-title">功能管理</div>
        <div class="menu-items">
          <router-link to="/admin/borrow" class="menu-item" active-class="active">
            <i class="icon borrow-icon"></i><span>借阅管理</span>
          </router-link>
          <router-link to="/admin/books" class="menu-item" active-class="active">
            <i class="icon book-icon"></i><span>图书管理</span>
          </router-link>
          <router-link to="/admin/readers" class="menu-item" active-class="active">
            <i class="icon reader-icon"></i><span>读者管理</span>
          </router-link>
          <router-link to="/admin/categories" class="menu-item" active-class="active">
            <i class="icon category-icon"></i><span>类型管理</span>
          </router-link>
          <router-link to="/admin/announcements" class="menu-item" active-class="active">
            <i class="icon announcement-icon"></i><span>公告管理</span>
          </router-link>
          <router-link to="/admin/settings" class="menu-item" active-class="active">
            <i class="icon setting-icon"></i><span>管理员管理</span>
          </router-link>
        </div>
      </div>
      <div class="menu-group">
        <div class="menu-title">统计分析</div>
        <div class="menu-items">
          <router-link to="/admin/statistics" class="menu-item" active-class="active">
            <i class="icon stats-icon"></i><span>统计分析</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 此处如有需要可加入逻辑，例如响应式高亮处理
</script>

<style scoped>
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
.menu-items {
  display: flex;
  flex-direction: column;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.3s;
}
.menu-item:hover,
.menu-item.active {
  background-color: #409EFF;
}
.menu-item i {
  margin-right: 10px;
  font-size: 16px;
}
</style>