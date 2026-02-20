<script setup lang="ts">
</script>

<template>
  <section class="about-page">
    <div class="container">
      <div class="about-header fade-in-up">
        <h1 class="about-title">
          About <span class="gradient-text">Blaze PWA</span>
        </h1>
        <p class="about-subtitle text-secondary">
          A modern Progressive Web App template built on cutting-edge technology.
        </p>
      </div>

      <div class="about-grid">
        <div class="about-card glass-card fade-in-up delay-1">
          <h3>🏗️ Architecture</h3>
          <p class="text-secondary">
            Built with Vue 3 Composition API, TypeScript, and Vite. Uses file-based routing
            via <code>unplugin-vue-router</code> and auto-imports via <code>unplugin-auto-import</code>.
          </p>
        </div>

        <div class="about-card glass-card fade-in-up delay-2">
          <h3>📦 PWA Capabilities</h3>
          <p class="text-secondary">
            Service worker auto-registration, offline caching with Workbox,
            web manifest for installability, and auto-update strategy.
          </p>
        </div>

        <div class="about-card glass-card fade-in-up delay-3">
          <h3>🎨 Design System</h3>
          <p class="text-secondary">
            Dark glassmorphism theme with CSS custom properties, animated gradient blobs,
            responsive layout, and the Inter typeface from Google Fonts.
          </p>
        </div>

        <div class="about-card glass-card fade-in-up delay-4">
          <h3>🔀 Routing</h3>
          <p class="text-secondary">
            File-based routing powered by <code>unplugin-vue-router</code>. Simply add
            <code>.vue</code> files to <code>src/pages/</code> and routes are generated automatically.
          </p>
        </div>
      </div>

      <div class="back-link fade-in-up delay-5">
        <RouterLink to="/" class="btn btn-secondary">← Back to Home</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-page {
  padding-top: var(--space-4xl);
  padding-bottom: var(--space-4xl);
}

.about-header {
  text-align: center;
  margin-bottom: var(--space-3xl);
}

.about-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  margin-bottom: var(--space-md);
}

.about-subtitle {
  font-size: 1.1rem;
  max-width: 500px;
  margin-inline: auto;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-3xl);
}

.about-card {
  padding: var(--space-xl);
}

.about-card h3 {
  font-size: 1.15rem;
  margin-bottom: var(--space-sm);
}

.about-card p {
  font-size: 0.9rem;
  line-height: 1.7;
}

.about-card code {
  font-size: 0.82rem;
  padding: 0.15em 0.4em;
  background: rgba(139, 92, 246, 0.15);
  border-radius: 4px;
  color: var(--accent-start);
}

.back-link {
  text-align: center;
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
}
</style>
