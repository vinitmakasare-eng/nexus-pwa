<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>

<template>
  <div class="feature-card glass-card">
    <div class="feature-icon">{{ icon }}</div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-description">{{ description }}</p>
  </div>
</template>

<style scoped>
.feature-card {
  padding: var(--space-xl);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-accent);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  background: rgba(139, 92, 246, 0.12);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
}

.feature-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
}

.feature-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
