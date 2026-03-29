import { useAuthStore } from '@/stores/auth'

export function useGitHubAuth() {
  const authStore = useAuthStore()

  /**
   * Set and persist the GitHub PAT
   * @param {string} token 
   */
  function login(token) {
    authStore.setToken(token)
  }

  /**
   * Clear the token and logout
   */
  function logout() {
    authStore.clearToken()
  }

  return {
    login,
    logout
  }
}
