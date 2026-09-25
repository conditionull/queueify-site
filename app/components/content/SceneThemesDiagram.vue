<script setup lang="ts">
// A theme per OBS scene: the scene list on the left, the preview on the
// right. OBS cuts from Gaming to Just Chatting and the widget changes theme
// with it - a slim strip over the game, the big panel over the webcam - while
// the song carries on. Underneath, the line Queueify logs when it switches.

const song = SONGS.mindFields
const scenes = ['Gaming', 'Just Chatting', 'BRB']

const uid = useId()
const root = ref<HTMLElement | null>(null)
const { playing } = useSvgPlayback(root)
</script>

<template>
  <figure ref="root" :class="['dg', 'st', { 'is-playing': playing }]" style="--loop: 9s">
    <div class="dg-stage">
      <svg
        viewBox="0 0 480 262"
        role="img"
        aria-label="OBS switches from the Gaming scene to Just Chatting. The widget changes from the slim minimal theme over the game to the large swag theme beside the webcam, still playing the same song, and Queueify logs that the scene uses the swag theme and it switched."
      >
        <defs>
          <linearGradient :id="`${uid}-game`" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#2e2a78" />
            <stop offset="0.6" stop-color="#151a3d" />
            <stop offset="1" stop-color="#0a0f1f" />
          </linearGradient>
          <linearGradient :id="`${uid}-room`" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#4a2433" />
            <stop offset="1" stop-color="#170d1a" />
          </linearGradient>
          <clipPath :id="`${uid}-preview`">
            <rect x="152" y="12" width="316" height="152" rx="8" />
          </clipPath>
          <filter :id="`${uid}-shadow`" x="-30%" y="-40%" width="160%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity="0.55" />
          </filter>
        </defs>

        <!-- OBS's scene list -->
        <rect x="12" y="12" width="128" height="152" rx="8" class="dg-panel" />
        <text x="24" y="32" class="dg-head">Scenes</text>
        <line x1="12" x2="140" y1="42.5" y2="42.5" class="dg-rule" />
        <rect x="18" y="50" width="116" height="22" rx="5" class="da st-active" />
        <text
          v-for="(scene, i) in scenes"
          :key="scene"
          x="28"
          :y="65 + i * 26"
          :class="['dg-text', i === 0 ? 'da st-name-a' : i === 1 ? 'da st-name-b' : 'dg-dim']"
        >{{ scene }}</text>

        <!-- The preview: the game, then the webcam scene -->
        <g :clip-path="`url(#${uid}-preview)`">
          <rect x="152" y="12" width="316" height="152" :fill="`url(#${uid}-room)`" />
          <!-- Just Chatting: the webcam -->
          <rect x="164" y="30" width="108" height="118" rx="10" fill="#241320" stroke="rgba(255,255,255,0.08)" />
          <circle cx="218" cy="78" r="19" fill="#3a2230" />
          <path d="M182 148 q36 -50 72 0 z" fill="#3a2230" />

          <!-- Gaming, over the top of it until the cut -->
          <g class="da st-game">
            <rect x="152" y="12" width="316" height="152" :fill="`url(#${uid}-game)`" />
            <circle cx="420" cy="46" r="13" fill="#f5d77a" fill-opacity="0.8" />
            <path d="M152 124 q60 -30 120 -10 t110 -8 t86 6 v52 h-316 z" fill="#1c1a4d" />
            <path d="M152 142 q80 -16 160 -4 t156 -2 v28 h-316 z" fill="#110f30" />
          </g>
        </g>
        <rect x="152" y="12" width="316" height="152" rx="8" fill="none" stroke="rgba(255,255,255,0.08)" />

        <!-- minimal, over the game: one slim line -->
        <g class="da st-minimal">
          <rect x="166" y="138" width="170" height="18" rx="9" fill="#000" fill-opacity="0.72" :filter="`url(#${uid}-shadow)`" />
          <path d="M175 143 l6 4 l-6 4 z" fill="#fff" />
          <text x="188" y="150.5" class="st-min-title">{{ song.title }}</text>
          <circle cx="248" cy="147" r="1.5" fill="#fff" fill-opacity="0.6" />
          <text x="254" y="150.5" class="st-min-artist">{{ song.artist }}</text>
          <rect x="306" y="145.5" width="22" height="3" rx="1.5" fill="#fff" fill-opacity="0.2" />
          <rect x="306" y="145.5" width="9" height="3" rx="1.5" fill="#fff" />
        </g>

        <!-- swag, beside the webcam: the big panel -->
        <g class="da st-swag">
          <rect x="284" y="62" width="176" height="76" rx="12" class="dg-widget" :filter="`url(#${uid}-shadow)`" />
          <CoverArt :cover="song.cover" :size="58" :x="293" :y="71" />
          <text x="362" y="94" class="st-swag-title">{{ song.title }}</text>
          <text x="362" y="109" class="st-swag-artist">{{ song.artist }}</text>
          <rect x="362" y="119" width="82" height="4" rx="2" fill="#fff" fill-opacity="0.15" />
          <rect x="362" y="119" width="34" height="4" rx="2" fill="#f5c542" />
        </g>

        <!-- Queueify's log -->
        <rect x="12" y="176" width="456" height="74" rx="8" class="dg-term" />
        <text x="26" y="196" class="dg-tiny dg-mono">npm start</text>
        <text x="26" y="218" class="st-log dg-mono dg-dim">Scene "Gaming" uses the "minimal" theme - switched.</text>
        <g class="da st-log-in">
          <text x="26" y="236" class="st-log dg-mono">Scene "Just Chatting" uses the "swag" theme - <tspan fill="#6ee7a0">switched.</tspan></text>
          <rect x="24" y="226" width="440" height="14" fill="#0b0b0e" class="da st-type" />
        </g>
      </svg>
    </div>
  </figure>
