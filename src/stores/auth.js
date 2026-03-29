import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { githubApi } from '@/api/interceptors' // Adjust path if needed

export const useAuthStore = defineStore('auth', () => {
  // We sync token directly to local storage
  const token = useLocalStorage('github_pat', '')
  const user = ref(null)
  
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  async function fetchUser() {
    if (!token.value) {
      user.value = null
      return
    }
    try {
      const response = await githubApi.get('/user')
      user.value = response.data
    } catch (error) {
      console.error('Failed to authenticate token', error)
      user.value = null
      token.value = '' // clear invalid token
    }
  }

  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      fetchUser()
    } else {
      user.value = null
    }
  }

  function clearToken() {
    setToken('')
  }

  return {
    token,
    user,
    isAuthenticated,
    currentUser,
    setToken,
    clearToken,
    fetchUser
  }
})
