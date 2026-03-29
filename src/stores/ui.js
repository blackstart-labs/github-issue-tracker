import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // Mobile sidebar layout
  const isSidebarOpen = ref(false)
  
  // Settings Panel
  const isSettingsPanelOpen = ref(false)

  // System Toast Notifications
  const toasts = ref([])
  let toastIdCounter = 0

  function toggleSidebar(force) {
    if (typeof force === 'boolean') {
      isSidebarOpen.value = force
    } else {
      isSidebarOpen.value = !isSidebarOpen.value
    }
  }

  function toggleSettingsPanel(force) {
    if (typeof force === 'boolean') {
      isSettingsPanelOpen.value = force
    } else {
      isSettingsPanelOpen.value = !isSettingsPanelOpen.value
    }
  }

  // Toast structure: { id, type (success|error|info), title, message, timeout }
  function addToast({ type = 'info', title = '', message = '', timeout = 5000 }) {
    const id = ++toastIdCounter
    toasts.value.push({ id, type, title, message })
    
    if (timeout > 0) {
      setTimeout(() => {
        removeToast(id)
      }, timeout)
    }
    
    return id
  }

  function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    isSidebarOpen,
    isSettingsPanelOpen,
    toasts,
    
    toggleSidebar,
    toggleSettingsPanel,
    addToast,
    removeToast
  }
})
