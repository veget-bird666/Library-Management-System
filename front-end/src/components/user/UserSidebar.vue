<template>
  <div class="sidebar">
    <div class="logo">
      <img src="@/assets/logo.png" alt="用户中心" />
      <span>读者服务</span>
    </div>
    <div class="menu">
      <div class="menu-group">
        <div class="menu-title">读者服务</div>
        <div class="menu-items">
          <router-link to="/user/books" class="menu-item" active-class="active">
            <i class="icon book-icon"></i><span>图书浏览</span>
          </router-link>
          <router-link to="/user/borrow" class="menu-item" active-class="active">
            <i class="icon borrow-icon"></i><span>我的借阅</span>
          </router-link>
          <router-link to="/user/profile" class="menu-item" active-class="active">
            <i class="icon profile-icon"></i><span>个人中心</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 完全复制管理员侧边栏样式 */
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