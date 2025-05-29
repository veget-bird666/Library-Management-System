<template>
    <div class="content-area">
      <!-- 标题保持原有样式 -->
      <div class="search-bar">
        <h2>用户管理</h2>
      </div>
  
      <!-- 核心提示区域 -->
      <div class="dev-notice">
        <div class="notice-card">
          <i class="icon icon-warning"></i>
          <p class="notice-text">当前功能正在开发中，敬请期待！</p>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue';
  import {  } from '../api/userManage';

  
  </script>
  
  <style scoped>
  /* 保持与图书管理页面一致的布局 */
  content-area {
  padding: 20px;
  min-height: calc(100vh - 60px);
}

.search-bar {
  margin-bottom: 20px;
}

.simple-notice {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
}

.notice-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 16px;
}

.el-icon-warning-outline {
  font-size: 20px;
  color: #e6a23c;
}
  </style>