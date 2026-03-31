<template>
  <div class="app-root">
    <AppHeader />
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <AppToast />
    <AppCommandPalette :is-open="isPaletteOpen" @close="isPaletteOpen = false" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useMagicKeys, useActiveElement } from '@vueuse/core'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppToast from '@/components/common/AppToast.vue'
import AppCommandPalette from '@/components/common/AppCommandPalette.vue'
import { useTheme } from '@/composables/useTheme'

// Initialize theme on app boot
useTheme()

const isPaletteOpen = ref(false)
const { meta_k, ctrl_k, slash } = useMagicKeys()
const activeElement = useActiveElement()

// Open palette with Cmd+K or Ctrl+K
watch([meta_k, ctrl_k], (v) => {
  if (v[0] || v[1]) {
    isPaletteOpen.value = true
  }
})

// Focus search with / if not already in an input
watch(slash, (v) => {
  if (v && activeElement.value?.tagName !== 'INPUT' && activeElement.value?.tagName !== 'TEXTAREA') {
    const searchInput = document.querySelector('input[placeholder*="Search"], input[placeholder*="Filter"]')
    if (searchInput) {
      searchInput.focus()
      // Prevent the / from being typed
      setTimeout(() => {
        if (searchInput.value.startsWith('/')) searchInput.value = searchInput.value.slice(1)
      }, 0)
    }
  }
})
</script>

<style scoped>
.app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
