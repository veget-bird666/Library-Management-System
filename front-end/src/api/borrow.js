import request from '../utils/request'

// 获取可借阅的图书列表
export const getAvailableBooks = async ({ keyword, page = 1, size = 10 }) => {
  if (!keyword) {
    throw new Error('搜索关键词不能为空');
  }
  return request.get('/api/borrow/available', { 
    params: {
      keyword,
      page,
      size
    }
  })
}

// 提交借阅请求
export const borrowBook = async (data) => {
  console.log("传入的借阅数据为");
  console.log(data);
  return request.post('/api/borrow', data)
}

// 获取用户已借阅的图书列表
export const getBorrowedBooks = async (params) => {
  return request.get('/api/borrow/borrowed', { params })
}

// 提交还书请求
export const returnBook = async (data) => {
  return request.post('/api/borrow/return', data)
}

// 获取所有借阅记录
export const getBorrowList = async (params) => {
  return request.get('/api/borrow/list', { params })
}

// 删除借阅记录
export const deleteBorrowRecord = async (recordId) => {
  return request.delete(`/api/borrow/${recordId}`)
}