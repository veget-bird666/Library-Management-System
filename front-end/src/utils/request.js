import axios from 'axios'
import { ElMessage } from 'element-plus'


// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:3000', // 替换为实际的后端服务地址
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.log('err' + error)
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default request