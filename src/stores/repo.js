import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRepoStore = defineStore('repo', () => {
  const currentOwner = ref(null)
  const currentRepo = ref(null)
  
  // Stores raw metadata from GET /repos/{owner}/{repo}
  const metadata = ref(null)
  
  const hasSelectedRepo = computed(() => !!currentOwner.value && !!currentRepo.value)
  
  const repoFullName = computed(() => {
    if (hasSelectedRepo.value) {
      return `${currentOwner.value}/${currentRepo.value}`
    }
    return ''
  })

  function setRepo(owner, repo) {
    if (currentOwner.value !== owner || currentRepo.value !== repo) {
      metadata.value = null // reset metadata when repo changes
    }
    currentOwner.value = owner
    currentRepo.value = repo
  }

  function setMetadata(data) {
    metadata.value = data
  }

  function clearRepo() {
    currentOwner.value = null
    currentRepo.value = null
    metadata.value = null
  }

  return {
    currentOwner,
    currentRepo,
    metadata,
    
    hasSelectedRepo,
    repoFullName,
    
    setRepo,
    setMetadata,
    clearRepo
  }
})
