<template>
    <div class="user-container">
      <!-- 用户侧边导航 -->
      <UserSidebar />
  
      <!-- 主内容区 -->
      <div class="main-wrapper">
        <!-- 用户顶部信息栏 -->
        <UserTopBar />
  
        <!-- 可滚动内容区域 -->
        <div class="content-viewport">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import UserSidebar from '../components/user/UserSidebar.vue';
  import UserTopBar from '../components/user/UserTopBar.vue';
  </script>
  
  <style scoped>
  /* 整体布局结构 */
  .user-container {
    --user-primary-color: #409EFF;  /* 主色调调整 */
    --user-bg-color: #f8f9fa;      /* 背景色更明亮 */
    
    display: flex;
    min-height: 100vh;
    background-color: var(--user-bg-color);
  }
  
  /* 主内容区自适应 */
  .main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; /* 解决flex布局溢出问题 */
  }
  
  /* 内容视窗优化 */
  .content-viewport {
    flex: 1;
    padding: 24px;                /* 增大内边距 */
    overflow-y: auto;             
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06); /* 增加层次感 */
    border-radius: 8px 0 0 0;     /* 左上圆角 */
    margin: 16px 16px 0 16px;     /* 外间距统一 */
  }
  
  /* 过渡动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* 响应式适配 */
  @media (max-width: 768px) {
    .user-container {
      flex-direction: column;
    }
    
    .content-viewport {
      margin: 8px;
      border-radius: 8px;
    }
  }
  </style>