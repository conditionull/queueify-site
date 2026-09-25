<script setup lang="ts">
// Installing, start to finish: the four commands typed into a terminal, then
// the two addresses Queueify prints when it starts, each going where it is
// for - the widget's into an OBS browser source, the dashboard's into a
// browser, where the two required steps tick off.

// Each typed line: its text, and the loop percentages it types between
const typed = [
  { y: 50, text: '$ git clone https://github.com/conditionull/queueify.git', from: 3, to: 12, steps: 30 },
  { y: 84, text: '$ cd queueify', from: 18, to: 21, steps: 8 },
  { y: 101, text: '$ npm install', from: 24, to: 27, steps: 8 },
  { y: 135, text: '$ npm start', from: 41, to: 44, steps: 8 },
]

const steps = [
  { name: 'Twitch', optional: false },
  { name: 'Spotify', optional: false },
  { name: 'Channel points', optional: true },
  { name: 'OBS', optional: true },
  { name: 'Canvas videos', optional: true },
]

const uid = useId()
const root = ref<HTMLElement | null>(null)
const { playing } = useSvgPlayback(root)
</script>

<template>
  <figure ref="root" :class="['dg', 'it', { 'is-playing': playing }]" style="--loop: 14s">
    <div class="dg-stage">
      <svg
        viewBox="0 0 480 348"
        role="img"
        aria-label="A terminal: git clone, cd queueify, npm install and npm start are typed in turn. Queueify prints the widget's address, http://localhost:3001, and the dashboard's, http://127.0.0.1:3002, and the dashboard opens in a browser with the Twitch and Spotify steps being ticked off."
      >
        <defs>
          <filter :id="`${uid}-shadow`" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity="0.6" />
          </filter>
        </defs>

        <!-- The terminal -->
        <rect x="12" y="12" width="456" height="172" rx="9" class="dg-term" />
        <circle cx="27" cy="26" r="3.5" class="dg-dot" />
        <circle cx="39" cy="26" r="3.5" class="dg-dot" />
        <circle cx="51" cy="26" r="3.5" class="dg-dot" />
        <line x1="12" x2="468" y1="37.5" y2="37.5" class="dg-rule" />

        <g class="it-log dg-mono">
          <g v-for="(line, i) in typed" :key="i" :class="['da', `it-line-${i}`]">
            <text x="24" :y="line.y"><tspan fill="#2ecf7c">$</tspan>{{ line.text.slice(1) }}</text>
            <rect x="22" :y="line.y - 10" width="440" height="13" fill="#0b0b0e" :class="['da', `it-type-${i}`]" :style="{ animationTimingFunction: `steps(${line.steps}, end)` }" />
          </g>

          <text x="24" y="67" class="da it-out-clone dg-dim">Cloning into 'queueify'...</text>
          <g class="da it-spin">
            <path d="M30 114 a4 4 0 1 1 -4 -4" fill="none" stroke="#2ecf7c" stroke-width="1.4" stroke-linecap="round" class="it-spinner" />
          </g>

          <g class="da it-out-start">
            <text x="24" y="152"><tspan class="dg-dim">   Widget (OBS browser source)   </tspan>http://localhost:3001<tspan class="dg-dim">   680 x 192</tspan></text>
            <text x="24" y="167"><tspan class="dg-dim">   Settings dashboard            </tspan><tspan fill="#6ee7a0">http://127.0.0.1:3002</tspan></text>
          </g>
        </g>

        <!-- The widget's address, going into OBS -->
        <g class="da it-obs">
          <rect x="12" y="192" width="204" height="146" rx="9" class="dg-panel" :filter="`url(#${uid}-shadow)`" />
          <text x="26" y="212" class="dg-head" font-size="10.5">Browser source</text>
          <text x="202" y="212" text-anchor="end" class="dg-tiny">OBS</text>
          <line x1="12" x2="216" y1="220.5" y2="220.5" class="dg-rule" />
          <text x="26" y="242" class="dg-tiny">URL</text>
          <rect x="68" y="231" width="134" height="17" rx="4" class="it-field" />
          <g class="da it-url">
            <text x="74" y="243" class="dg-mono it-field-text">http://localhost:3001</text>
            <rect x="70" y="233" width="130" height="13" fill="#18181f" class="da it-url-type" />
          </g>
          <text x="26" y="270" class="dg-tiny">Width</text>
          <rect x="68" y="259" width="56" height="17" rx="4" class="it-field" />
          <text x="74" y="271" class="dg-mono it-field-text da it-dims">680</text>
          <text x="26" y="298" class="dg-tiny">Height</text>
          <rect x="68" y="287" width="56" height="17" rx="4" class="it-field" />
          <text x="74" y="299" class="dg-mono it-field-text da it-dims">192</text>
          <rect x="146" y="312" width="56" height="18" rx="5" fill="#1db954" />
          <text x="174" y="324.5" text-anchor="middle" class="it-ok">OK</text>
        </g>

        <!-- The dashboard, opening at its address -->
        <g class="da it-browser">
          <rect x="226" y="178" width="240" height="160" rx="9" class="dg-panel" :filter="`url(#${uid}-shadow)`" />
          <circle cx="240" cy="191" r="3" class="dg-dot" />
          <circle cx="250" cy="191" r="3" class="dg-dot" />
          <circle cx="260" cy="191" r="3" class="dg-dot" />
          <rect x="272" y="184" width="180" height="14" rx="7" fill="#18181f" />
          <text x="282" y="194" class="dg-tiny dg-mono">127.0.0.1:3002</text>
          <line x1="226" x2="466" y1="204.5" y2="204.5" class="dg-rule" />

          <text x="240" y="224" class="it-wordmark">queueify</text>
          <text x="240" y="242" class="dg-tiny" font-weight="600" fill="#e4e4e7">Setup</text>
          <g v-for="(step, i) in steps" :key="step.name" :transform="`translate(240 ${260 + i * 17})`">
            <circle cx="6" cy="-3.5" r="6" class="it-step" />
            <g v-if="!step.optional" :class="['da', `it-tick-${i}`]">
              <circle cx="6" cy="-3.5" r="6" fill="#1db954" />
              <path d="M3 -3.5 l2 2 l4 -4" fill="none" stroke="#06140b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <text x="18" y="0" class="dg-text" font-size="10">{{ step.name }}</text>
            <text v-if="step.optional" x="212" y="0" text-anchor="end" class="dg-tiny">optional</text>
          </g>
        </g>
      </svg>
    </div>
  </figure>
