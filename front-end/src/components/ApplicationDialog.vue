<template>
  <el-dialog
    v-model="dialogVisible"
    title="借阅申请列表"
    width="80%"
  >
    <el-table
      v-loading="loading"
      :data="applications"
      style="width: 100%"
    >
      <el-table-column prop="book_title" label="图书名称" />
      <el-table-column prop="user_nickname" label="申请人" />
      <el-table-column prop="user_account" label="借书卡号" />
      <el-table-column prop="formatted_apply_time" label="申请时间" />
      <el-table-column prop="status_text" label="状态" />
      <el-table-column prop="user_remark" label="申请备注" show-overflow-tooltip />
      <el-table-column prop="admin_remark" label="处理备注" show-overflow-tooltip />
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
import { ElMessage } from 'element-plus'

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

// 获取申请列表
const fetchApplications = async () => {
  loading.value = true
  try {
    const response = await getBorrowApplications({
      page: currentPage.value,
      size: pageSize.value,
      admin_account: userStore.userInfo.admin_account
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

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchApplications()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchApplications()
}

// 监听对话框可见性
const dialogVisible = ref(props.dialogVisible)
watch(() => props.dialogVisible, (val) => {
  dialogVisible.value = val
  if (val) {
    fetchApplications()
  }
})
watch(dialogVisible, (val) => {
  emit('update:dialogVisible', val)
})
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 