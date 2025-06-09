import request from '../utils/request'

// 查询管理员
export const searchAdmins = async (params: {
  keyword?: string
}) => {
  return request.get('/api/auth/admin/search', { params })
} 