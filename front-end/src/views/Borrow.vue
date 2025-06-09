<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BorrowDialog from '../components/BorrowDialog.vue'
import ReturnDialog from '../components/ReturnDialog.vue'
import ApplicationDialog from '../components/ApplicationDialog.vue'
import { getBorrowList, deleteBorrowRecord } from '../api/borrow'

const borrowDialogVisible = ref(false)
const returnDialogVisible = ref(false)
const applicationDialogVisible = ref(false)
const borrowRecords = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取借阅记录列表
const fetchBorrowList = async () => {
  loading.value = true
  try {
    console.log('正在获取借阅记录，参数：', {
      page: currentPage.value,
      size: pageSize.value,
      status: 1
    })

    const response = await getBorrowList({
      page: currentPage.value,
      size: pageSize.value,
      status: 1 // 只显示在借的记录
    })

    console.log('获取到的借阅记录：', response.data)

    if (response.data.success) {
      borrowRecords.value = response.data.data
      total.value = response.data.pagination.total
      console.log('更新后的列表数据：', borrowRecords.value)
    }
  } catch (error) {
    console.error('获取借阅记录失败：', error)
    ElMessage.error('获取借阅记录失败')
  } finally {
    loading.value = false
  }
}

// 删除借阅记录
const handleDelete = async (record) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 ${record.nickname} 借阅的《${record.book_title}》的记录吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    console.log('正在删除记录：', record)
    const response = await deleteBorrowRecord(record.record_id)
    console.log('删除记录响应：', response.data)

    if (response.data.success) {
      ElMessage.success('删除成功')
      fetchBorrowList() // 刷新列表
    }
  } catch (error) {
    if (error === 'cancel') return
    console.error('删除记录失败：', error)
    ElMessage.error(error.response?.data?.message || '删除失败')
  }
}

// 分页处理
const handleSizeChange = (val) => {
  console.log('改变每页显示数量：', val)
  pageSize.value = val
  fetchBorrowList()
}

const handleCurrentChange = (val) => {
  console.log('改变当前页码：', val)
  currentPage.value = val
  fetchBorrowList()
}

const showBorrowDialog = () => {
  borrowDialogVisible.value = true
}

const showReturnDialog = () => {
  returnDialogVisible.value = true
}

const handleBorrowSuccess = () => {
  console.log('借书成功，刷新列表')
  fetchBorrowList() // 借书成功后刷新列表
}

const handleReturnSuccess = () => {
  console.log('还书成功，刷新列表')
  fetchBorrowList() // 还书成功后刷新列表
}

onMounted(() => {
  console.log('组件挂载，开始获取借阅记录')
  fetchBorrowList()
})
</script>

<template>
  <div class="content-area">
    <div class="header">
      <h2>借阅管理</h2>
      <div class="action-buttons">
        <el-button type="primary" @click="showBorrowDialog">
          借书
        </el-button>
        <el-button type="success" @click="showReturnDialog">
          还书
        </el-button>
        <el-button type="info" @click="applicationDialogVisible = true">
          查看申请
        </el-button>
      </div>
    </div>

    <!-- 借阅记录列表 -->
    <div class="borrow-list">
      <el-table
        v-loading="loading"
        :data="borrowRecords"
        style="width: 100%"
      >
        <el-table-column prop="book_title" label="图书名称" />
        <el-table-column prop="nickname" label="借阅人" />
        <el-table-column prop="user_account" label="借书卡号" />
        <el-table-column prop="borrow_time" label="借书时间" />
        <el-table-column prop="should_return_time" label="应还时间" />
        <el-table-column prop="status_text" label="状态" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空数据提示 -->
      <el-empty
        v-if="!loading && (!borrowRecords || borrowRecords.length === 0)"
        description="暂无借阅记录"
      />

      <div class="pagination" v-if="total > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 借书弹窗 -->
    <BorrowDialog
      v-model:dialogVisible="borrowDialogVisible"
      @borrow-success="handleBorrowSuccess"
    />

    <!-- 还书弹窗 -->
    <ReturnDialog
      v-model:dialogVisible="returnDialogVisible"
      @return-success="handleReturnSuccess"
    />

    <!-- 申请列表弹窗 -->
    <ApplicationDialog
      v-model:dialogVisible="applicationDialogVisible"
    />
  </div>
</template>

<style scoped>
.content-area {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.borrow-list {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>