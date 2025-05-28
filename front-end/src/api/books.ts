//books.ts
import axios from 'axios';

const BASE_URL = '/api/books';

/** 图书数据类型 */
export interface Book {
  book_id: string;
  title: string;
  publisher: string;
  publication_year: number;
  category: string;
  author: string;
  price: number;
  description?: string;
  language: string;
}

/** 通用 API 响应类型 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination: {   // 分页信息提到外层
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  message?: string;
}

/** 分页响应结构 */
export interface PaginatedBooks {
  data: Book[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * 获取所有图书（带分页和过滤）
 * 返回值包含 data 和 pagination
 */
export const fetchBooks = async (params?: { // 🚨 此处参数需要明确类型
  page?: number;
  size?: number;
  category?: string;
  author?: string;
  year?: number;
  keyword?: string;
}): Promise<PaginatedBooks> => {
  const response = await axios.get<ApiResponse<Book[]>>(BASE_URL, { params });
  return {
    data: response.data.data,       // 实际图书数组
    pagination: response.data.pagination // 分页对象
  };
};

/**
 * 添加一本新书
 * 返回新插入的 book_id 和可选提示
 */
export const addBook = async (
  book: Book
): Promise<{ book_id: string; message?: string }> => {
  const response = await axios.post<ApiResponse<{ book_id: string }>>(BASE_URL, book);
  const resp = response.data;
  if (!resp.success) {
    throw new Error(resp.message || '添加图书失败');
  }
  return { book_id: resp.data.book_id, message: resp.message };
};

/**
 * 删除图书
 */
export const deleteBook = async (
  book_id: string
): Promise<{ message?: string }> => {
  const response = await axios.delete<ApiResponse<null>>(`${BASE_URL}/${book_id}`);
  const resp = response.data;
  if (!resp.success) {
    throw new Error(resp.message || '删除图书失败');
  }
  return { message: resp.message };
};

/**
 * 更新图书
 */
export const updateBook = async (
  book_id: string,
  updates: Partial<Omit<Book, 'book_id'>>
): Promise<{ message?: string }> => {
  const response = await axios.put<ApiResponse<null>>(
    `${BASE_URL}/${book_id}`,
    updates
  );
  const resp = response.data;
  if (!resp.success) {
    throw new Error(resp.message || '更新图书失败');
  }
  return { message: resp.message };
};
