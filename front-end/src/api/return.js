import request from '../utils/request'

// 获取用户已借阅的图书列表
export const getBorrowedBooks = async (params) => {
  return request.get('/api/borrowed', { params })
}

// 提交还书请求
export const returnBook = async (data) => {
  return request.post('/api/return', data)
}