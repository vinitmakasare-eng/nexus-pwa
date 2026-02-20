<script setup lang="ts">
import { ref } from 'vue'
import { useDetailStore } from '../stores/detail'
import { usePhotoStore, PHOTO_POSITIONS } from '../stores/photo'
import { useFlowStore } from '../stores/flow'

const detailStore = useDetailStore()
const photoStore = usePhotoStore()
const flowStore = useFlowStore()

const isSubmitting = ref(false)
const submitted = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  
  // Mock API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  console.log('Final Inspection Result:', {
    vehicle: detailStore.details,
    photosCount: photoStore.capturedCount
  })
  
  isSubmitting.value = false
  submitted.value = true
}

const reset = () => {
  detailStore.resetVehicle()
  photoStore.resetPhotos()
  flowStore.resetFlow()
  submitted.value = false
}
</script>

<template>
  <div class="review-submit glass-card fade-in-up">
    <div v-if="!submitted">
      <div class="screen-header">
        <h2 class="gradient-text">Review Inspection</h2>
        <p class="text-secondary">Please verify all details and photos before final submission.</p>
      </div>

      <!-- Vehicle Summary -->
      <div class="summary-section">
        <h3>Vehicle Details</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">VIN:</span>
            <span class="value">{{ detailStore.details.vin || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Make/Model:</span>
            <span class="value">{{ detailStore.details.make }} {{ detailStore.details.model }}</span>
          </div>
          <div class="info-item">
            <span class="label">Year:</span>
            <span class="value">{{ detailStore.details.year }}</span>
          </div>
          <div class="info-item">
            <span class="label">Plate:</span>
            <span class="value uppercase">{{ detailStore.details.licensePlate }}</span>
          </div>
        </div>
      </div>

      <!-- Photo Summary -->
      <div class="summary-section">
        <h3>Photos ({{ photoStore.capturedCount }})</h3>
        <div class="photo-preview-grid">
          <div 
            v-for="pos in PHOTO_POSITIONS" 
            :key="pos"
            class="photo-preview-item"
          >
            <img 
              v-if="photoStore.getPhotoByPosition(pos)" 
              :src="photoStore.getPhotoByPosition(pos)?.preview" 
              class="thumb" 
            />
            <div class="pos-label">{{ pos }}</div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button 
          class="btn btn-secondary" 
          :disabled="isSubmitting"
          @click="flowStore.prevStep"
        >
          ← Back
        </button>
        <button 
          class="btn btn-primary" 
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Inspection ✓' }}
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div v-else class="success-message text-center">
      <div class="success-icon">✅</div>
      <h2 class="gradient-text">Inspection Submitted!</h2>
      <p class="text-secondary">All data and photos have been successfully uploaded.</p>
      <button class="btn btn-primary mt-xl" @click="reset">New Inspection</button>
    </div>
  </div>
</template>

<style scoped>
.review-submit {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--space-2xl);
}

.screen-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.summary-section {
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-card);
}

.summary-section h3 {
  font-size: 1.1rem;
  margin-bottom: var(--space-md);
  color: var(--accent-start);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.info-item {
  display: flex;
  gap: var(--space-sm);
}

.info-item .label {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.info-item .value {
  font-weight: 500;
}

.uppercase { text-transform: uppercase; }

.photo-preview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-sm);
}

.photo-preview-item {
  position: relative;
  aspect-ratio: 1;
  background: rgba(255,255,255,0.05);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.photo-preview-item .thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pos-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  font-size: 0.5rem;
  padding: 2px;
  text-align: center;
}

.actions {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-xl);
}

.actions .btn {
  flex: 1;
  justify-content: center;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: var(--space-md);
}

.mt-xl { margin-top: var(--space-xl); }

@media (max-width: 480px) {
  .info-grid { grid-template-columns: 1fr; }
  .photo-preview-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
