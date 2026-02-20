<script setup lang="ts">
import { computed, onMounted, defineAsyncComponent, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClientStore } from '../stores/client'
import { useFlowStore } from '../stores/flow'

// Async screens for code splitting
const VinCapture = defineAsyncComponent(() => import('../screens/VinCapture.vue'))
const DetailCapture = defineAsyncComponent(() => import('../screens/DetailCapture.vue'))
const PhotoCapture = defineAsyncComponent(() => import('../screens/PhotoCapture.vue'))
const ReviewSubmit = defineAsyncComponent(() => import('../screens/ReviewSubmit.vue'))

const clientStore = useClientStore()
const flowStore = useFlowStore()
const route = useRoute()
const router = useRouter()

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

onMounted(() => {
  syncUrlToState()
})

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
/* Styles remain the same */
.flow-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
  padding-bottom: var(--space-4xl);
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