</template>

<style>
.it-log { fill: #d4d4d8; font-size: 9.5px; }
.it-wordmark { fill: #2ecf7c; font-size: 13px; font-weight: 800; letter-spacing: -0.02em; }
.it-step { fill: #18181f; stroke: rgba(255, 255, 255, 0.18); }
.it-field { fill: #18181f; stroke: rgba(255, 255, 255, 0.12); }
.it-field-text { fill: #e4e4e7; font-size: 9px; }
.it-ok { fill: #06140b; font-size: 9px; font-weight: 700; }
.it-spinner { transform-box: fill-box; transform-origin: center; animation: it-rotate 0.8s linear infinite; }
.dg.it:not(.is-playing) .it-spinner { animation-play-state: paused; }

.it-line-0 { animation-name: it-line-0; }
.it-line-1 { animation-name: it-line-1; }
.it-line-2 { animation-name: it-line-2; }
.it-line-3 { animation-name: it-line-3; }
.it-type-0 { animation-name: it-type-0; transform-origin: 100% 50%; }
.it-type-1 { animation-name: it-type-1; transform-origin: 100% 50%; }
.it-type-2 { animation-name: it-type-2; transform-origin: 100% 50%; }
.it-type-3 { animation-name: it-type-3; transform-origin: 100% 50%; }
.it-out-clone { animation-name: it-out-clone; }
.it-spin { animation-name: it-spin; }
.it-out-start { animation-name: it-out-start; }
.it-browser { animation-name: it-browser; transform-origin: 70% 100%; }
.it-obs { animation-name: it-obs; transform-origin: 30% 100%; }
.it-url-type { animation-name: it-url-type; transform-origin: 100% 50%; }
.dg.it .it-url-type { animation-timing-function: steps(21, end); }
.it-dims { animation-name: it-dims; }
.it-tick-0 { animation-name: it-tick-0; transform-origin: center; }
.it-tick-1 { animation-name: it-tick-1; transform-origin: center; }

/* The whole screen clears at 96% and the loop comes round */
@keyframes it-line-0 { 0%, 2.9% { opacity: 0; } 3%, 96% { opacity: 1; } 99%, 100% { opacity: 0; } }
@keyframes it-line-1 { 0%, 17.9% { opacity: 0; } 18%, 96% { opacity: 1; } 99%, 100% { opacity: 0; } }
@keyframes it-line-2 { 0%, 23.9% { opacity: 0; } 24%, 96% { opacity: 1; } 99%, 100% { opacity: 0; } }
@keyframes it-line-3 { 0%, 40.9% { opacity: 0; } 41%, 96% { opacity: 1; } 99%, 100% { opacity: 0; } }
@keyframes it-type-0 { 0%, 3% { transform: scaleX(1); } 12%, 100% { transform: scaleX(0); } }
@keyframes it-type-1 { 0%, 18% { transform: scaleX(1); } 21%, 100% { transform: scaleX(0); } }
@keyframes it-type-2 { 0%, 24% { transform: scaleX(1); } 27%, 100% { transform: scaleX(0); } }
@keyframes it-type-3 { 0%, 41% { transform: scaleX(1); } 44%, 100% { transform: scaleX(0); } }
@keyframes it-out-clone { 0%, 13.9% { opacity: 0; } 14%, 96% { opacity: 1; } 99%, 100% { opacity: 0; } }
@keyframes it-spin { 0%, 27.9% { opacity: 0; } 28%, 38% { opacity: 1; } 39%, 100% { opacity: 0; } }
@keyframes it-out-start {
  0%, 46% { opacity: 0; transform: translateY(4px); }
  48%, 96% { opacity: 1; transform: none; }
  99%, 100% { opacity: 0; }
}
@keyframes it-browser {
  0%, 52% { opacity: 0; transform: translateY(24px) scale(0.96); animation-timing-function: cubic-bezier(0.2, 1.2, 0.4, 1); }
  58%, 95% { opacity: 1; transform: none; }
  99%, 100% { opacity: 0; transform: translateY(8px); }
}
@keyframes it-obs {
  0%, 49% { opacity: 0; transform: translateY(24px) scale(0.96); animation-timing-function: cubic-bezier(0.2, 1.2, 0.4, 1); }
  55%, 95% { opacity: 1; transform: none; }
  99%, 100% { opacity: 0; transform: translateY(8px); }
}
@keyframes it-url-type { 0%, 55% { transform: scaleX(1); } 61%, 100% { transform: scaleX(0); } }
@keyframes it-dims { 0%, 61% { opacity: 0; } 63%, 100% { opacity: 1; } }
@keyframes it-tick-0 {
  0%, 64% { opacity: 0; transform: scale(0.4); animation-timing-function: cubic-bezier(0.2, 1.5, 0.4, 1); }
  67%, 100% { opacity: 1; transform: none; }
}
@keyframes it-tick-1 {
  0%, 72% { opacity: 0; transform: scale(0.4); animation-timing-function: cubic-bezier(0.2, 1.5, 0.4, 1); }
  75%, 100% { opacity: 1; transform: none; }
}
@keyframes it-rotate { to { transform: rotate(360deg); } }
</style>
