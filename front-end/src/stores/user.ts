import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from './user.d'

const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  const token = ref('')
  const userId = ref('')
  const userRole = ref('')

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  const setUserId = (id: string) => {
    userId.value = id
    localStorage.setItem('userId', id)
  }

  const setUserRole = (role: string) => {
    userRole.value = role
    localStorage.setItem('userRole', role)
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const clearUserInfo = () => {
    userInfo.value = null
    token.value = ''
    userId.value = ''
    userRole.value = ''
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
  }

  const isLoggedIn = () => {
    return !!userInfo.value && !!token.value && !!userId.value
  }

  return {
    userInfo,
    token,
    userId,
    userRole,
    setUserInfo,
    setToken,
    setUserId,
    setUserRole,
    clearUserInfo,
    isLoggedIn
  }
})

export default useUserStore 