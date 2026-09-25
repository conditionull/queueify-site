<script setup lang="ts">
// The landing page's hero picture: queueify's own loop, shown as one. A
// request pops up in chat and its song drops onto the back of the queue; the
// queue steps forward; the song at the front lifts into the overlay, which
// changes over to it and fills its waveform as it plays. A record turns
// behind it all, lit in the colour of whatever is playing.
//
// It is all CSS on one clock. Each song's parts run the same loop, offset by
// one step (3.2s) from the next song's, so every 3.2s one drops in at the back
// and one comes up to play. Six songs for five places - four queued and one
// playing - means the song that just finished is never on screen twice.

interface Song {
  title: string
  artist: string
  by: string
  byColor: string
  accent: string
  cover: [string, string, string]
}

const songs: Song[] = [
  { title: 'Mind Fields', artist: 'No Vacation', by: 'olticul', byColor: '#ff7f50', accent: '#f2a93b', cover: ['#ffe2a3', '#f2a93b', '#6b3a10'] },
  { title: 'Happen Twice', artist: 'Mark Whalen', by: 'Rileyjo7', byColor: '#5aa9ff', accent: '#b57bea', cover: ['#e2c8ff', '#9b5de5', '#2d1b4e'] },
  { title: 'Set Piece', artist: 'Vansire', by: 'glorysynex', byColor: '#9acd32', accent: '#e8875a', cover: ['#f9c9a6', '#e8875a', '#4b2f78'] },
  { title: 'The Place', artist: 'Far Caspian', by: 'uhRyvn', byColor: '#daa520', accent: '#ef9a86', cover: ['#ffd9cc', '#ec8f79', '#5a2e3a'] },
  { title: 'Bloodhounds', artist: 'Small Forward', by: 'roquettm', byColor: '#b57bea', accent: '#d2b77e', cover: ['#f3e6c4', '#cfae6c', '#4a3a22'] },
  { title: 'Reaper', artist: 'No Vacation', by: 'OmniscientBot', byColor: '#ff69b4', accent: '#8c9bff', cover: ['#dfe7ff', '#7c8cff', '#1f2552'] },
]

const STEP = 3.2
const LOOP = STEP * songs.length

// The waveform: bar heights from a couple of sines, so it has a song's shape
// without being random on every render
const bars = Array.from({ length: 36 }, (_, i) => {
  const h = 5 + Math.abs(Math.sin(i * 0.55) * 11 + Math.sin(i * 1.7) * 5)
  return { x: 232 + i * 5.6, h: Math.round(h * 10) / 10 }
})

// Where the queue's four places are (the back one first), and the lines
// between the covers' numbers
const slots = [396, 308, 220, 132]

const uid = useId()
const root = ref<SVGSVGElement | null>(null)
const { playing } = useSvgPlayback(root)
</script>

