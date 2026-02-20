<script setup lang="ts">
import { reactive } from 'vue'
import { useDetailStore } from '../stores/detail'
import { useFlowStore } from '../stores/flow'

const detailStore = useDetailStore()
const flowStore = useFlowStore()

const formData = reactive({ ...detailStore.details })

const handleNext = () => {
  detailStore.updateDetails(formData)
  flowStore.nextStep()
}

const handleBack = () => {
  flowStore.prevStep()
}
</script>

<template>
  <div class="details-capture glass-card fade-in-up">
    <div class="screen-header">
      <h2 class="gradient-text">Vehicle Details</h2>
      <p class="text-secondary">Please confirm or enter the vehicle information below.</p>
    </div>

    <div class="details-form">
      <div class="form-row">
        <div class="form-group">
          <label for="make">Make</label>
          <input id="make" v-model="formData.make" type="text" placeholder="e.g. Toyota" />
        </div>
        <div class="form-group">
          <label for="model">Model</label>
          <input id="model" v-model="formData.model" type="text" placeholder="e.g. Camry" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="year">Year</label>
          <input id="year" v-model="formData.year" type="number" placeholder="2024" />
        </div>
        <div class="form-group">
          <label for="color">Color</label>
          <input id="color" v-model="formData.color" type="text" placeholder="Black" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="mileage">Mileage</label>
          <input id="mileage" v-model="formData.mileage" type="text" placeholder="45,000" />
        </div>
        <div class="form-group">
          <label for="plate">License Plate</label>
          <input id="plate" v-model="formData.licensePlate" type="text" placeholder="ABC-1234" />
        </div>
      </div>

      <div class="form-group" v-if="formData.vin">
        <label>VIN</label>
        <input :value="formData.vin" type="text" disabled class="disabled-input" />
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-secondary" @click="handleBack" v-if="!flowStore.isFirstStep">
        ← Back
      </button>
      <button class="btn btn-primary" @click="handleNext">
        Next: Photo Capture →
      </button>
    </div>
  </div>
</template>

<style scoped>
.details-capture {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-2xl);
}

.screen-header {
  margin-bottom: var(--space-xl);
  text-align: center;
}

.details-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
}

input {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all var(--transition-normal);
}

input:focus {
  outline: none;
  border-color: var(--accent-start);
  background: rgba(255, 255, 255, 0.08);
}

.disabled-input {
  opacity: 0.6;
  cursor: not-allowed;
  font-family: monospace;
}

.actions {
  margin-top: var(--space-2xl);
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
}

.actions .btn {
  flex: 1;
  justify-content: center;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
