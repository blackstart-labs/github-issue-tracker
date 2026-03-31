<template>
  <div class="issue-timeline" v-if="events.length > 0">
    <div class="timeline-event" v-for="event in events" :key="event.id">
      <div class="event-icon-column">
        <div class="icon-circle" :class="`event-${event.event}`">
          <svg v-if="event.event === 'labeled'" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.75 2h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.22.53l-6.47 6.47a.75.75 0 01-1.06 0L1.47 10.47a.75.75 0 010-1.06l6.47-6.47a.75.75 0 01.53-.22zM12 5.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
          <svg v-else-if="event.event === 'closed'" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.28 6.78a.75.75 0 00-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5z"></path><path fill-rule="evenodd" d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"></path></svg>
          <svg v-else-if="event.event === 'milestoned'" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.75 2h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.22.53l-6.47 6.47a.75.75 0 01-1.06 0L1.47 10.47a.75.75 0 010-1.06l6.47-6.47a.75.75 0 01.53-.22zM12 5.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="4"></circle></svg>
        </div>
      </div>
      <div class="event-content">
        <img :src="event.actor.avatar_url" class="actor-avatar" :alt="event.actor.login" />
        <strong>{{ event.actor.login }}</strong>
        <span v-if="event.event === 'labeled'">
          added label <IssueLabel :label="event.label" v-if="event.label" />
        </span>
        <span v-else-if="event.event === 'closed'">closed this issue</span>
        <span v-else-if="event.event === 'reopened'">reopened this issue</span>
        <span v-else-if="event.event === 'milestoned'">added this to the <strong>{{ event.milestone.title }}</strong> milestone</span>
        <span v-else-if="event.event === 'assigned'">was assigned to this issue</span>
        <span v-else>{{ event.event }}</span>
        <span class="text-muted">{{ formatRelative(event.created_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { githubService } from '@/api/github'
import { formatRelative } from '@/utils/date'
import IssueLabel from './IssueLabel.vue'

defineOptions({ name: 'IssueTimeline' })

const props = defineProps({
  owner: String,
  repo: String,
  number: String
})

const events = ref([])

onMounted(async () => {
  try {
    const res = await githubService.getIssueTimeline(props.owner, props.repo, props.number)
    // Filter out comment events as they are handled separately or combined?
    // Generally GitHub REST for /timeline includes comments but we use /comments for the main comment list.
    // For this simple tracker, let's just show main "action" events.
    events.value = res.data.filter(e => ['labeled', 'closed', 'reopened', 'milestoned', 'assigned', 'unlabeled', 'cross-referenced'].includes(e.event))
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.issue-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  margin-bottom: var(--space-32);
}

.timeline-event {
  display: flex;
  gap: var(--space-12);
  align-items: center;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.event-icon-column {
  width: 40px;
  display: flex;
  justify-content: center;
}

.icon-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--color-surface-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.event-closed { background-color: var(--color-closed); color: white; }
.event-reopened { background-color: var(--color-open); color: white; }

.event-content {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.actor-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>
