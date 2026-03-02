<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClientStore } from '../stores/client'
import { useFlowStore } from '../stores/flow'
import { checkIsIOS, isStandalone , isPwaLaunch } from '../utils/device'

// Async screens for code splitting
const VinCapture = defineAsyncComponent(() => import('../screens/VinCapture.vue'))
const DetailCapture = defineAsyncComponent(() => import('../screens/DetailCapture.vue'))
const PhotoCapture = defineAsyncComponent(() => import('../screens/PhotoCapture.vue'))
const ReviewSubmit = defineAsyncComponent(() => import('../screens/ReviewSubmit.vue'))

const clientStore = useClientStore()
const flowStore = useFlowStore()
const route = useRoute()
const router = useRouter()

const isIOS = ref(false)
const isInstalled = ref(false)
// Map step IDs to components
const screenMap: Record<string, any> = {
  'vin-capture': VinCapture,
  'vehicle-details': DetailCapture,
  'photo-capture': PhotoCapture,
  'review-submit': ReviewSubmit
}

const currentScreen = computed(() => {
  const stepId = flowStore.currentStepId
  return stepId ? (screenMap[stepId] || null) : null
})

// PWA Install Logic
const deferredPrompt = ref<any>(null)
const showInstallButton = ref(false)

// Initialize client and step from URL
const syncUrlToState = () => {
  const clientId = route.query.client as string || null
  const stepIndex = parseInt(route.query.step as string) || 0
  
  if (clientStore.activeClient?.id !== clientId) {
    clientStore.initializeClient(clientId)
  }
  
  if (flowStore.currentStepIndex !== stepIndex) {
    flowStore.setStep(stepIndex)
  }
}

// Update URL when state changes
const syncStateToUrl = (newIndex: number) => {
  router.push({
    query: {
      ...route.query,
      step: newIndex.toString()
    }
  })
}

// Inside onMounted in your main flow file
const checkStandalone = () => {
  const isPwa = isPwaLaunch() || isStandalone();
  isInstalled.value = isStandalone() || isPwa;
  isIOS.value = checkIsIOS();

  if (isInstalled.value) {
    showInstallButton.value = false;
  }
}

onMounted(() => {
  syncUrlToState()

  checkStandalone()
  if (isIOS.value && !isInstalled.value) {
    setTimeout(() => {
      isIOS.value = false;
    }, 15000);
  } 
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later.
    deferredPrompt.value = e
    // Update UI notify the user they can install the PWA
    showInstallButton.value = true
  })

  window.addEventListener('appinstalled', () => {
    // Hide the install button
    showInstallButton.value = false
    deferredPrompt.value = null
  })
})

const handleInstall = async () => {
  if (!deferredPrompt.value) return
  
  // Show the install prompt
  deferredPrompt.value.prompt()
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.value.userChoice
  if (outcome === 'accepted') {
    showInstallButton.value = false
  }
  deferredPrompt.value = null
}

// Watch for internal store changes (e.g. user clicks "Next")
watch(() => flowStore.currentStepIndex, (newIndex) => {
  if (newIndex !== parseInt(route.query.step as string)) {
    syncStateToUrl(newIndex)
  }
})

// Watch for browser history changes (e.g. user clicks "Back" button)
watch(() => route.query.step, (newStep) => {
  const index = parseInt(newStep as string) || 0
  if (flowStore.currentStepIndex !== index) {
    flowStore.setStep(index)
  }
})

watch(() => route.query.client, (newClient) => {
  clientStore.initializeClient(newClient as string)
  flowStore.resetFlow()
})
</script>

