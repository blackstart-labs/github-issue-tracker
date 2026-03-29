<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p>A minimal, production-grade GitHub Issue Tracker built with Vue 3.</p>
      <div class="footer-links">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer">API Docs</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineOptions({ name: 'AppFooter' })
</script>

<style scoped>
.app-footer {
  padding: var(--space-32) var(--space-24);
  background-color: var(--color-bg);
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-16);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  text-align: center;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: var(--space-16);
}

.footer-links a {
  color: var(--color-text-secondary);
  text-decoration: none;
}
.footer-links a:hover {
  color: var(--color-text-primary);
  text-decoration: underline;
}

@media (min-width: 768px) {
  .footer-content {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
