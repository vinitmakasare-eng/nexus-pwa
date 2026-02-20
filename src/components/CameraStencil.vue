<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  position: string
}>()

const stencilType = computed(() => {
  const p = props.position.toLowerCase()
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
  return p.includes('right')
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

    <svg viewBox="0 0 400 300" class="stencil-svg" :class="{ 'flip-x': isRightSide }">
      <defs>
        <filter id="stencil-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g class="stencil-art" filter="url(#stencil-glow)">
        <!-- Realistic Side Profile (Sedan/SUV Mix) -->
        <template v-if="stencilType === 'side'">
          <path d="M40,205 C40,195 50,185 65,175 C80,165 110,150 140,135 C170,120 230,120 270,125 C310,130 340,145 355,170 C370,195 365,210 365,215 L35,215 L40,205 Z" class="silhouette-fill" />
          <path d="M40,205 C40,195 50,185 65,175 C80,165 110,150 140,135 C170,120 230,120 270,125 C310,130 340,145 355,170 C370,195 365,210 365,215 L35,215 L40,205 Z" class="silhouette-outline" />
          <!-- Wheels -->
          <circle cx="95" cy="215" r="28" class="silhouette-outline" />
          <circle cx="305" cy="215" r="28" class="silhouette-outline" />
        </template>

        <!-- Realistic Front View -->
        <template v-if="stencilType === 'front'">
          <path d="M100,220 L100,170 C100,140 130,130 200,130 C270,130 300,140 300,170 L300,220 L280,220 C280,210 260,205 200,205 C140,205 120,210 120,220 Z" class="silhouette-fill" />
          <path d="M100,220 L100,170 C100,140 130,130 200,130 C270,130 300,140 300,170 L300,220 L280,220 C280,210 260,205 200,205 C140,205 120,210 120,220 Z" class="silhouette-outline" />
          <!-- Windshield Inner -->
          <path d="M125,165 L275,165 L260,145 L140,145 Z" class="silhouette-detail" />
          <!-- Headlights -->
          <rect x="110" y="180" width="35" height="15" rx="4" class="silhouette-detail" />
          <rect x="255" y="180" width="35" height="15" rx="4" class="silhouette-detail" />
        </template>

        <!-- Realistic Rear View -->
        <template v-if="stencilType === 'rear'">
          <path d="M100,220 L100,170 C100,140 130,130 200,130 C270,130 300,140 300,170 L300,220 L280,220 C280,210 260,205 200,205 C140,205 120,210 120,220 Z" class="silhouette-fill" />
          <path d="M100,220 L100,170 C100,140 130,130 200,130 C270,130 300,140 300,170 L300,220 L280,220 C280,210 260,205 200,205 C140,205 120,210 120,220 Z" class="silhouette-outline" />
          <!-- Rear Window -->
          <path d="M130,140 L270,140 L260,165 L140,165 Z" class="silhouette-detail" />
          <!-- Taillights -->
          <rect x="110" y="175" width="40" height="12" rx="2" class="silhouette-detail" />
          <rect x="250" y="175" width="40" height="12" rx="2" class="silhouette-detail" />
        </template>

        <!-- Realistic Perspective/Corner View (High Fidelity) -->
        <template v-if="stencilType === 'corner'">
          <path d="M60,190 C60,170 80,155 110,145 C150,130 220,130 260,145 C300,160 330,180 340,210 C340,220 320,230 200,230 C80,230 60,215 60,190 Z" class="silhouette-fill" />
          <path d="M60,190 C60,170 80,155 110,145 C150,130 220,130 260,145 C300,160 330,180 340,210 C340,220 320,230 200,230 C80,230 60,215 60,190 Z" class="silhouette-outline" />
          <!-- Cabin/Windows -->
          <path d="M130,150 L250,155 L220,185 L140,180 Z" class="silhouette-detail" />
          <!-- Wheels Perspective -->
          <circle cx="110" cy="225" r="22" class="silhouette-outline" />
          <circle cx="280" cy="215" r="18" class="silhouette-outline" />
        </template>
      </g>
    </svg>

    <div class="hud-helper">
      <span class="helper-text">ALIGN {{ position }}</span>
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
  width: 90%;
  height: 90%;
  max-width: 900px;
}

.flip-x {
  transform: scaleX(-1);
}

.silhouette-fill {
  fill: rgba(255, 255, 255, 0.05);
}

.silhouette-outline {
  fill: none;
  stroke: var(--accent-start);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000;
  animation: draw-stencil 2s ease-out forwards;
}

.silhouette-detail {
  fill: none;
  stroke: var(--accent-start);
  stroke-width: 1.5;
  opacity: 0.4;
}

@keyframes draw-stencil {
  to { stroke-dashoffset: 0; }
}

/* UI Elements */
.corner-bracket {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 3px solid var(--accent-start);
  opacity: 0.6;
}

.tl { top: 30px; left: 30px; border-right: none; border-bottom: none; }
.tr { top: 30px; right: 30px; border-left: none; border-bottom: none; }
.bl { bottom: 30px; left: 30px; border-right: none; border-top: none; }
.br { bottom: 30px; right: 30px; border-left: none; border-top: none; }

.scanner-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--accent-start), transparent);
  box-shadow: 0 0 20px var(--accent-start);
  animation: scan-vertical 5s linear infinite;
  opacity: 0.2;
}

@keyframes scan-vertical {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}

.hud-helper {
  position: absolute;
  bottom: 120px;
  background: rgba(0, 0, 0, 0.5);
  padding: 6px 16px;
  border-radius: var(--radius-full);
  border: 1px solid var(--accent-start);
  backdrop-filter: blur(8px);
}

.helper-text {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent-start);
  text-transform: uppercase;
}
</style>
