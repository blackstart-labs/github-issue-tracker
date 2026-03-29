import { storeToRefs } from 'pinia'
import { useRepoStore } from '@/stores/repo'
import { githubService } from '@/api/github'
import { useUiStore } from '@/stores/ui'

export function useRepo() {
  const repoStore = useRepoStore()
  const uiStore = useUiStore()
  const { currentOwner, currentRepo, metadata, hasSelectedRepo, repoFullName } = storeToRefs(repoStore)

  async function fetchRepoMetadata(owner, repo) {
    try {
      repoStore.setRepo(owner, repo)
      const response = await githubService.getRepo(owner, repo)
      repoStore.setMetadata(response.data)
    } catch (e) {
      uiStore.addToast({ type: 'error', title: 'Repo Not Found', message: `Could not load ${owner}/${repo}` })
      repoStore.clearRepo()
      throw e // so caller can handle 404
    }
  }

  return {
    currentOwner,
    currentRepo,
    metadata,
    repoFullName,
    hasSelectedRepo,
    fetchRepoMetadata
  }
}
