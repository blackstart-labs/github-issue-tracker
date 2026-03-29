import axios from 'axios'

// We will import router and stores once they are built
// import router from '@/router'
// import { useUiStore } from '@/stores/ui'
// import { useRateLimitStore } from '@/stores/rateLimit' // We might put rate limit in ui or auth store as requested. Prompt says "useRateLimit composable" and "ui.js store for toast".

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }
})

// Request Interceptor: Attach PAT token
githubApi.interceptors.request.use(config => {
  const token = localStorage.getItem('github_pat')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

// Response Interceptor: Rate limits and Errors
githubApi.interceptors.response.use(
  response => {
    updateRateLimit(response.headers)
    return response
  },
  error => {
    if (error.response) {
      updateRateLimit(error.response.headers)
      const status = error.response.status
      
      if (status === 403 || status === 429) {
        // Rate limited
        window.dispatchEvent(new CustomEvent('github:rate-limited'))
      } else if (status === 404) {
        // Not found
        window.dispatchEvent(new CustomEvent('github:not-found', { detail: error.response.data.message }))
      }
    }
    return Promise.reject(error)
  }
)

function updateRateLimit(headers) {
  if (!headers) return
  const remaining = headers['x-ratelimit-remaining']
  const reset = headers['x-ratelimit-reset']
  
  if (remaining && reset) {
    window.dispatchEvent(new CustomEvent('github:rate-limit-update', { 
      detail: { remaining: parseInt(remaining, 10), reset: parseInt(reset, 10) }
    }))
  }
}

export { githubApi }
