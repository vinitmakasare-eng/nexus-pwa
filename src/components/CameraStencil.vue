<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  position: string
}>()

const stencilType = computed(() => {
  const p = props.position.toLowerCase()
  // Mirroring logic: we use the same silhouette for opposite corners but flip it
  if (p.includes('front') && p.includes('left')) return 'corner'
  if (p.includes('front') && p.includes('right')) return 'corner'
  if (p.includes('rear') && p.includes('left')) return 'corner'
  if (p.includes('rear') && p.includes('right')) return 'corner'
  if (p.includes('front')) return 'front'
  if (p.includes('rear')) return 'rear'
  if (p.includes('left')) return 'side'
  if (p.includes('right')) return 'side'
  return 'default'
})

const isRightSide = computed(() => {
  const p = props.position.toLowerCase()
  // Flip for right-side/rear-right positions
  return p.includes('right')
})

const isRearCorner = computed(() => {
  const p = props.position.toLowerCase()
  return p.includes('rear') && (p.includes('left') || p.includes('right'))
})
</script>

<template>
  <div class="stencil-hud">
    <!-- Scanner Line Animation -->
    <div class="scanner-line"></div>
    
    <!-- Corner Brackets -->
    <div class="corner-bracket tl"></div>
    <div class="corner-bracket tr"></div>
    <div class="corner-bracket bl"></div>
    <div class="corner-bracket br"></div>

    <svg viewBox="0 0 400 300" class="stencil-svg" :class="{ 'flip-x': isRightSide, 'flip-y': isRearCorner && stencilType === 'corner' }">
      <defs>
        <filter id="stencil-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="stencil-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:var(--accent-start);stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:var(--accent-start);stop-opacity:0.05" />
        </linearGradient>
      </defs>

      <g class="stencil-art" filter="url(#stencil-glow)">
        <!-- EXACT SIDE VIEW SILHOUETTE (SUV style from user image) -->
        <template v-if="stencilType === 'side'">
          <path d="M40,210 L360,210 L355,185 C350,165 340,145 310,135 C280,125 240,120 200,122 C160,120 120,125 90,135 C60,145 50,165 45,185 L40,210 Z" class="silhouette-fill" />
          <path d="M40,210 L360,210 L355,185 C350,165 340,145 310,135 C280,125 240,120 200,122 C160,120 120,125 90,135 C60,145 50,165 45,185 L40,210 Z" class="silhouette-outline" />
          <circle cx="95" cy="210" r="28" class="silhouette-outline" />
          <circle cx="305" cy="210" r="28" class="silhouette-outline" />
        </template>

        <!-- EXACT FRONT VIEW (Derived from SUV style) -->
        <template v-if="stencilType === 'front'">
          <path d="M100,220 L100,175 C100,155 115,135 200,132 C285,135 300,155 300,175 L300,220 C300,220 260,210 200,210 C140,210 100,220 100,220 Z" class="silhouette-fill" />
          <path d="M100,220 L100,175 C100,155 115,135 200,132 C285,135 300,155 300,175 L300,220 C300,220 260,210 200,210 C140,210 100,220 100,220 Z" class="silhouette-outline" />
          <path d="M130,165 L270,165 L255,145 L145,145 Z" class="silhouette-detail" />
          <rect x="110" y="185" width="40" height="15" rx="4" class="silhouette-detail" />
          <rect x="250" y="185" width="40" height="15" rx="4" class="silhouette-detail" />
        </template>

        <!-- EXACT REAR VIEW (From user image) -->
        <template v-if="stencilType === 'rear'">
          <path d="M100,220 L100,175 C100,155 115,135 200,132 C285,135 300,155 300,175 L300,220 C300,220 260,210 200,210 C140,210 100,220 100,220 Z" class="silhouette-fill" />
          <path d="M100,220 L100,175 C100,155 115,135 200,132 C285,135 300,155 300,175 L300,220 C300,220 260,210 200,210 C140,210 100,220 100,220 Z" class="silhouette-outline" />
          <path d="M125,145 L275,145 L260,170 L140,170 Z" class="silhouette-detail" />
          <rect x="110" y="180" width="45" height="12" rx="2" class="silhouette-detail" />
          <rect x="245" y="180" width="45" height="12" rx="2" class="silhouette-detail" />
        </template>

        <!-- EXACT CORNER/3-4 VIEW (From user image) -->
        <template v-if="stencilType === 'corner'">
          <path d="M60,195 C60,185 70,175 90,165 C120,145 150,135 200,130 C250,125 310,145 340,175 C350,195 350,215 350,225 L65,225 C65,220 60,205 60,195 Z" class="silhouette-fill" />
          <path d="M60,195 C60,185 70,175 90,165 C120,145 150,135 200,130 C250,125 310,145 340,175 C350,195 350,215 350,225 L65,225 C65,220 60,205 60,195 Z" class="silhouette-outline" />
          <path d="M140,145 L260,150 L230,180 L145,180 Z" class="silhouette-detail" />
          <circle cx="115" cy="225" r="22" class="silhouette-outline" />
          <circle cx="290" cy="215" r="18" class="silhouette-outline" />
        </template>
      </g>
    </svg>

    <div class="hud-helper">
      <span class="helper-text">{{ position }}</span>
    </div>
  </div>
</template>

<style scoped>
.stencil-hud {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  overflow: hidden;
  z-index: 10;
}

.stencil-svg {
  width: 85%;
  height: 85%;
  max-width: 850px;
}

.flip-x {
  transform: scaleX(-1);
}

.silhouette-fill {
  fill: url(#stencil-grad);
}

.silhouette-outline {
  fill: none;
  stroke: var(--accent-start);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000;
  animation: draw-stencil 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.silhouette-detail {
  fill: none;
  stroke: var(--accent-start);
  stroke-width: 1.5;
  opacity: 0.35;
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  animation: draw-stencil 2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
}

@keyframes draw-stencil {
  to { stroke-dashoffset: 0; }
}

/* UI Elements */
.corner-bracket {
  position: absolute;
  width: 35px;
  height: 35px;
  border: 3px solid var(--accent-start);
  opacity: 0.4;
}

.tl { top: 30px; left: 30px; border-right: none; border-bottom: none; }
.tr { top: 30px; right: 30px; border-left: none; border-bottom: none; }
.bl { bottom: 30px; left: 30px; border-right: none; border-top: none; }
.br { bottom: 30px; right: 30px; border-left: none; border-top: none; }

.scanner-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-start), transparent);
  box-shadow: 0 0 15px var(--accent-start);
  animation: scan-vertical 4s linear infinite;
  opacity: 0.15;
}

@keyframes scan-vertical {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}

.hud-helper {
  position: absolute;
  bottom: 0%;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 24px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}
@media(orientation: landscape){
  .hud-helper{
      position: absolute;
      bottom: 20%;
      background: rgba(0, 0, 0, 0.7);
      padding: 8px 24px;
      border-radius: var(--radius-full);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }
}

.helper-text {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 0 0 10px var(--accent-start);
}
</style>
