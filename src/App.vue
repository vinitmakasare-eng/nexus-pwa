<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useClientStore } from './stores/client'
import { useAuthStore } from './stores/auth'
import { useFlowStore } from './stores/flow'

const clientStore = useClientStore()
const authStore = useAuthStore()
const flowStore = useFlowStore()

const isStandalone = ref(false)

onMounted(() => {
  const hasSessionStarted = sessionStorage.getItem('blaze_session_active');

  if (!hasSessionStarted) {
    localStorage.removeItem('blaze_captured_photos');
    sessionStorage.setItem('blaze_session_active', 'true');
  }
  // Detect if the app is running in standalone mode (installed PWA)
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
  
  // Initial client resolution and theme application
  clientStore.applyTheme()
})

const handleBack = () => {
  flowStore.prevStep()
}
</script>

<template>
  <!-- Animated background -->
  <div class="bg-gradient"></div>

  <!-- Global Header / Native-like Toolbar -->
  <header class="app-header" :class="{ 'standalone-header': isStandalone }">
    <div class="container header-inner">
      <div class="left-actions">
        <!-- Persistent Back Button for PWA usage -->
        <button 
          v-if="!flowStore.isFirstStep && isStandalone" 
          class="icon-btn back-btn" 
          @click="handleBack"
          aria-label="Back"
        >
          ←
        </button>
        <div class="brand">
          <span class="icon">{{ clientStore.activeClient?.theme.logoIcon || '🔥' }}</span>
          <span class="name gradient-text" v-if="!isStandalone">{{ clientStore.clientName }}</span>
          <span class="name" v-else>{{ clientStore.clientName }}</span>
        </div>
      </div>
      
      <div class="user-info" v-if="authStore.isAuthenticated">
        <span class="username" v-if="!isStandalone">{{ authStore.user?.username }}</span>
        <button class="logout-btn" @click="authStore.logout">
          {{ isStandalone ? 'Sign Out' : 'Logout' }}
        </button>
      </div>
    </div>
  </header>

  <!-- Main Flow Container -->
  <main class="app-main" :class="{ 'standalone-main': isStandalone }">
    <RouterView />
  </main>

  <!-- Footer - Hidden in Standalone mode for native feel -->
  <footer class="app-footer" v-if="!isStandalone">
    <div class="container text-center">
      <p class="text-secondary">© {{ new Date().getFullYear() }} Nexus PWA · Unified Inspection Hub</p>
    </div>
  </footer>
</template>

<style scoped>
.app-header {
  height: 64px;
  background: rgba(15, 15, 35, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-card);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  transition: all var(--transition-normal);
}

.standalone-header {
  height: 80px; /* Slightly taller for notch/status bar area */
  padding-top: 20px;
  background: var(--bg-primary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.left-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 800;
  font-size: 1.25rem;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-card);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all var(--transition-normal);
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--accent-start);
}

.app-main {
  padding-top: var(--space-xl);
  min-height: calc(100vh - 128px);
}

.standalone-main {
  min-height: calc(100vh - 80px);
  padding-bottom: env(safe-area-inset-bottom);
}

.app-footer {
  height: 64px;
  display: flex;
  align-items: center;
  border-top: 1px solid var(--border-card);
  margin-top: var(--space-3xl);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.username {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.logout-btn {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: none;
  border: 1px solid var(--border-card);
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.logout-btn:hover {
  color: var(--text-primary);
  border-color: var(--text-muted);
}
</style>