</template>

<style>
.st-active { fill: rgba(29, 185, 84, 0.16); stroke: rgba(29, 185, 84, 0.45); }
.st-min-title { fill: #fff; font-size: 9.5px; font-weight: 700; }
.st-min-artist { fill: #fff; fill-opacity: 0.7; font-size: 9.5px; }
.st-swag-title { fill: #f5c542; font-size: 14px; font-weight: 800; letter-spacing: -0.01em; }
.st-swag-artist { fill: #f5c542; fill-opacity: 0.85; font-size: 10.5px; }
.st-log { fill: #d4d4d8; font-size: 10px; }

.st-active { animation-name: st-active; }
.st-name-a { animation-name: st-name-a; }
.st-name-b { animation-name: st-name-b; }
.st-game { animation-name: st-game; }
.st-minimal { animation-name: st-minimal; transform-origin: 0% 100%; }
.st-swag { animation-name: st-swag; transform-origin: 100% 50%; }
.st-log-in { animation-name: st-log-in; }
.st-type { animation-name: st-type; transform-origin: 100% 50%; }
.dg.st .st-type { animation-timing-function: steps(24, end); }

/* The cut: 4.2s in, and back at the end of the loop */
@keyframes st-active {
  0%, 44.4% { transform: translateY(0); animation-timing-function: cubic-bezier(0.5, 0, 0.2, 1.2); }
  48.9%, 94.4% { transform: translateY(26px); animation-timing-function: cubic-bezier(0.5, 0, 0.2, 1.2); }
  99%, 100% { transform: translateY(0); }
}
@keyframes st-name-a {
  0%, 44.4% { fill: #fafafa; }
  48.9%, 94.4% { fill: #a1a1aa; }
  99%, 100% { fill: #fafafa; }
}
@keyframes st-name-b {
  0%, 44.4% { fill: #a1a1aa; }
  48.9%, 94.4% { fill: #fafafa; }
  99%, 100% { fill: #a1a1aa; }
}
@keyframes st-game {
  0%, 46.7% { opacity: 1; }
  52.2%, 94.4% { opacity: 0; }
  99%, 100% { opacity: 1; }
}
@keyframes st-minimal {
  0%, 46.7% { opacity: 1; transform: none; }
  50%, 95% { opacity: 0; transform: translateY(6px) scale(0.96); }
  99%, 100% { opacity: 1; transform: none; }
}
@keyframes st-swag {
  0%, 50% { opacity: 0; transform: scale(0.9); animation-timing-function: cubic-bezier(0.2, 1.3, 0.4, 1); }
  56%, 93.3% { opacity: 1; transform: none; }
  96.7%, 100% { opacity: 0; transform: scale(0.94); }
}
@keyframes st-log-in {
  0%, 50.5% { opacity: 0; }
  51%, 93.3% { opacity: 1; }
  97%, 100% { opacity: 0; }
}
@keyframes st-type {
  0%, 51% { transform: scaleX(1); }
  60%, 100% { transform: scaleX(0); }
}
</style>
