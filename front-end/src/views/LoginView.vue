<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/api'

const router = useRouter()
const selectedRole = ref('user')

const formData = ref({
  email: '',
  password: ''
})

const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  try {
    // 表单验证
    if (!formData.value.email || !formData.value.password) {
      errorMessage.value = '请填写所有必填字段'
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    const response = await login({
      email: formData.value.email,
      password: formData.value.password,
      isAdmin: selectedRole.value === 'admin'
    })

    // 存储用户信息
    localStorage.setItem('user', JSON.stringify({
      username: response.username, // 假设后端返回了用户名
      isAdmin: selectedRole.value === 'admin'
    }))

    if (selectedRole.value === 'admin') {
      router.push('/admin/borrow')
    } else {
      router.push('/user')
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '登录失败，请重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <div class="left-section">
        <div class="title-container">
          <h1>Library<br>Management<br>System</h1>
          
          <p class="register-hint">
            If you don't have an account,<br>
            <router-link to="/register" class="link">Register here</router-link>.
          </p>
        </div>
      </div>

      <div class="right-section">
        <div class="login-box">
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <input 
                type="email" 
                v-model="formData.email" 
                placeholder="Your email address" 
              />
            </div>
            
            <div class="form-group">
              <input 
                type="password" 
                v-model="formData.password" 
                placeholder="Password" 
              />
              <a href="#" class="recovery-link">Recovery password</a>
            </div>

            <div class="form-group role-select">
              <label>Sign in as:</label>
              <div class="role-options">
                <label class="role-option">
                  <input type="radio" v-model="selectedRole" value="user" name="role">
                  <span class="role-text">User</span>
                </label>
                <label class="role-option">
                  <input type="radio" v-model="selectedRole" value="admin" name="role">
                  <span class="role-text">Admin</span>
                </label>
              </div>
            </div>

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <button 
              type="submit" 
              class="sign-in-btn"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>

            <div class="divider">
              <span>or continue with</span>
            </div>

            <div class="social-login">
              <button type="button" class="social-btn google">
                <img src="@/assets/google.svg" alt="Google" />
              </button>
              <button type="button" class="social-btn apple">
                <img src="@/assets/apple.svg" alt="Apple" />
              </button>
              <button type="button" class="social-btn facebook">
                <img src="@/assets/facebook.svg" alt="Facebook" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.login-content {
  display: flex;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  padding: 60px;
  gap: 160px;
}

.left-section {
  flex: 1.5;
  display: flex;
  justify-content: flex-start;
  padding-left: 80px;
}

.title-container {
  max-width: 800px;
}

.right-section {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 450px;
}

.login-box {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 40px;
  width: 100%;
}

h1 {
  font-size: 5.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 2rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.register-hint {
  color: #666;
  line-height: 1.5;
  font-size: 1.2rem;
  margin-top: 2rem;
}

.link {
  color: #4F6EF7;
  text-decoration: none;
  font-weight: 500;
}

.form-group {
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  background: #f8f9fd;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #4F6EF7;
}

.recovery-link {
  display: block;
  text-align: right;
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.sign-in-btn {
  width: 100%;
  padding: 15px;
  background: #4F6EF7;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sign-in-btn:hover {
  background: #3d5af5;
}

.divider {
  text-align: center;
  margin: 2rem 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 80px);
  height: 1px;
  background: #e0e0e0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: white;
  padding: 0 20px;
  color: #666;
  font-size: 0.9rem;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-btn {
  width: 50px;
  height: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.social-btn:hover {
  transform: translateY(-2px);
}

.social-btn img {
  width: 24px;
  height: 24px;
}

@media (max-width: 1200px) {
  .login-content {
    padding: 40px;
    gap: 60px;
  }

  .left-section {
    padding-left: 20px;
  }

  h1 {
    font-size: 4rem;
  }
}

@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    gap: 40px;
    padding: 20px;
  }

  .left-section {
    padding-left: 0;
    justify-content: center;
    text-align: center;
  }

  .right-section {
    width: 100%;
  }

  h1 {
    font-size: 3rem;
  }

  .register-hint {
    font-size: 1rem;
  }
}

.role-select {
  margin-bottom: 2rem;
}

.role-select label {
  display: block;
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.role-options {
  display: flex;
  gap: 1.5rem;
}

.role-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.role-option input[type="radio"] {
  width: auto;
  margin-right: 0.5rem;
  cursor: pointer;
}

.role-text {
  color: #1a1a1a;
  font-size: 1rem;
}

.error-message {
  color: #ff4d4f;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
}

.sign-in-btn:disabled {
  background-color: #b7b7b7;
  cursor: not-allowed;
}
</style> 