<template>
  <el-dialog
    v-model="dialogVisible"
    title="借阅申请列表"
    width="80%"
  >
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-select v-model="statusFilter" placeholder="申请状态" clearable @change="handleStatusChange">
        <el-option label="待处理" :value="0" />
        <el-option label="已批准" :value="1" />
        <el-option label="已拒绝" :value="2" />
      </el-select>
    </div>

    <el-table
      v-loading="loading"
      :data="applications"
      style="width: 100%"
    >
      <el-table-column prop="book_title" label="图书名称" />
      <el-table-column prop="user_nickname" label="申请人" />
      <el-table-column prop="user_account" label="借书卡号" />
      <el-table-column prop="formatted_apply_time" label="申请时间" />
      <el-table-column prop="status_text" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status_text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="user_remark" label="申请备注" show-overflow-tooltip />
      <el-table-column prop="admin_remark" label="处理备注" show-overflow-tooltip />
      <el-table-column label="操作" width="200" v-if="userStore.userInfo?.admin_account">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 0"
            type="success"
            size="small"
            @click="handleApprove(row)"
          >
            批准
          </el-button>
          <el-button
            v-if="row.status === 0"
            type="danger"
            size="small"
            @click="handleReject(row)"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import useUserStore from '../stores/user'
import { getBorrowApplications } from '../api/borrow'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:dialogVisible'])

const userStore = useUserStore()
const loading = ref(false)
const applications = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const statusFilter = ref(null)

// 获取申请列表
const fetchApplications = async () => {
  if (!userStore.userInfo?.admin_account) {
    ElMessage.warning('请先登录管理员账号')
    dialogVisible.value = false
    return
  }

  loading.value = true
  try {
    const response = await getBorrowApplications({
      page: currentPage.value,
      size: pageSize.value,
      admin_account: userStore.userInfo.admin_account,
      status: statusFilter.value
    })

    if (response.data.success) {
      applications.value = response.data.data
      total.value = response.data.pagination.total
    }
  } catch (error) {
    console.error('获取借阅申请失败：', error)
    ElMessage.error('获取借阅申请失败')
  } finally {
    loading.value = false
  }
}

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case 0:
      return 'warning'
    case 1:
      return 'success'
    case 2:
      return 'danger'
    default:
      return 'info'
  }
}

// 处理状态筛选变化
const handleStatusChange = () => {
  currentPage.value = 1
  fetchApplications()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchApplications()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchApplications()
}

// 批准申请
const handleApprove = async (application) => {
  try {
    await ElMessageBox.prompt('请输入处理备注', '批准申请', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入处理备注（选填）'
    })
    
    // TODO: 调用批准申请的API
    ElMessage.success('申请已批准')
    fetchApplications()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// 拒绝申请
const handleReject = async (application) => {
  try {
    await ElMessageBox.prompt('请输入拒绝原因', '拒绝申请', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入拒绝原因'
    })
    
    // TODO: 调用拒绝申请的API
    ElMessage.success('申请已拒绝')
    fetchApplications()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// 监听对话框可见性
const dialogVisible = ref(props.dialogVisible)
watch(() => props.dialogVisible, (val) => {
  dialogVisible.value = val
  if (val) {
    statusFilter.value = null
    currentPage.value = 1
    fetchApplications()
  }
})
watch(dialogVisible, (val) => {
  emit('update:dialogVisible', val)
})
</script>

<style scoped>
.filter-section {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 