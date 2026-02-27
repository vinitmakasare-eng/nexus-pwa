<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { usePhotoStore, PHOTO_POSITIONS } from '../stores/photo'
import { useFlowStore } from '../stores/flow'
import CameraStencil from '../components/CameraStencil.vue'

const photoStore = usePhotoStore()
const flowStore = useFlowStore()

const showCamera = ref(false)
const currentPosition = ref('')
const videoElement = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)

  const isIOS = computed(() => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
})
const startCamera = async (position: string) => {
  currentPosition.value = position
  showCamera.value = true
  
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    })
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream.value
    }
  } catch (err) {
    console.error('Error accessing camera:', err)
    alert('Could not access camera. Please ensure you have granted permission.')
    closeCamera()
  }
}

const capture = () => {
  if (!videoElement.value || !canvasElement.value) return
  
  const video = videoElement.value
  const canvas = canvasElement.value
  
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.drawImage(video, 0, 0)
  
  canvas.toBlob(async (blob) => {
    if (blob) {
      const file = new File([blob], `${currentPosition.value.replace(' ', '_')}.jpg`, { type: 'image/jpeg' })
      await photoStore.setPhoto(currentPosition.value, {
        file,
        preview: URL.createObjectURL(blob)
      })
      closeCamera()
    }
  }, 'image/jpeg', 0.8)
}

const closeCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
  stream.value = null
  showCamera.value = false
}

const handleNext = () => {
  if (photoStore.isComplete) {
    flowStore.nextStep()
  }
}

onUnmounted(() => {
  closeCamera()
})
</script>

<template>
  <div class="photo-capture">
    <div class="screen-header fade-in-up">
      <h2 class="gradient-text">Photo Capture</h2>
      <p class="text-secondary">Capture all 8 positions to proceed. Tap a position to open the camera.</p>
      <div class="progress-pill">
        {{ photoStore.capturedCount }} / {{ photoStore.totalRequired }} captured
      </div>
    </div>

    <div class="photo-grid">
      <div 
        v-for="pos in PHOTO_POSITIONS" 
        :key="pos" 
        class="photo-slot glass-card fade-in-up"
        :class="{ 'has-photo': !!photoStore.getPhotoByPosition(pos) }"
        @click="startCamera(pos)"
      >
        <div v-if="photoStore.getPhotoByPosition(pos)" class="preview-container">
          <img :src="photoStore.getPhotoByPosition(pos)?.preview" alt="Preview" class="preview-img" />
          <div class="photo-label-overlay">{{ pos }}</div>
        </div>
        <div v-else class="placeholder-container">
          <span class="icon">📷</span>
          <span class="label">{{ pos }}</span>
        </div>
      </div>
    </div>

    <!-- Camera Overlay UI -->
    <Teleport to="body">
      <div v-if="showCamera" class="camera-ui">
        <video 
          ref="videoElement" 
          autoplay 
          playsinline 
          :class="['camera-preview', { 'is-ios': isIOS }]"
        ></video>
        <canvas ref="canvasElement" style="display: none;"></canvas>

        <!-- Dynamic Overlay Guide -->
        <div class="camera-overlay">
          <div class="guide-frame">
            <CameraStencil :position="currentPosition" />
          </div>
          
          <div class="camera-header">
            <div class="position-badge">
              <span class="pulse-dot"></span>
              {{ currentPosition }}
            </div>
            <button class="close-btn" @click="closeCamera">✕</button>
          </div>

          <div class="camera-footer">
            <button class="capture-btn" @click="capture" aria-label="Capture Photo">
              <div class="inner-circle"></div>
              <div class="btn-ripple"></div>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="actions fade-in-up">
      <button class="btn btn-secondary" @click="flowStore.prevStep">← Back</button>
      <button 
        class="btn btn-primary" 
        :disabled="!photoStore.isComplete"
        @click="handleNext"
      >
        Next: Review & Submit →
      </button>
    </div>
  </div>
</template>

<style scoped>
.photo-capture {
  padding: var(--space-xl) 0;
}

.screen-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.progress-pill {
  display: inline-block;
  margin-top: var(--space-md);
  padding: 0.4rem 1rem;
  background: var(--glow-purple);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-start);
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

.photo-slot {
  aspect-ratio: 4/3;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  border: 1px dashed var(--border-card);
}

.has-photo {
  border-style: solid;
  border-color: var(--accent-start);
}

.placeholder-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  color: var(--text-muted);
}

.placeholder-container .icon {
  font-size: 1.5rem;
}

.placeholder-container .label {
  font-size: 0.75rem;
  font-weight: 500;
}

.preview-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-label-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 0.2rem;
  font-size: 0.65rem;
  text-align: center;
}

/* Camera UI */
.camera-ui {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

    /* Default for Android */
.camera-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Specific fix for iOS */
.camera-preview.is-ios {
  object-fit: cover;
  background-color: #000;
}
.camera-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-xl);
  pointer-events: none;
}

.guide-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  aspect-ratio: 4/3;
  /* Removed border from here as CameraStencil handles corners */
  z-index: 5;
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  z-index: 10;
  pointer-events: auto;
}

.position-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.6);
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.close-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: calc(var(--space-2xl) + env(safe-area-inset-bottom));
  z-index: 10;
  pointer-events: auto;
}

@media (orientation: landscape) {
  .camera-footer {
  position: absolute;
  right: var(--space-xl);
  top: 50%;
  transform: translateY(-50%);
  padding-bottom: 0;
  z-index: 10;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
}

.capture-btn {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  border: none;
  padding: 6px;
  cursor: pointer;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.btn-ripple {
  position: absolute;
  inset: -10px;
  border: 2px solid white;
  border-radius: 50%;
  opacity: 0.3;
  animation: ripple 2s infinite;
}

@keyframes ripple {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.3); opacity: 0; }
}

.inner-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #000;
  transition: transform 0.1s;
}

.capture-btn:active .inner-circle {
  transform: scale(0.9);
}

.actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

@media (max-width: 600px) {
  .photo-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
