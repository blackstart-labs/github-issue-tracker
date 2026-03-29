<template>
  <div class="app-sidebar-wrapper">
    <Transition name="fade">
      <div v-if="uiStore.isSidebarOpen" class="sidebar-overlay" @click="uiStore.toggleSidebar(false)"></div>
    </Transition>
    
    <aside :class="['app-sidebar', { 'is-open': uiStore.isSidebarOpen }]">
      <div class="sidebar-header desktop-only">
        <h3 v-if="title">{{ title }}</h3>
      </div>
      <div class="sidebar-header mobile-only">
        <h3 v-if="title">{{ title }}</h3>
        <button class="close-btn" @click="uiStore.toggleSidebar(false)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      
      <div class="sidebar-content">
        <slot></slot>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'

defineOptions({ name: 'AppSidebar' })

defineProps({
  title: {
    type: String,
    default: 'Filters'
  }
})

const uiStore = useUiStore()
</script>

<style scoped>
.app-sidebar {
  width: 280px;
  background-color: var(--color-bg);
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-right: 1px solid var(--color-border);
}

.sidebar-overlay {
  display: none;
}

.sidebar-header {
  padding: var(--space-16) var(--space-24);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-header h3 {
  margin: 0;
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: var(--space-4);
  margin: calc(var(--space-4) * -1);
}

.sidebar-content {
  padding: var(--space-24);
  flex: 1;
  overflow-y: auto;
}

.mobile-only { display: none; }

/* Mobile behavior: off-canvas drawer */
@media (max-width: 768px) {
  .app-sidebar-wrapper {
    position: absolute;
    z-index: 50;
  }
  
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 40;
  }
  
  .app-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
    background-color: var(--color-surface);
  }
  
  .app-sidebar.is-open {
    transform: translateX(0);
  }

  .desktop-only { display: none; }
  .mobile-only { display: flex; }
}
</style>
