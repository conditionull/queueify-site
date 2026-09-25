<script setup lang="ts">
// Switching from a wide theme to a tall one, in the space the wide one had.
// Left, what queueify does: the tall theme keeps its shape and sits centred in
// the space. Right, what it avoids: the same theme stretched to fill it, its
// square cover pulled into a letterbox.

const song = SONGS.setPiece

// The space, and the tall theme's own size (5:8)
const SPACE = { x: 16, y: 50, w: 200, h: 96 }
const TALL = { w: 60, h: 96 }

const panels = [
  {
    x: 8,
    title: 'What queueify does',
    caption: 'Same shape, centred in the space',
    good: true,
    tall: `translate(${SPACE.x + (SPACE.w - TALL.w) / 2} ${SPACE.y})`,
  },
  {
    x: 248,
    title: 'What it never does',
    caption: 'Stretched to fill it',
    good: false,
    tall: `translate(${SPACE.x} ${SPACE.y}) scale(${SPACE.w / TALL.w} 1)`,
  },
]

const uid = useId()
const root = ref<HTMLElement | null>(null)
const { playing } = useSvgPlayback(root)
</script>

<template>
  <figure ref="root" :class="['dg', 'fd', { 'is-playing': playing }]" style="--loop: 6s">
    <div class="dg-stage">
      <svg
        viewBox="0 0 480 196"
        role="img"
        aria-label="Two copies of the space a wide theme filled. Switching to a tall theme, queueify keeps it the same shape and centres it in the space, on the left. On the right, for comparison, the same theme stretched to fill the space, with its square cover art pulled out of shape - which queueify never does."
      >
        <defs>
          <filter :id="`${uid}-shadow`" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity="0.5" />
          </filter>
        </defs>

        <g v-for="panel in panels" :key="panel.x" :transform="`translate(${panel.x} 0)`">
          <g :transform="`translate(${SPACE.x} 26)`">
            <circle cx="6" cy="-4" r="6.5" :fill="panel.good ? '#1db954' : '#ef4444'" />
            <path v-if="panel.good" d="M3 -4 l2 2 l4 -4" class="fd-mark" />
            <path v-else d="M3.5 -6.5 l5 5 m0 -5 l-5 5" class="fd-mark" />
            <text x="18" y="0" class="dg-head" font-size="12">{{ panel.title }}</text>
          </g>

          <rect :x="SPACE.x" :y="SPACE.y" :width="SPACE.w" :height="SPACE.h" rx="12" class="fd-space" />

          <!-- The wide theme, filling the space -->
          <g :transform="`translate(${SPACE.x} ${SPACE.y})`">
            <g class="da fd-wide">
              <rect :width="SPACE.w" :height="SPACE.h" rx="14" class="dg-widget" :filter="`url(#${uid}-shadow)`" />
              <CoverArt :cover="song.cover" :size="72" :x="12" :y="12" />
              <text x="96" y="44" class="dg-title" :fill="song.accent" font-size="15">{{ song.title }}</text>
              <text x="96" y="60" class="dg-artist" font-size="11">{{ song.artist }}</text>
              <rect x="96" y="72" width="90" height="3" rx="1.5" fill="#fff" fill-opacity="0.15" />
              <rect x="96" y="72" width="40" height="3" rx="1.5" :fill="song.accent" />
            </g>
          </g>

          <!-- The tall theme, placed the way each side places it -->
          <g :transform="panel.tall">
            <g class="da fd-tall">
              <rect :width="TALL.w" :height="TALL.h" rx="9" class="dg-widget" :filter="panel.good ? `url(#${uid}-shadow)` : undefined" />
              <CoverArt :cover="song.cover" :size="48" :x="6" :y="6" />
              <rect x="6" y="62" width="40" height="6" rx="3" :fill="song.accent" />
              <rect x="6" y="73" width="28" height="4" rx="2" fill="#fff" fill-opacity="0.5" />
              <rect x="6" y="84" width="48" height="3" rx="1.5" fill="#fff" fill-opacity="0.18" />
            </g>
          </g>

          <text :x="SPACE.x" :y="SPACE.y + SPACE.h + 28" class="dg-text dg-muted">{{ panel.caption }}</text>
        </g>
      </svg>
    </div>
  </figure>
</template>

<style>
.fd-space { fill: rgba(255, 255, 255, 0.02); stroke: rgba(255, 255, 255, 0.16); stroke-dasharray: 4 4; }
.fd-mark { fill: none; stroke: #fff; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }

.fd-wide { animation-name: fd-wide; transform-origin: center; }
.fd-tall { animation-name: fd-tall; transform-origin: center; }

@keyframes fd-wide {
  0%, 36% { opacity: 1; transform: scale(1); }
  44%, 88% { opacity: 0; transform: scale(0.96); }
  96%, 100% { opacity: 1; transform: scale(1); }
}
@keyframes fd-tall {
  0%, 38% { opacity: 0; transform: scale(0.94); animation-timing-function: cubic-bezier(0.2, 1.3, 0.4, 1); }
  48%, 86% { opacity: 1; transform: scale(1); }
  94%, 100% { opacity: 0; transform: scale(0.96); }
}
</style>
