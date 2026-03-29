import { githubApi } from './interceptors'

/**
 * Parses Link header to find rel="last" for total pages
 */
export function parseLinkHeader(header) {
  if (!header) return null
  const links = {}
  header.split(',').forEach(part => {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/)
    if (match) links[match[2]] = match[1]
  })
  return links
}

export const githubService = {
  // 1. Repo metadata
  getRepo(owner, repo) {
    return githubApi.get(`/repos/${owner}/${repo}`)
  },

  // 2. Paginated issues list + filter params
  getIssues(owner, repo, params = {}) {
    return githubApi.get(`/repos/${owner}/${repo}/issues`, { params })
  },

  // 3. Single issue detail
  getIssue(owner, repo, issueNumber) {
    return githubApi.get(`/repos/${owner}/${repo}/issues/${issueNumber}`)
  },

  // 4. Issue comments
  getIssueComments(owner, repo, issueNumber) {
    return githubApi.get(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`)
  },

  // 5. Issue timeline events
  getIssueTimeline(owner, repo, issueNumber) {
    return githubApi.get(`/repos/${owner}/${repo}/issues/${issueNumber}/timeline`)
  },

  // 6. Labels list
  getLabels(owner, repo) {
    // Labels can be paginated, for simplicity we might just fetch the first 100
    return githubApi.get(`/repos/${owner}/${repo}/labels`, { params: { per_page: 100 } })
  },

  // 7. Milestones list
  getMilestones(owner, repo) {
    return githubApi.get(`/repos/${owner}/${repo}/milestones`, { params: { state: 'all', per_page: 100 } })
  },

  // 8. Assignees (Contributors)
  getAssignees(owner, repo) {
    return githubApi.get(`/repos/${owner}/${repo}/assignees`, { params: { per_page: 100 } })
  },

  // 9. Repo search
  searchRepos(query, params = { per_page: 5 }) {
    return githubApi.get('/search/repositories', { 
      params: { q: query, ...params } 
    })
  },

  // 10. Rate limit status
  getRateLimit() {
    return githubApi.get('/rate_limit')
  }
}
