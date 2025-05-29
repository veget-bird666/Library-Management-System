import axios from 'axios';

const BASE_URL = '/api/userBook';

/* 图书数据类型 */
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

