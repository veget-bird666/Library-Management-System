<template>
  <div class="admin-container">
    <!-- 左侧菜单 -->
    <Sidebar />

    <!-- 主要内容区域 -->
    <div class="main-wrapper">
      <!-- 顶部栏 -->
      <TopBar />

      <!-- 内容区：内边距统一，路由组件带滚动条 -->
      <div class="content-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/admin/Sidebar.vue';  // 修正了文件名
import TopBar  from '../components/admin/TopBar.vue';
</script>

<style scoped>
/* 整体布局 */
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f6fa;
}

/* 去掉 main-content，改名更语义化 */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 顶栏固定高度 */
.content-area {
  flex: 1;
  padding: 20px;               /* 内边距与子页面保持一致 */
  overflow-y: auto;            /* 侧边菜单固定，内容区可滚动 */
  background: #fff;            /* 与弹窗、表单背景一致 */
  border-top: 1px solid #ebeef5;
}

/* 你可以在 global.css 或 theme.css 里统一定义这些变量 */
</style>