<template>
  <svg
    ref="root"
    :class="['qh', { 'is-playing': playing }]"
    viewBox="0 0 560 440"
    :style="{ '--loop': `${LOOP}s`, '--step': `${STEP}s` }"
    role="img"
    aria-label="Viewers request songs in chat, each one joins the back of the queue, and the song at the front moves up into the stream overlay, which shows it playing with a waveform progress bar."
  >
    <defs>
      <linearGradient v-for="(song, i) in songs" :id="`${uid}-cover-${i}`" :key="i" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" :stop-color="song.cover[0]" />
        <stop offset="0.58" :stop-color="song.cover[1]" />
        <stop offset="1" :stop-color="song.cover[2]" />
      </linearGradient>
      <symbol v-for="(song, i) in songs" :id="`${uid}-art-${i}`" :key="`s${i}`" viewBox="0 0 64 64">
        <rect width="64" height="64" rx="9" :fill="`url(#${uid}-cover-${i})`" />
        <circle cx="41" cy="23" r="8.5" fill="#fff" fill-opacity="0.82" />
        <path d="M0 47 q16 -9 32 -2 t32 -3 v13 a9 9 0 0 1 -9 9 h-46 a9 9 0 0 1 -9 -9 z" :fill="song.cover[2]" fill-opacity="0.85" />
        <rect width="64" height="64" rx="9" fill="none" stroke="#fff" stroke-opacity="0.14" />
      </symbol>
      <linearGradient :id="`${uid}-lane`" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="currentColor" stop-opacity="0" />
        <stop offset="0.15" stop-color="currentColor" stop-opacity="1" />
        <stop offset="0.85" stop-color="currentColor" stop-opacity="1" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
      <filter :id="`${uid}-glow`" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="42" />
      </filter>
      <filter :id="`${uid}-shadow`" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity="0.5" />
      </filter>
    </defs>

    <!-- The record behind the overlay, and the light of whatever is playing -->
    <g class="qh-tint">
      <circle cx="280" cy="130" r="150" fill="currentColor" class="qh-glow" :filter="`url(#${uid}-glow)`" />
    </g>
    <g class="qh-record">
      <circle v-for="n in 20" :key="n" cx="280" cy="130" :r="62 + n * 8" class="qh-groove" />
    </g>
    <g class="qh-tint">
      <!-- Light catching the grooves, on opposite sides, as vinyl does -->
      <g class="qh-sweep">
        <path d="M452.2 49.7 A190 190 0 0 1 452.2 210.3" class="qh-glint" />
        <path d="M144.1 193.4 A150 150 0 0 1 144.1 66.6" class="qh-glint" />
      </g>
    </g>

    <!-- The queue -->
    <line x1="60" x2="500" y1="404.5" y2="404.5" :stroke="`url(#${uid}-lane)`" class="qh-lane" />
    <text v-for="(x, i) in slots" :key="x" :x="x + 32" y="424" text-anchor="middle" class="qh-place">{{ 4 - i }}</text>

    <!-- Chat: where each song comes from -->
    <g
      v-for="(song, i) in songs"
      :key="`bubble-${i}`"
      class="qa qh-bubble"
      :style="{ animationDelay: `${-i * STEP}s` }"
    >
      <rect x="318" y="236" width="156" height="26" rx="13" class="qh-bubble-box" />
      <text x="332" y="253" class="qh-bubble-text"><tspan :fill="song.byColor" font-weight="700">{{ song.by }}</tspan>: !q {{ song.title }}</text>
    </g>

    <!-- The overlay -->
    <g :filter="`url(#${uid}-shadow)`">
      <rect x="110" y="70" width="340" height="122" rx="18" class="qh-widget" />
    </g>
    <rect x="110" y="70" width="340" height="122" rx="18" class="qh-widget-edge" />

    <g
      v-for="(song, i) in songs"
      :key="`now-${i}`"
      class="qa qh-now"
      :style="{ animationDelay: `${-i * STEP}s` }"
    >
      <use :href="`#${uid}-art-${i}`" x="126" y="86" width="90" height="90" />
      <text x="232" y="121" class="qh-title" :fill="song.accent">{{ song.title }}</text>
      <text x="232" y="141" class="qh-artist">{{ song.artist }}</text>
    </g>

    <!-- The waveform: grey, with the playing song's colour filling across it -->
    <rect v-for="bar in bars" :key="`b${bar.x}`" :x="bar.x" :y="170 - bar.h" width="3" :height="bar.h" rx="1.5" class="qh-bar" />
    <g class="qh-tint">
      <g class="qh-fill">
        <rect v-for="bar in bars" :key="`f${bar.x}`" :x="bar.x" :y="170 - bar.h" width="3" :height="bar.h" rx="1.5" fill="currentColor" />
      </g>
    </g>

    <!-- The covers: drop onto the back, step forward, lift up to play -->
    <g
      v-for="(song, i) in songs"
      :key="`cover-${i}`"
      :transform="`translate(${slots[0]} 340)`"
    >
      <g class="qa qh-cover" :style="{ animationDelay: `${-i * STEP}s` }">
        <use :href="`#${uid}-art-${i}`" width="64" height="64" :filter="`url(#${uid}-shadow)`" />
      </g>
    </g>
  </svg>
</template>

<style>
.qh {
  display: block;
  width: 100%;
  max-width: 36rem;
  height: auto;
  margin-inline: auto;
  overflow: visible;
  font-family: inherit;
  --qh-line: rgba(24, 24, 27, 0.07);
  --qh-text: #71717a;
  color: #18181b;
}

.dark .qh {
  --qh-line: rgba(255, 255, 255, 0.05);
  --qh-text: #a1a1aa;
  color: #fafafa;
}

