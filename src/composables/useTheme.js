import { useColorMode } from '@vueuse/core'

export function useTheme() {
  // Leverages VueUse useColorMode to automatically handle OS preference 
  // and manage `data-theme` attribute on the `<html>` element.
  // Falls back to system preference by default.
  const mode = useColorMode({
    attribute: 'data-theme',
    modes: {
      light: 'light',
      dark: 'dark'
    },
    storageKey: 'github_issue_tracker_theme'
  })

  function toggleTheme() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(t) {
    if (['light', 'dark', 'auto'].includes(t)) {
      mode.value = t
    }
  }

  return {
    mode,
    toggleTheme,
    setTheme
  }
}
