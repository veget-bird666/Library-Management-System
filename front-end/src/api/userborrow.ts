import request from '../utils/request'

// 获取用户已借阅的图书列表
export const getUserBorrowedBooks = async (params: {
  userAccount: string
  page?: number
  size?: number
}) => {
  return request.get('/api/userborrow/borrowed', { params })
}

// 申请借阅图书
export const applyBorrowBook = async (data: {
  bookId: string
  userAccount: string
  userRemark?: string
}) => {
  return request.post('/api/userborrow/apply', data)
}

// 获取用户的借阅申请列表
export const getUserBorrowApplications = async (params: {
  userAccount: string
  page?: number
  size?: number
}) => {
  return request.get('/api/userborrow/applications', { params })
}

// 搜索可借阅的图书
export const searchAvailableBooks = async (params: {
  keyword?: string
  page?: number
  size?: number
}) => {
  return request.get('/api/books/search', { params })
}
