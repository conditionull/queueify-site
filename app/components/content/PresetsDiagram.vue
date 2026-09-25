<script setup lang="ts">
// The two position presets on an OBS canvas: a mod types !bc and the widget
// glides into the bottom-centre rectangle; !tr sends it back to the top right.
// The dashed outlines are the saved rectangles themselves, which is the point
// the page makes - a preset is a place, not a scale.

const song = SONGS.happenTwice

// Top right and bottom centre, the same size as the widget
const TR = { x: 292, y: 30 }
const BC = { x: 160, y: 198 }

const uid = useId()
const root = ref<HTMLElement | null>(null)
const { playing } = useSvgPlayback(root)
</script>

<template>
  <figure ref="root" :class="['dg', 'pd', { 'is-playing': playing }]" style="--loop: 8s">
    <div class="dg-stage">
      <svg
        viewBox="0 0 480 270"
        role="img"
        aria-label="An OBS canvas with two dashed rectangles, the !tr preset at the top right and the !bc preset at the bottom centre. olticul types !bc in chat and the widget glides into the bottom-centre rectangle, then types !tr and it glides back."
      >
        <defs>
          <linearGradient :id="`${uid}-scene`" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#2e2a78" />
            <stop offset="0.6" stop-color="#151a3d" />
            <stop offset="1" stop-color="#0a0f1f" />
          </linearGradient>
          <clipPath :id="`${uid}-canvas`">
            <rect x="12" y="12" width="456" height="246" rx="8" />
          </clipPath>
          <filter :id="`${uid}-shadow`" x="-30%" y="-40%" width="160%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#000" flood-opacity="0.55" />
          </filter>
        </defs>

        <!-- The scene -->
        <g :clip-path="`url(#${uid}-canvas)`">
          <rect x="12" y="12" width="456" height="246" :fill="`url(#${uid}-scene)`" />
          <circle cx="214" cy="62" r="18" fill="#f5d77a" fill-opacity="0.8" />
          <path d="M12 200 q80 -40 160 -14 t150 -12 t146 8 v76 h-456 z" fill="#1c1a4d" />
          <path d="M12 226 q100 -22 210 -4 t246 -2 v38 h-456 z" fill="#110f30" />
        </g>
        <rect x="12" y="12" width="456" height="246" rx="8" fill="none" stroke="rgba(255,255,255,0.08)" />
        <text x="26" y="34" class="dg-head" fill-opacity="0.7">OBS canvas</text>

        <!-- The saved presets, lighting up while the widget sits in them -->
        <rect :x="TR.x" :y="TR.y" width="160" height="44" rx="11" class="pd-preset" />
        <rect :x="TR.x" :y="TR.y" width="160" height="44" rx="11" class="da pd-on pd-on-tr" />
        <text :x="TR.x + 160" :y="TR.y + 60" text-anchor="end" class="pd-label">!tr preset</text>

        <rect :x="BC.x" :y="BC.y" width="160" height="44" rx="11" class="pd-preset" />
        <rect :x="BC.x" :y="BC.y" width="160" height="44" rx="11" class="da pd-on pd-on-bc" />
        <text :x="BC.x" :y="BC.y - 9" class="pd-label">!bc preset</text>

        <!-- Chat, overlaid the way a lot of scenes have it -->
        <g transform="translate(26 146)">
          <rect width="118" height="96" rx="9" fill="#000" fill-opacity="0.5" />
          <text x="12" y="19" class="dg-tiny" fill-opacity="0.8">Chat</text>
          <text x="12" y="42" class="dg-text"><tspan fill="#daa520" font-weight="700">uhRyvn</tspan>: gg</text>
          <g class="da pd-m1">
            <rect x="12" y="55" width="9" height="9" rx="2" fill="#00ad03" />
            <text x="25" y="63" class="dg-text"><tspan :fill="CHATTERS.olticul" font-weight="700">olticul</tspan>: !bc</text>
          </g>
          <g class="da pd-m2">
            <rect x="12" y="75" width="9" height="9" rx="2" fill="#00ad03" />
            <text x="25" y="83" class="dg-text"><tspan :fill="CHATTERS.olticul" font-weight="700">olticul</tspan>: !tr</text>
          </g>
        </g>

        <!-- The widget -->
        <g :transform="`translate(${TR.x} ${TR.y})`">
          <g class="da pd-move">
            <rect width="160" height="44" rx="11" class="dg-widget" :filter="`url(#${uid}-shadow)`" />
            <CoverArt :cover="song.cover" :size="32" :x="6" :y="6" />
            <text x="46" y="20" class="pd-title" :fill="song.accent">{{ song.title }}</text>
            <text x="46" y="31" class="dg-artist">{{ song.artist }}</text>
            <rect x="46" y="36" width="104" height="2.5" rx="1.25" fill="#fff" fill-opacity="0.15" />
            <rect x="46" y="36" width="104" height="2.5" rx="1.25" :fill="song.accent" class="da pd-progress" />
          </g>
        </g>
      </svg>
    </div>
  </figure>
</template>

<style>
.pd-preset { fill: none; stroke: #fff; stroke-opacity: 0.3; stroke-dasharray: 4 4; }
.pd-on {
  fill: color-mix(in oklab, #1db954 14%, transparent);
  stroke: #2ecf7c;
  stroke-width: 1.2;
  stroke-dasharray: 4 4;
}
.pd-label { fill: #fff; fill-opacity: 0.7; font-size: 11px; font-weight: 600; }
.pd-title { font-size: 12px; font-weight: 700; }

.pd-move { animation-name: pd-move; }
.pd-on-tr { animation-name: pd-on-tr; }
.pd-on-bc { animation-name: pd-on-bc; }
.pd-m1 { animation-name: pd-m1; transform-origin: 0 50%; }
.pd-m2 { animation-name: pd-m2; transform-origin: 0 50%; }
.pd-progress { animation-name: pd-progress; transform-origin: 0 50%; }
.dg.pd .pd-progress { animation-timing-function: linear; }

/* A glide with the faintest settle at the end of it */
@keyframes pd-move {
  0%, 15% { transform: translate(0, 0); animation-timing-function: cubic-bezier(0.55, 0, 0.15, 1.08); }
  31%, 60% { transform: translate(-132px, 168px); animation-timing-function: cubic-bezier(0.55, 0, 0.15, 1.08); }
  76%, 100% { transform: translate(0, 0); }
}
@keyframes pd-on-tr {
  0%, 13% { opacity: 1; }
  17%, 74% { opacity: 0; }
  78%, 100% { opacity: 1; }
}
@keyframes pd-on-bc {
  0%, 28% { opacity: 0; }
  32%, 59% { opacity: 1; }
  63%, 100% { opacity: 0; }
}
@keyframes pd-m1 {
  0%, 9% { opacity: 0; transform: translateY(5px) scale(0.94); animation-timing-function: cubic-bezier(0.2, 1.4, 0.4, 1); }
  12%, 93% { opacity: 1; transform: none; }
  98%, 100% { opacity: 0; }
}
@keyframes pd-m2 {
  0%, 54% { opacity: 0; transform: translateY(5px) scale(0.94); animation-timing-function: cubic-bezier(0.2, 1.4, 0.4, 1); }
  57%, 93% { opacity: 1; transform: none; }
  98%, 100% { opacity: 0; }
}
@keyframes pd-progress {
  from { transform: scaleX(0.3); }
  to { transform: scaleX(0.9); }
}
</style>
