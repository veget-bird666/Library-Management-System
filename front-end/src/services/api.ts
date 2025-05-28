import axios from 'axios'

const BASE_URL = '/api'

interface RegisterData {
  username: string
  email: string
  password: string
  isAdmin: boolean
}

interface LoginData {
  email: string
  password: string
  isAdmin: boolean
}


export const register = async (data: RegisterData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const login = async (data: LoginData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, data)
    return response.data
  } catch (error) {
    throw error
  }
} 

