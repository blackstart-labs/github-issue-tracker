<template>
  <div class="issue-card">
    <!-- Implemented in Step 12 -->
    Issue #{{ issue.number }}: {{ issue.title }}
  </div>
</template>

<script setup>
defineOptions({ name: 'IssueCard' })
defineProps({ issue: Object })
</script>