<template>
  <div class="flow-container container">
    <!-- PWA Install Banner (Only on first step) -->
    <div v-if="showInstallButton && flowStore.currentStepIndex === 0" class="install-banner fade-in-up">
      <div class="banner-content">
        <div class="icon-wrapper">
          <span class="icon">✨</span>
        </div>
        <div class="banner-text">
          <h3>Install Nexus PWA</h3>
          <p>Add to home screen for the full app experience</p>
        </div>
      </div>
      <button class="install-btn" @click="handleInstall">Install</button>
    </div>
   <div v-if="isIOS && !isInstalled && !showInstallButton && flowStore.currentStepIndex === 0"
      class="install-banner ios-banner fade-in-up">
      <div class="banner-content">
        <div class="icon-wrapper ios-icon">
          <span class="icon">📲</span>
        </div>
        <div class="banner-text">
          <h3>Install Nexus PWA</h3>
          <p>
            Tap the <strong>share</strong> icon
            <span class="ios-share-svg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M12 15V3m0 0l-4 4m4-4l4 4M9 11H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-3" />
              </svg>
            </span>
           <strong> URL</strong> bar, scroll down and select <strong>'Add to Home Screen'</strong>.
          </p>
        </div>
      </div>
    </div>

    <!-- Stepper Bar -->
    <div v-if="!clientStore.loading" class="stepper-section fade-in-up">
      <div class="stepper-track">
        <div 
          class="stepper-progress" 
          :style="{ width: flowStore.progress + '%' }"
        ></div>
        <div 
          v-for="(step, index) in clientStore.flowSteps" 
          :key="step"
          class="step-dot"
          :class="{ 
            'active': index === flowStore.currentStepIndex,
            'completed': index < flowStore.currentStepIndex 
          }"
          @click="flowStore.setStep(index)"
        >
          <div class="dot-inner"></div>
          <span class="step-label">{{ index + 1 }}</span>
        </div>
      </div>
      <div class="client-header">
        <div class="logo-icon">{{ clientStore.activeClient?.theme.logoIcon }}</div>
        <h1>{{ clientStore.clientName }}</h1>
      </div>
    </div>

    <!-- Screen Rendering Area -->
    <div class="screen-wrapper" v-if="!clientStore.loading">
      <Transition name="fade-slide" mode="out-in">
        <component :is="currentScreen" :key="flowStore.currentStepId" />
      </Transition>
    </div>

    <!-- Loading State -->
    <div v-else class="loading-state">
      <div class="spinner"></div>
      <p>Initializing your experience...</p>
    </div>
  </div>
</template>

<style scoped>
.flow-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  padding-bottom: var(--space-4xl);
}

.install-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem var(--space-xl);
  background: var(--glass-bg);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-md);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  background: var(--gradient-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.banner-text h3 {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
}

.banner-text p {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 2px 0 0 0;
}

.install-btn {
  background: var(--accent-start);
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.install-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--glow-purple);
}

.stepper-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
}

.client-header {
  text-align: center;
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.logo-icon {
  font-size: 2rem;
}

.client-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.stepper-track {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 600px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin: var(--space-xl) 0;
}

.stepper-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--gradient-accent);
  transition: width var(--transition-slow);
  z-index: 1;
}

.step-dot {
  position: relative;
  width: 40px;
  height: 40px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-card);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.step-dot.active {
  border-color: var(--accent-start);
  box-shadow: 0 0 15px var(--glow-purple);
  transform: scale(1.1);
}

.step-dot.completed {
  background: var(--accent-start);
  border-color: var(--accent-start);
}

.step-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.step-dot.completed .step-label,
.step-dot.active .step-label {
  color: white;
}

.screen-wrapper {
  flex: 1;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
/* iOS Specific Banner Styling */
.ios-banner {
  background: rgba(255, 255, 255, 0.05);
}

.ios-icon {
  background: linear-gradient(135deg, #007AFF, #5AC8FA);
}

.ios-share-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px;
  border-radius: 4px;
  margin: 0 2px;
  vertical-align: middle;
  color: #007AFF;
}

.banner-text strong {
  color: #fff;
  font-weight: 700;
}
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  height: 50vh;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent-start);
  border-radius: 50%;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .step-dot {
    width: 32px;
    height: 32px;
  }
}
</style>
