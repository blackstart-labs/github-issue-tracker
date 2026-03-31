<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="command-palette-overlay" @click.self="close">
        <div class="command-palette-container">
          <header class="palette-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              ref="searchInput"
              v-model="query" 
              placeholder="Search issues or jump to repo..." 
              class="palette-input"
              @keydown.down="moveDown"
              @keydown.up="moveUp"
              @keydown.enter="selectItem"
            />
            <div class="palette-esc">ESC</div>
          </header>
          
          <div class="palette-results">
            <div v-if="results.length > 0">
              <div 
                v-for="(item, index) in results" 
                :key="item.id" 
                :class="['palette-item', { 'is-active': index === activeIndex }]"
                @mouseenter="activeIndex = index"
                @click="selectItem"
              >
                <div class="item-icon">
                  <svg v-if="item.type === 'repo'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div class="item-info">
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-subtitle">{{ item.subtitle }}</div>
                </div>
                <div class="item-type-badge">{{ item.type }}</div>
              </div>
            </div>
            <div v-else-if="query" class="palette-empty">
              No results found for "{{ query }}"
            </div>
            <div v-else class="palette-empty">
              Type to search...
            </div>
          </div>
          
          <footer class="palette-footer">
            <div class="footer-tip">
              <span><kbd>↑↓</kbd> to navigate</span>
              <span><kbd>↵</kbd> to select</span>
            </div>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMagicKeys, useLocalStorage } from '@vueuse/core'
import { githubService } from '@/api/github'

defineOptions({ name: 'AppCommandPalette' })

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const router = useRouter()
const query = ref('')
const activeIndex = ref(0)
const searchInput = ref(null)
const recentRepos = useLocalStorage('github_issue_tracker_recent', [])

const searchResults = ref([])

const results = computed(() => {
  if (!query.value) {
    return recentRepos.value.map(r => ({
      id: r.id,
      title: r.full_name,
      subtitle: r.description,
      type: 'repo',
      url: `/${r.owner.login}/${r.name}/issues`
    })).slice(0, 5)
  }
  return searchResults.value
})

const { meta_k, ctrl_k, escape } = useMagicKeys()

watch([meta_k, ctrl_k], (v) => {
  if (v[0] || v[1]) {
    // Already handled in App.vue to open
  }
})

watch(escape, (v) => {
  if (v && props.isOpen) close()
})

watch(() => props.isOpen, (v) => {
  if (v) {
    nextTick(() => {
      searchInput.value?.focus()
      query.value = ''
      activeIndex.value = 0
    })
  }
})

watch(query, async (q) => {
  if (q.trim().length < 3) {
    searchResults.value = []
    return
  }
  try {
    const res = await githubService.searchRepos(q, { per_page: 5 })
    searchResults.value = res.data.items.map(r => ({
      id: r.id,
      title: r.full_name,
      subtitle: r.description,
      type: 'repo',
      url: `/${r.owner.login}/${r.name}/issues`
    }))
  } catch(e) {
    // console.error(e)
  }
})

function close() {
  emit('close')
}

function moveDown() {
  if (activeIndex.value < results.value.length - 1) activeIndex.value++
}

function moveUp() {
  if (activeIndex.value > 0) activeIndex.value--
}

function selectItem() {
  const item = results.value[activeIndex.value]
  if (item) {
    router.push(item.url)
    close()
  }
}
</script>

<style scoped>
.command-palette-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  padding-top: 15vh;
}

.command-palette-container {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-modal);
  box-shadow: var(--shadow-float);
  width: 100%;
  max-width: 600px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.palette-header {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  padding: 0 var(--space-16);
  border-bottom: 1px solid var(--color-border);
  height: 56px;
  color: var(--color-text-secondary);
}

.palette-input {
  flex: 1;
  background: none;
  border: none;
  height: 100%;
  padding: 0;
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  outline: none;
}

.palette-esc {
  font-size: var(--text-xs);
  padding: 2px 4px;
  background-color: var(--color-surface-subtle);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-muted);
}

.palette-results {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-8) 0;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  padding: var(--space-12) var(--space-16);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.palette-item.is-active {
  background-color: var(--color-surface-subtle);
}

.item-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.palette-item.is-active .item-icon {
  background-color: var(--color-surface);
  color: var(--color-accent);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: var(--text-base);
}

.item-subtitle {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-type-badge {
  font-size: var(--text-xs);
  padding: 2px 6px;
  border-radius: 4px;
  background-color: var(--color-surface-subtle);
  color: var(--color-text-muted);
  text-transform: capitalize;
}

.palette-empty {
  padding: var(--space-32);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.palette-footer {
  padding: var(--space-8) var(--space-16);
  background-color: var(--color-surface-subtle);
  border-top: 1px solid var(--color-border);
}

.footer-tip {
  display: flex;
  gap: var(--space-16);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

kbd {
  font-family: var(--font-display);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  padding: 0 4px;
  margin: 0 2px;
}
</style>
