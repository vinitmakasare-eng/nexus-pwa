<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDetailStore } from '../stores/detail'
import { useFlowStore } from '../stores/flow'

const detailStore = useDetailStore()
const flowStore = useFlowStore()

const vin = ref(detailStore.details.vin)
const error = ref('')

const isValid = computed(() => vin.value.length === 17)

const handleNext = () => {
  if (isValid.value) {
    detailStore.updateDetails({ vin: vin.value.toUpperCase() })
    flowStore.nextStep()
  } else {
    if (vin.value.length === 0) {
      error.value = 'VIN is required'
    } else {
      error.value = `VIN must be exactly 17 characters (currently ${vin.value.length})`
    }
  }
}
</script>

<template>
  <div class="vin-capture glass-card fade-in-up">
    <div class="screen-header">
      <h2 class="gradient-text">VIN Capture</h2>
      <p class="text-secondary">Enter the vehicle identification number to start the inspection.</p>
    </div>

    <div class="form-group">
      <label for="vin">Vehicle Identification Number (VIN)</label>
      <input 
        id="vin"
        v-model="vin"
        type="text" 
        maxlength="17" 
        placeholder="17-character ID..."
        class="vin-input"
        :class="{ 'input-error': error || (vin.length > 0 && !isValid) }"
        @input="error = ''"
      />
      <div class="input-footer">
        <span v-if="error || (vin.length > 0 && !isValid)" class="error-text">
          {{ error || `Required: 17 characters (${vin.length}/17)` }}
        </span>
        <span v-else class="vin-count">{{ vin.length }}/17</span>
      </div>
    </div>

    <div class="info-card">
      <p>💡 Tip: You can usually find the VIN on the driver's side dashboard or door jamb.</p>
    </div>

    <div class="actions">
      <button 
        class="btn btn-primary w-full" 
        @click="handleNext"
      >
        Continue to Details →
      </button>
    </div>
  </div>
</template>

<style scoped>
.vin-capture {
  max-width: 500px;
  margin: 0 auto;
  padding: var(--space-2xl);
}

.screen-header {
  margin-bottom: var(--space-xl);
  text-align: center;
}

.form-group {
  margin-bottom: var(--space-lg);
}

label {
  display: block;
  margin-bottom: var(--space-xs);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.vin-input {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: monospace;
  font-size: 1.25rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all var(--transition-normal);
}

.vin-input:focus {
  outline: none;
  border-color: var(--accent-start);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px var(--glow-purple);
}

.input-error {
  border-color: #ef4444;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-xs);
  min-height: 1.2rem;
}

.error-text {
  font-size: 0.8rem;
  color: #ef4444;
}

.vin-count {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-left: auto;
}

.info-card {
  padding: var(--space-md);
  background: rgba(139, 92, 246, 0.1);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-xl);
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.w-full {
  width: 100%;
  justify-content: center;
}

.actions {
  margin-top: var(--space-xl);
}
</style>