.qh-groove { fill: none; stroke: var(--qh-line); stroke-width: 1; }
.qh-glint { fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; opacity: 0.4; }
.qh-glow { opacity: 0.2; }
.qh-lane { stroke-width: 1; opacity: 0.18; }
.qh-place {
  fill: var(--qh-text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10px;
}
.qh-widget { fill: #0b0b10; }
.qh-widget-edge { fill: none; stroke: rgba(255, 255, 255, 0.1); }
.qh-title { font-size: 19px; font-weight: 700; letter-spacing: -0.01em; }
.qh-artist { fill: #fff; fill-opacity: 0.62; font-size: 12.5px; font-weight: 500; }
.qh-bar { fill: #fff; fill-opacity: 0.14; }
.qh-bubble-box { fill: #16161c; stroke: rgba(255, 255, 255, 0.1); }
.qh-bubble-text { fill: #e4e4e7; font-size: 11px; }

/* -------------------------------------------------------------- motion */

/* Everything that moves pauses together while the picture is off screen */
.qh:not(.is-playing) .qa,
.qh:not(.is-playing) .qh-tint,
.qh:not(.is-playing) .qh-fill,
.qh:not(.is-playing) .qh-sweep {
  animation-play-state: paused;
}

/* A song's parts: one loop, a sixth of it per queue place */
.qh .qa {
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  animation-duration: var(--loop);
  transform-box: fill-box;
}

/* A cover drops onto the back of the queue, steps forward a place every
   sixth of the loop, lifts into the overlay and hands over to its art */
.qh-cover {
  transform-origin: 0 0;
  animation-name: qh-cover;
}

@keyframes qh-cover {
  0% { transform: translate(0, -64px) scale(0.86); opacity: 0; animation-timing-function: cubic-bezier(0.2, 1.25, 0.4, 1); }
  4%, 16.67% { transform: translate(0, 0) scale(1); opacity: 1; animation-timing-function: cubic-bezier(0.5, 0, 0.2, 1); }
  20.5%, 33.33% { transform: translate(-88px, 0) scale(1); opacity: 1; animation-timing-function: cubic-bezier(0.5, 0, 0.2, 1); }
  37.2%, 50% { transform: translate(-176px, 0) scale(1); opacity: 1; animation-timing-function: cubic-bezier(0.5, 0, 0.2, 1); }
  53.9%, 66.67% { transform: translate(-264px, 0) scale(1); opacity: 1; animation-timing-function: cubic-bezier(0.6, 0, 0.2, 1); }
  72% { transform: translate(-270px, -254px) scale(1.406); opacity: 1; }
  74.5%, 100% { transform: translate(-270px, -254px) scale(1.406); opacity: 0; }
}

/* Its request in chat, popping up just before it drops */
.qh-bubble {
  transform-origin: 80% 100%;
  animation-name: qh-bubble;
}

@keyframes qh-bubble {
  0% { transform: translateY(6px) scale(0.92); opacity: 0; animation-timing-function: cubic-bezier(0.2, 1.3, 0.4, 1); }
  2%, 9% { transform: none; opacity: 1; }
  12%, 100% { transform: translateY(-8px); opacity: 0; }
}

/* The overlay showing it, from the moment its cover lands until the next */
.qh-now {
  animation-name: qh-now;
}

@keyframes qh-now {
  0%, 70.5% { opacity: 0; transform: translateY(5px); }
  72.5%, 88.2% { opacity: 1; transform: none; }
  90.2%, 100% { opacity: 0; transform: translateY(-5px); }
}

/* The colour of what is playing, stepping from song to song as each comes up.
   A song lands 1.02s into the loop and every 3.2s after - song 4, 3, 2, 1,
   0, then 5, which is also what is playing when the loop begins. */
.qh-tint {
  animation: qh-tint var(--loop) infinite both;
}

@keyframes qh-tint {
  0%, 4.6% { color: #8c9bff; }
  6%, 21.3% { color: #d2b77e; }
  22.7%, 37.9% { color: #ef9a86; }
  39.4%, 54.6% { color: #e8875a; }
  56%, 71.3% { color: #b57bea; }
  72.7%, 87.9% { color: #f2a93b; }
  89.4%, 100% { color: #8c9bff; }
}

/* The waveform fills across each song, restarting as the next one lands */
.qh-fill {
  animation: qh-fill var(--step) linear -2.176s infinite both;
}

@keyframes qh-fill {
  0% { clip-path: inset(0 100% 0 0); }
  96%, 100% { clip-path: inset(0 0 0 0); }
}

/* The record turns, slowly, the whole time */
.qh-sweep {
  transform-box: view-box;
  transform-origin: 280px 130px;
  animation: qh-spin 9s linear infinite;
}

@keyframes qh-spin {
  to { transform: rotate(360deg); }
}
</style>
