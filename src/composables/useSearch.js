import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

/**
 * Generic search debouncer
 * @param {Function} fetchAction Async function that takes the search string and executes search
 * @param {Number} delay Debounce delay in ms
 */
export function useSearch(fetchAction, delay = 300) {
  const query = ref('')
  const isSearching = ref(false)
  const error = ref(null)

  const debouncedFetch = useDebounceFn(async (q) => {
    isSearching.value = true
    error.value = null
    try {
      await fetchAction(q)
    } catch (e) {
      error.value = e
    } finally {
      isSearching.value = false
    }
  }, delay)

  watch(query, (newVal) => {
    if (newVal === null || newVal === undefined) return
    debouncedFetch(newVal)
  })

  return {
    query,
    isSearching,
    error,
    debouncedFetch
  }
}
