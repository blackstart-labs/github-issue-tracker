<template>
  <div class="comment-item">
    <aside class="comment-author-aside">
      <img :src="comment.user.avatar_url" class="comment-avatar" :alt="comment.user.login" />
    </aside>
    
    <div class="comment-card">
      <header class="comment-header">
        <div class="header-left">
          <strong>{{ comment.user.login }}</strong>
          <span class="text-muted">commented {{ formatRelative(comment.created_at) }}</span>
        </div>
        <div class="header-right" v-if="comment.author_association && comment.author_association !== 'NONE'">
          <AppBadge variant="neutral">{{ comment.author_association.charAt(0) + comment.author_association.slice(1).toLowerCase() }}</AppBadge>
        </div>
      </header>
      
      <div class="comment-body markdown-body" v-html="renderedBody"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatRelative } from '@/utils/date'
import { renderMarkdown } from '@/utils/markdown'
import AppBadge from '@/components/common/AppBadge.vue'

defineOptions({ name: 'IssueComment' })

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

const renderedBody = computed(() => {
  return renderMarkdown(props.comment.body)
})
</script>

<style scoped>
.comment-item {
  display: flex;
  gap: var(--space-16);
  margin-bottom: var(--space-32);
}

.comment-author-aside {
  flex-shrink: 0;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
}

.comment-card {
  flex: 1;
  min-width: 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-8) var(--space-16);
  background-color: var(--color-surface-subtle);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--text-sm);
}

.header-left {
  display: flex;
  gap: var(--space-8);
  align-items: center;
}

.comment-body {
  padding: var(--space-16) var(--space-24);
}

@media (max-width: 576px) {
  .comment-item {
    flex-direction: column;
    gap: var(--space-8);
  }
  .comment-author-aside {
    display: none;
  }
}
</style>
