<script setup lang="ts">
// The two progress bars, filling as a song plays: plain, and the waveform.
// Partway through, Shuffle is pressed and the waveform takes a new shape -
// the one that gets saved with the theme.

const song = SONGS.happenTwice
const MAX = 34

// Two shapes from two sets of sines, each bar as a fraction of the tallest
const bars = Array.from({ length: 42 }, (_, i) => {
  const a = 0.22 + Math.abs(Math.sin(i * 0.52) * 0.55 + Math.sin(i * 1.9) * 0.22)
  const b = 0.2 + Math.abs(Math.sin(i * 0.31 + 1.2) * 0.45 + Math.cos(i * 1.15) * 0.3)
  return {
    x: 112 + i * 8,
    a: Math.min(1, a).toFixed(3),
    b: Math.min(1, b).toFixed(3),
    delay: `${(i * 0.012).toFixed(3)}s`,
  }
})

const uid = useId()
const root = ref<HTMLElement | null>(null)
const { playing } = useSvgPlayback(root)
</script>

<template>
  <figure ref="root" :class="['dg', 'wf', { 'is-playing': playing }]" style="--loop: 7s">
    <div class="dg-stage">
      <svg
        viewBox="0 0 480 188"
        role="img"
        aria-label="Two progress bars filling as a song plays: a plain bar, and a waveform of lines of different heights. Shuffle is pressed and the waveform changes to a new shape."
      >
        <rect x="12" y="12" width="456" height="164" rx="9" class="dg-panel" />
        <text x="26" y="32" class="dg-head">Progress bar</text>
        <text x="454" y="32" text-anchor="end" class="dg-tiny">{{ song.title }} · {{ song.artist }}</text>
        <line x1="12" x2="468" y1="42.5" y2="42.5" class="dg-rule" />

        <!-- Plain -->
        <text x="26" y="72" class="dg-text dg-muted">Plain</text>
        <rect x="112" y="66" width="334" height="4" rx="2" fill="#fff" fill-opacity="0.12" />
        <rect x="112" y="66" width="334" height="4" rx="2" :fill="song.accent" class="da wf-plain" />

        <!-- Waveform: grey, with the song's colour filling across it. The fill
             is revealed by a rectangle sweeping right, tall enough for any shape
             Shuffle comes up with. -->
        <defs>
          <clipPath :id="`${uid}-played`">
            <rect x="112" y="100" width="334" height="50" class="da wf-played" />
          </clipPath>
        </defs>
        <text x="26" y="132" class="dg-text dg-muted">Waveform</text>
        <rect
          v-for="bar in bars"
          :key="`g${bar.x}`"
          :x="bar.x"
          :y="146 - MAX"
          width="4"
          :height="MAX"
          rx="2"
          class="da wf-bar wf-grey"
          :style="{ '--a': bar.a, '--b': bar.b, animationDelay: bar.delay }"
        />
        <g :clip-path="`url(#${uid}-played)`">
          <rect
            v-for="bar in bars"
            :key="`c${bar.x}`"
            :x="bar.x"
            :y="146 - MAX"
            width="4"
            :height="MAX"
            rx="2"
            :fill="song.accent"
            class="da wf-bar"
            :style="{ '--a': bar.a, '--b': bar.b, animationDelay: bar.delay }"
          />
        </g>

        <!-- Shuffle -->
        <g transform="translate(394 152)">
          <g class="da wf-shuffle">
            <rect width="52" height="18" rx="5" class="wf-btn" />
            <path d="M3 5 h3 l6 8 h3 M3 13 h3 l2 -2.7 M10 7.7 l2 -2.7 h3 M13 3 l2 2 l-2 2 M13 11 l2 2 l-2 2" transform="translate(4 0.5) scale(0.95)" class="wf-icon" />
            <text x="22" y="12.5" class="wf-btn-text">Shuffle</text>
          </g>
        </g>
      </svg>
    </div>
  </figure>
</template>

<style>
.wf-grey { fill: #fff; fill-opacity: 0.13; }
.wf-btn { fill: #18181f; stroke: rgba(255, 255, 255, 0.16); }
.wf-btn-text { fill: #e4e4e7; font-size: 8.5px; font-weight: 600; }
.wf-icon { fill: none; stroke: #e4e4e7; stroke-width: 1.1; stroke-linecap: round; stroke-linejoin: round; }

.wf-plain { animation-name: wf-progress; transform-origin: 0 50%; }
.wf-played { animation-name: wf-progress; transform-origin: 0 50%; }
.dg.wf .wf-plain, .dg.wf .wf-played { animation-timing-function: linear; }
.wf-bar { animation-name: wf-morph; transform-origin: 50% 100%; }
.wf-shuffle { animation-name: wf-press; transform-origin: center; }

@keyframes wf-progress {
  0% { transform: scaleX(0); }
  96%, 100% { transform: scaleX(1); }
}

/* Shuffle at 3.4s: a new shape, the bars rippling into it left to right */
@keyframes wf-morph {
  0%, 48% { transform: scaleY(var(--a)); animation-timing-function: cubic-bezier(0.3, 1.4, 0.5, 1); }
  56%, 94% { transform: scaleY(var(--b)); animation-timing-function: cubic-bezier(0.5, 0, 0.2, 1); }
  100% { transform: scaleY(var(--a)); }
}
@keyframes wf-press {
  0%, 44% { transform: scale(1); }
  46% { transform: scale(0.92); }
  50%, 100% { transform: scale(1); }
}
</style>
