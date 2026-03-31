<template>
  <div class="issue-detail-view" v-if="issue">
    <header class="issue-header">
      <div class="repo-nav">
        <router-link :to="`/${owner}/${repo}/issues`" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to issues
        </router-link>
      </div>

      <div class="issue-title-row">
        <h1 class="issue-title">
          {{ issue.title }} <span class="issue-number">#{{ issue.number }}</span>
        </h1>
        <div class="issue-actions">
          <AppButton variant="secondary" size="small" @click="copyUrl">
            {{ copied ? 'URL Copied!' : 'Copy URL' }}
          </AppButton>
          <a :href="issue.html_url" target="_blank" rel="noopener noreferrer">
            <AppButton variant="primary" size="small">Open in GitHub</AppButton>
          </a>
        </div>
      </div>

      <div class="issue-meta">
        <AppBadge :variant="issue.state === 'open' ? 'open' : 'closed'">
          <svg v-if="issue.state === 'open'" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.28 6.78a.75.75 0 00-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5z"></path>
            <path fill-rule="evenodd" d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"></path>
          </svg>
          {{ issue.state.charAt(0).toUpperCase() + issue.state.slice(1) }}
        </AppBadge>
        <span class="meta-item">
          <strong>{{ issue.user.login }}</strong> opened this issue {{ formatRelative(issue.created_at) }}
        </span>
        <span class="text-separator" v-if="issue.comments > 0">•</span>
        <span class="meta-item" v-if="issue.comments > 0">
          {{ issue.comments }} comments
        </span>
      </div>
    </header>

    <div class="issue-content-layout">
      <div class="issue-main-content">
        <div class="issue-body markdown-body" v-html="renderedBody"></div>
        
        <IssueTimeline :owner="owner" :repo="repo" :number="number" />
        
        <div class="issue-comments">
          <IssueComment v-for="comment in comments" :key="comment.id" :comment="comment" />
        </div>
      </div>

      <aside class="issue-sidebar">
        <div class="sidebar-section" v-if="issue.assignees && issue.assignees.length > 0">
          <h3 class="section-title">Assignees</h3>
          <div class="assignees-list">
            <div v-for="assignee in issue.assignees" :key="assignee.id" class="user-item">
              <img :src="assignee.avatar_url" class="mini-avatar" alt="Avatar"/>
              <span>{{ assignee.login }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-section" v-if="issue.labels && issue.labels.length > 0">
          <h3 class="section-title">Labels</h3>
          <div class="labels-list">
            <IssueLabel v-for="label in issue.labels" :key="label.id" :label="label" />
          </div>
        </div>

        <div class="sidebar-section" v-if="issue.milestone">
          <h3 class="section-title">Milestone</h3>
          <div class="milestone-item">
            <div class="milestone-title">{{ issue.milestone.title }}</div>
            <!-- Simple progress bar if needed -->
          </div>
        </div>
      </aside>
    </div>
  </div>
  
  <div class="loading-state" v-else-if="isLoading">
    <AppSkeleton type="text" class="h-8 w-64 mb-4" />
    <AppSkeleton type="text" class="h-4 w-full mb-2" />
    <AppSkeleton type="text" class="h-4 w-full mb-2" />
    <AppSkeleton type="card" class="h-64 w-full" />
  </div>

  <div class="error-state" v-else-if="hasError">
    <p class="text-danger">Failed to load issue #{{ number }}.</p>
    <AppButton @click="loadIssue">Retry</AppButton>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { githubService } from '@/api/github'
import { formatRelative } from '@/utils/date'
import { renderMarkdown } from '@/utils/markdown'
import AppButton from '@/components/common/AppButton.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import IssueLabel from '@/components/issue/IssueLabel.vue'
import IssueComment from '@/components/issue/IssueComment.vue'
import IssueTimeline from '@/components/issue/IssueTimeline.vue'

defineOptions({ name: 'IssueDetailView' })

const route = useRoute()
const owner = route.params.owner
const repo = route.params.repo
const number = route.params.number

const issue = ref(null)
const comments = ref([])
const isLoading = ref(true)
const hasError = ref(false)
const copied = ref(false)

const renderedBody = computed(() => {
  return issue.value ? renderMarkdown(issue.value.body) : ''
})

const title = useTitle()

async function loadIssue() {
  isLoading.value = true
  hasError.value = false
  try {
    const [issueRes, commentsRes] = await Promise.all([
      githubService.getIssue(owner, repo, number),
      githubService.getIssueComments(owner, repo, number)
    ])
    issue.value = issueRes.data
    comments.value = commentsRes.data
    title.value = `${issue.value.title} · #${issue.value.number} · ${owner}/${repo}`
  } catch (err) {
    console.error(err)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

function copyUrl() {
  navigator.clipboard.writeText(window.location.href)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

onMounted(loadIssue)
</script>

<style scoped>
.issue-detail-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-32) var(--space-24);
  width: 100%;
}

.issue-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-24);
  margin-bottom: var(--space-32);
}

.repo-nav {
  margin-bottom: var(--space-16);
}

.back-link {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
}
.back-link:hover {
  color: var(--color-text-primary);
}

.issue-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-24);
  margin-bottom: var(--space-16);
}

.issue-title {
  font-size: var(--text-3xl);
  font-weight: 500;
  margin: 0;
  color: var(--color-text-primary);
}

.issue-number {
  color: var(--color-text-muted);
  font-weight: 400;
}

.issue-actions {
  display: flex;
  gap: var(--space-8);
  flex-shrink: 0;
}

.issue-meta {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  flex-wrap: wrap;
}

.meta-item strong {
  color: var(--color-text-primary);
}

.issue-content-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: var(--space-32);
}

@media (max-width: 992px) {
  .issue-content-layout {
    grid-template-columns: 1fr;
  }
}

.issue-main-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-32);
}

.issue-body {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: var(--space-24);
}

.issue-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
}

.sidebar-section {
  padding-top: var(--space-16);
  border-top: 1px solid var(--color-border);
}
.sidebar-section:first-child {
  padding-top: 0;
  border-top: none;
}

.section-title {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-12);
}

.user-item {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  margin-bottom: var(--space-8);
}

.mini-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.labels-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.milestone-title {
  font-size: var(--text-sm);
  font-weight: 500;
}

.loading-state, .error-state {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-48) var(--space-24);
  width: 100%;
}

.h-8 { height: 2rem; }
.h-4 { height: 1rem; }
.h-64 { height: 16rem; }
.w-64 { width: 16rem; }
.w-full { width: 100%; }
.mb-2 { margin-bottom: 0.5rem; }
</style>
