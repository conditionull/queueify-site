<script setup lang="ts">
// The picture along the bottom of each feature card: a small, true-to-life
// piece of queueify doing the thing the card describes - real chat replies,
// real log lines, the editor and OBS as they look.
//
// Every moving part in a picture shares one clock: its keyframes span the
// whole loop (`--d`), so the parts stay in step without any script. They run
// while the card is on screen and pause when it is not.
defineProps<{
  name: 'requests' | 'themes' | 'obs' | 'canvas' | 'stats' | 'reload'
}>()

const uid = useId()
const root = ref<SVGSVGElement | null>(null)
const { playing } = useSvgPlayback(root)

// Stats: requests per hour, the last-but-two bar being the hour you are in
const hours = [8, 6, 4, 5, 10, 18, 26, 34, 30, 22, 14, 10].map((h, i) => ({
  x: 30 + i * 25.5,
  h,
  now: i === 9,
}))
const thisHour = hours[9]!

// The eight grab handles OBS draws round a selected source
const handles = [[-3, -3], [59, -3], [122, -3], [-3, 14], [122, 14], [-3, 32], [59, 32], [122, 32]]
</script>

<template>
  <svg
    ref="root"
    :class="['fx', `fx--${name}`, { 'is-playing': playing }]"
    viewBox="0 0 360 200"
    aria-hidden="true"
  >
    <defs>
      <filter :id="`${uid}-shadow`" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000" flood-opacity="0.55" />
      </filter>
    </defs>
    <!-- Requests: a song over the length limit is turned away, one under it goes in -->
    <g v-if="name === 'requests'">
      <defs>
        <clipPath :id="`${uid}-chat`">
          <rect x="12" y="41" width="336" height="149" />
        </clipPath>
      </defs>
      <rect x="12" y="10" width="336" height="180" rx="10" class="fx-panel" :filter="`url(#${uid}-shadow)`" />
      <text x="26" y="30" class="fx-head">Stream chat</text>
      <circle cx="302" cy="26.5" r="3" fill="#ef4444" />
      <text x="334" y="30" text-anchor="end" class="fx-live">LIVE</text>
      <line x1="12" x2="348" y1="40.5" y2="40.5" class="fx-rule" />

      <g :clip-path="`url(#${uid}-chat)`">
        <g class="a rq-scroll">
          <!-- Too long -->
          <text x="26" y="62" class="a rq-a1 fx-chat"><tspan fill="#ff7f50" font-weight="700">olticul</tspan>: !q <tspan class="fx-link">open.spotify.com/track/40riOy…</tspan></text>
          <g class="a rq-ma">
            <rect x="24" y="72" width="312" height="46" rx="7" class="fx-card" />
            <CoverArt :cover="SONGS.hotelCalifornia.cover" :size="30" :x="32" :y="80" />
            <text x="70" y="89" class="fx-song">Hotel California <tspan class="fx-muted" font-weight="400">· 6:30</tspan></text>
            <rect x="70" y="99" width="238" height="4" rx="2" class="fx-track" />
            <rect x="70" y="99" width="221" height="4" rx="2" class="a rq-bar-a" />
            <line x1="274.5" x2="274.5" y1="95" y2="107" class="fx-max" />
            <text x="274.5" y="115" text-anchor="middle" class="fx-tiny">max 6:00</text>
          </g>
          <g class="a rq-chip-a">
            <rect x="266" y="78" width="60" height="16" rx="8" fill="#ef4444" fill-opacity="0.16" stroke="#ef4444" stroke-opacity="0.45" />
            <text x="296" y="89.5" text-anchor="middle" class="fx-chip" fill="#fca5a5">too long</text>
          </g>
          <g class="a rq-a2">
            <rect x="26" y="127.5" width="10" height="10" rx="2" fill="#e91916" />
            <text x="40" y="136" class="fx-chat fx-small"><tspan fill="#1db954" font-weight="700">sadrobotsdontcry</tspan>: @olticul song is too long, max 360s</text>
          </g>

          <!-- Fits -->
          <text x="26" y="154" class="a rq-b1 fx-chat"><tspan fill="#5aa9ff" font-weight="700">Rileyjo7</tspan>: !q <tspan class="fx-link">open.spotify.com/track/0VjIjW…</tspan></text>
          <g class="a rq-mb">
            <rect x="24" y="164" width="312" height="46" rx="7" class="fx-card" />
            <CoverArt :cover="SONGS.happenTwice.cover" :size="30" :x="32" :y="172" />
            <text x="70" y="181" class="fx-song">Happen Twice <tspan class="fx-muted" font-weight="400">· 3:12</tspan></text>
            <rect x="70" y="191" width="238" height="4" rx="2" class="fx-track" />
            <rect x="70" y="191" width="108.8" height="4" rx="2" class="a rq-bar-b" />
            <line x1="274.5" x2="274.5" y1="187" y2="199" class="fx-max" />
            <text x="274.5" y="207" text-anchor="middle" class="fx-tiny">max 6:00</text>
          </g>
          <g class="a rq-chip-b">
            <rect x="266" y="170" width="60" height="16" rx="8" fill="#1db954" fill-opacity="0.16" stroke="#1db954" stroke-opacity="0.5" />
            <text x="296" y="181.5" text-anchor="middle" class="fx-chip" fill="#6ee7a0">fits</text>
          </g>
          <g class="a rq-b2">
            <rect x="26" y="219.5" width="10" height="10" rx="2" fill="#e91916" />
            <text x="40" y="228" class="fx-chat fx-small"><tspan fill="#1db954" font-weight="700">sadrobotsdontcry</tspan>: @Rileyjo7 song added to queue!!</text>
          </g>
        </g>
      </g>
    </g>

    <!-- Themes: the album art is picked up and dragged across, and snaps into place -->
    <g v-else-if="name === 'themes'">
      <rect x="12" y="10" width="336" height="180" rx="10" class="fx-panel" :filter="`url(#${uid}-shadow)`" />
      <text x="26" y="30" class="fx-head">Theme editor</text>
      <text x="104" y="30" class="fx-mono fx-muted" font-size="10">cooler_swag</text>
      <g class="a th-unsaved">
        <circle cx="282" cy="26.5" r="3" fill="#f2a93b" />
        <text x="334" y="30" text-anchor="end" class="fx-status" fill="#f2a93b">Unsaved</text>
      </g>
      <g class="a th-saved">
        <circle cx="270" cy="26.5" r="3" fill="#1db954" />
        <text x="334" y="30" text-anchor="end" class="fx-status" fill="#1db954">Saved · live</text>
      </g>
      <line x1="12" x2="348" y1="40.5" y2="40.5" class="fx-rule" />

      <rect x="26" y="52" width="308" height="124" rx="8" class="fx-editor-canvas" />
      <line x1="308.5" x2="308.5" y1="58" y2="170" class="a th-guide" />

      <rect x="40" y="78" width="280" height="72" rx="16" class="fx-widget" :filter="`url(#${uid}-shadow)`" />
      <g class="a th-text">
        <text x="114" y="109" class="fx-title" :fill="SONGS.mindFields.accent">{{ SONGS.mindFields.title }}</text>
        <text x="114" y="126" class="fx-artist">{{ SONGS.mindFields.artist }}</text>
        <rect x="114" y="135" width="190" height="3" rx="1.5" fill="#fff" fill-opacity="0.14" />
        <rect x="114" y="135" width="72" height="3" rx="1.5" fill="#f2a93b" />
      </g>
      <g class="a th-art">
        <CoverArt :cover="SONGS.mindFields.cover" :size="52" :x="50" :y="88" />
        <g class="a th-sel">
          <rect x="46.5" y="84.5" width="59" height="59" rx="12" class="fx-select" />
          <rect x="44" y="82" width="5" height="5" rx="1" class="fx-handle" />
          <rect x="103" y="82" width="5" height="5" rx="1" class="fx-handle" />
          <rect x="44" y="141" width="5" height="5" rx="1" class="fx-handle" />
          <rect x="103" y="141" width="5" height="5" rx="1" class="fx-handle" />
        </g>
      </g>
      <g transform="translate(84 120)">
        <path class="a th-cursor fx-cursor" d="M0 0 v15 l4 -4 l3 7 l3 -1.4 l-3 -6.6 h5.6 z" />
      </g>
    </g>

    <!-- OBS: !bc and !tr from chat move the widget between its two saved spots -->
    <g v-else-if="name === 'obs'">
      <defs>
        <linearGradient :id="`${uid}-scene`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2e2a78" />
          <stop offset="0.65" stop-color="#151a3d" />
          <stop offset="1" stop-color="#0a0f1f" />
        </linearGradient>
        <clipPath :id="`${uid}-canvas`">
          <rect x="24" y="48" width="312" height="132" rx="4" />
        </clipPath>
      </defs>
      <rect x="12" y="10" width="336" height="180" rx="10" class="fx-panel" :filter="`url(#${uid}-shadow)`" />
      <text x="26" y="30" class="fx-head">OBS</text>
      <text x="334" y="30" text-anchor="end" class="fx-muted" font-size="10">Preview · Gaming</text>
      <line x1="12" x2="348" y1="40.5" y2="40.5" class="fx-rule" />

      <g :clip-path="`url(#${uid}-canvas)`">
        <rect x="24" y="48" width="312" height="132" :fill="`url(#${uid}-scene)`" />
        <circle cx="70" cy="78" r="11" fill="#f5d77a" fill-opacity="0.85" />
        <path d="M24 150 q60 -30 120 -12 t110 -10 t82 6 v46 h-312 z" fill="#1c1a4d" />
        <path d="M24 166 q80 -16 160 -4 t152 0 v18 h-312 z" fill="#110f30" />
      </g>

      <g transform="translate(32 116)">
        <rect width="80" height="56" rx="6" fill="#000" fill-opacity="0.55" />
        <text x="8" y="13" class="fx-overlay-head">chat</text>
        <text x="8" y="30" class="a ob-m1 fx-overlay"><tspan fill="#ff7f50" font-weight="700">olticul</tspan>: !bc</text>
        <text x="8" y="46" class="a ob-m2 fx-overlay"><tspan fill="#ff7f50" font-weight="700">olticul</tspan>: !tr</text>
      </g>

      <g transform="translate(200 58)">
        <g class="a ob-move">
          <rect width="124" height="34" rx="9" fill="#000" fill-opacity="0.82" :filter="`url(#${uid}-shadow)`" />
          <CoverArt :cover="SONGS.happenTwice.cover" :size="24" :x="5" :y="5" />
          <rect x="36" y="9" width="58" height="5" rx="2.5" fill="#b57bea" />
          <rect x="36" y="18" width="36" height="3.5" rx="1.75" fill="#fff" fill-opacity="0.5" />
          <rect x="36" y="26" width="80" height="2" rx="1" fill="#fff" fill-opacity="0.15" />
          <rect x="36" y="26" width="30" height="2" rx="1" fill="#b57bea" />
          <rect x="-1.5" y="-1.5" width="127" height="37" class="fx-obs-box" />
          <rect v-for="(h, i) in handles" :key="i" :x="h[0]" :y="h[1]" width="4" height="4" fill="#ff4d4f" />
        </g>
      </g>
    </g>

    <!-- Canvas: the album cover gives way to the track's looping clip, in the same spot -->
    <g v-else-if="name === 'canvas'">
      <defs>
        <clipPath :id="`${uid}-art`">
          <rect x="32" y="58" width="108" height="108" rx="12" />
        </clipPath>
        <linearGradient :id="`${uid}-cover`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f6b58a" />
          <stop offset="0.55" stop-color="#e8875a" />
          <stop offset="1" stop-color="#5b3a8c" />
        </linearGradient>
        <filter :id="`${uid}-blur`" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <rect x="100" y="12" width="160" height="22" rx="11" class="fx-seg" />
      <rect x="102" y="14" width="76" height="18" rx="9" class="a cv-seg fx-seg-on" />
      <text x="140" y="26.5" text-anchor="middle" class="a cv-seg-a fx-seg-text">Album cover</text>
      <text x="220" y="26.5" text-anchor="middle" class="a cv-seg-b fx-seg-text">Canvas video</text>

      <rect x="20" y="46" width="320" height="132" rx="18" class="fx-widget" />
      <g :clip-path="`url(#${uid}-art)`">
        <g class="a cv-video">
          <!-- The clip is the cover come to life: its sky, its sun, its hills -->
          <rect x="32" y="58" width="108" height="108" fill="#2a1d4a" />
          <g :filter="`url(#${uid}-blur)`">
            <ellipse cx="70" cy="76" rx="70" ry="30" fill="#f6b58a" fill-opacity="0.9" class="loop cv-b1" />
            <ellipse cx="112" cy="130" rx="60" ry="26" fill="#e8875a" fill-opacity="0.85" class="loop cv-b2" />
            <circle cx="104" cy="92" r="14" fill="#fff4d6" class="loop cv-b3" />
            <ellipse cx="86" cy="170" rx="90" ry="22" fill="#5b3a8c" />
          </g>
        </g>
      </g>
      <rect x="32" y="58" width="108" height="108" rx="12" fill="none" stroke="#fff" stroke-opacity="0.14" class="a cv-video" />
      <g class="a cv-art">
        <rect x="32" y="58" width="108" height="108" rx="12" :fill="`url(#${uid}-cover)`" />
        <circle cx="86" cy="104" r="16" fill="#fff4d6" fill-opacity="0.9" />
        <path d="M32 136 q27 -8 54 0 t54 0 v18 a12 12 0 0 1 -12 12 h-84 a12 12 0 0 1 -12 -12 z" fill="#2a1d4a" fill-opacity="0.8" />
      </g>
      <g>
        <text x="158" y="104" class="fx-title fx-title-lg" :fill="SONGS.setPiece.accent">{{ SONGS.setPiece.title }}</text>
        <text x="158" y="123" class="fx-artist">{{ SONGS.setPiece.artist }}</text>
        <rect x="158" y="140" width="166" height="3" rx="1.5" fill="#fff" fill-opacity="0.2" />
        <rect x="158" y="140" width="70" height="3" rx="1.5" :fill="SONGS.setPiece.accent" />
      </g>
    </g>

    <!-- Stats: a request comes in and the numbers move -->
    <g v-else-if="name === 'stats'">
      <rect x="12" y="10" width="336" height="180" rx="10" class="fx-panel" :filter="`url(#${uid}-shadow)`" />
      <text x="26" y="30" class="fx-head">Stats</text>
      <rect x="276" y="18" width="58" height="17" rx="8.5" fill="#1db954" />
      <text x="305" y="30" text-anchor="middle" class="fx-chip" fill="#06140b">Overview</text>
      <line x1="12" x2="348" y1="40.5" y2="40.5" class="fx-rule" />

      <rect x="24" y="50" width="150" height="52" rx="7" class="fx-card" />
      <text x="36" y="79" class="a st-old fx-number">160</text>
      <text x="36" y="79" class="a st-new fx-number">161</text>
      <text x="36" y="94" class="fx-tiny fx-label">Songs queued</text>

      <rect x="186" y="50" width="150" height="52" rx="7" class="fx-card" />
      <text x="198" y="79" class="a st-old fx-number">9h 32m</text>
      <text x="198" y="79" class="a st-new fx-number">9h 35m</text>
      <text x="198" y="94" class="fx-tiny fx-label">Of music</text>

      <line x1="24" x2="336" y1="176.5" y2="176.5" class="fx-rule" />
      <rect
        v-for="bar in hours"
        :key="bar.x"
        :x="bar.x"
        :y="176 - bar.h"
        width="14"
        :height="bar.h"
        rx="2"
        :class="bar.now ? 'fx-bar-now' : 'fx-bar'"
      />
      <!-- This hour's bar gains one request -->
      <rect :x="thisHour.x" :y="176 - thisHour.h - 12" width="14" height="14" rx="2" class="a st-grow fx-bar-now" />
      <text :x="thisHour.x + 7" :y="176 - thisHour.h - 20" text-anchor="middle" class="a st-plus fx-plus">+1</text>
    </g>

    <!-- No restarts: the bot keeps running while OBS switches scene, theme and size -->
    <g v-else-if="name === 'reload'">
      <rect x="12" y="10" width="336" height="180" rx="10" class="fx-panel fx-term" :filter="`url(#${uid}-shadow)`" />
      <circle cx="27" cy="25" r="3.5" class="fx-dot" />
      <circle cx="39" cy="25" r="3.5" class="fx-dot" />
      <circle cx="51" cy="25" r="3.5" class="fx-dot" />
      <text x="180" y="28.5" text-anchor="middle" class="fx-mono fx-muted" font-size="10">npm start</text>
      <line x1="12" x2="348" y1="38.5" y2="38.5" class="fx-rule" />

      <g class="fx-mono fx-log">
        <text x="24" y="58"><tspan class="fx-dim">Widget (OBS browser source) </tspan>http://localhost:3001</text>
        <text x="24" y="73"><tspan class="fx-dim">Settings dashboard          </tspan>http://127.0.0.1:3002</text>

        <g class="a lg-1">
          <text x="24" y="98">Scene "Just Chatting" uses the "swag" theme - <tspan fill="#6ee7a0">switched.</tspan></text>
          <rect x="22" y="89" width="316" height="13" class="a lg-1c fx-cover" />
        </g>
        <g class="a lg-2">
          <text x="24" y="113">Widget resized in OBS: now rendering at <tspan fill="#f2c46b">540 x 540</tspan>.</text>
          <rect x="22" y="104" width="316" height="13" class="a lg-2c fx-cover" />
        </g>
        <g class="a lg-3">
          <text x="24" y="133">Scene "Gaming" uses the "cooler_swag" theme - <tspan fill="#6ee7a0">switched.</tspan></text>
          <rect x="22" y="124" width="316" height="13" class="a lg-3c fx-cover" />
        </g>
        <g class="a lg-4">
          <text x="24" y="148">Widget resized in OBS: now rendering at <tspan fill="#f2c46b">680 x 192</tspan>.</text>
          <rect x="22" y="139" width="316" height="13" class="a lg-4c fx-cover" />
        </g>
      </g>

      <line x1="12" x2="348" y1="163.5" y2="163.5" class="fx-rule" />
      <circle cx="28" cy="177" r="3" fill="#1db954" class="loop lg-pulse" />
      <text x="38" y="180.5" class="fx-mono" font-size="10" fill="#6ee7a0">running</text>
      <text x="334" y="180.5" text-anchor="end" class="fx-mono fx-dim" font-size="10">no restarts · uptime 2h 14m</text>
    </g>
  </svg>
</template>

<style>
.fx {
  display: block;
  width: 100%;
  height: 100%;
  font-family: inherit;
  --d: 8s;
}

/* ---------------------------------------------------------- shared look */

.fx-panel { fill: #111116; stroke: rgba(255, 255, 255, 0.08); }
.fx-term { fill: #0b0b0e; }
.fx-rule { stroke: rgba(255, 255, 255, 0.07); }
.fx-card { fill: #18181f; stroke: rgba(255, 255, 255, 0.06); }
.fx-widget { fill: #0a0a0e; stroke: rgba(255, 255, 255, 0.09); }
.fx-editor-canvas { fill: rgba(255, 255, 255, 0.015); stroke: rgba(255, 255, 255, 0.12); stroke-dasharray: 3 3; }
.fx-track { fill: rgba(255, 255, 255, 0.1); }
.fx-max { stroke: rgba(255, 255, 255, 0.55); }
.fx-dot { fill: #3f3f46; }

.fx-head { fill: #fafafa; font-size: 11px; font-weight: 600; }
.fx-live { fill: #ef4444; font-size: 9px; font-weight: 700; letter-spacing: 0.04em; }
.fx-status { font-size: 10px; font-weight: 600; }
.fx-muted { fill: #a1a1aa; }
.fx-dim { fill: #71717a; }
.fx-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.fx-chat { fill: #d4d4d8; font-size: 10.5px; }
.fx-small { font-size: 10px; }
.fx-link { fill: #a1a1aa; }
.fx-song { fill: #fafafa; font-size: 11px; font-weight: 600; }
.fx-tiny { fill: #71717a; font-size: 8.5px; }
.fx-label { font-size: 9.5px; }
.fx-chip { font-size: 9px; font-weight: 700; }
.fx-title { font-size: 16px; font-weight: 700; letter-spacing: -0.01em; }
.fx-title-lg { font-size: 19px; }
.fx-artist { fill: #fff; fill-opacity: 0.62; font-size: 11px; font-weight: 500; }
.fx-number { fill: #fafafa; font-size: 18px; font-weight: 700; letter-spacing: -0.01em; }
.fx-log { fill: #d4d4d8; font-size: 9px; }
.fx-cover { fill: #0b0b0e; }
.fx-select { fill: none; stroke: #1db954; stroke-width: 1.2; }
.fx-handle { fill: #0a0a0e; stroke: #1db954; stroke-width: 1.2; }
.fx-cursor { fill: #fff; stroke: #0a0a0e; stroke-width: 1; stroke-linejoin: round; }
.fx-overlay-head { fill: #fff; fill-opacity: 0.45; font-size: 8px; font-weight: 600; }
.fx-overlay { fill: #fff; font-size: 9.5px; }
.fx-obs-box { fill: none; stroke: #ff4d4f; stroke-width: 1; }
.fx-seg { fill: #18181f; stroke: rgba(255, 255, 255, 0.08); }
.fx-seg-on { fill: rgba(255, 255, 255, 0.12); }
.fx-seg-text { font-size: 9.5px; font-weight: 600; }
.fx-bar { fill: #1db954; fill-opacity: 0.32; }
.fx-bar-now { fill: #1db954; }
.fx-plus { fill: #6ee7a0; font-size: 10px; font-weight: 700; }
.th-guide { stroke: #1db954; stroke-dasharray: 3 3; }

/* ------------------------------------------------------------- timing */

/* Every moving part runs on its picture's loop. The parts only name their
   keyframes; how long, how often and from when is decided here, once. */
.fx .a {
  animation-duration: var(--d);
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transform-box: fill-box;
}

/* Side motion with its own rhythm: the Canvas clip, the "running" dot */
.fx .loop {
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  transform-box: fill-box;
  transform-origin: center;
}

.fx:not(.is-playing) .a,
.fx:not(.is-playing) .loop {
  animation-play-state: paused;
}

/* ------------------------------------------------------------ requests */

.fx--requests { --d: 9s; }
.rq-scroll { animation-name: rq-scroll; }
.rq-a1 { animation-name: rq-a1; }
.rq-ma { animation-name: rq-ma; }
.rq-bar-a { animation-name: rq-bar-a; transform-origin: 0 50%; }
.rq-chip-a { animation-name: rq-chip-a; transform-origin: center; }
.rq-a2 { animation-name: rq-a2; }
.rq-b1 { animation-name: rq-b1; }
.rq-mb { animation-name: rq-mb; }
.rq-bar-b { animation-name: rq-bar-b; transform-origin: 0 50%; }
.rq-chip-b { animation-name: rq-chip-b; transform-origin: center; }
.rq-b2 { animation-name: rq-b2; }
/* The too-long bar fills at a steady rate, so it visibly runs past the line */
.fx .rq-bar-a { animation-timing-function: linear; }

@keyframes rq-scroll {
  0%, 48.9% { transform: translateY(0); opacity: 1; }
  54.4%, 94.4% { transform: translateY(-92px); opacity: 1; }
  98.9%, 100% { transform: translateY(-92px); opacity: 0; }
}
@keyframes rq-a1 { 0%, 3.3% { opacity: 0; transform: translateY(6px); animation-timing-function: cubic-bezier(0.2, 1.25, 0.4, 1); } 6.7%, 100% { opacity: 1; transform: none; } }
@keyframes rq-ma { 0%, 8.9% { opacity: 0; transform: translateY(6px); animation-timing-function: cubic-bezier(0.2, 1.25, 0.4, 1); } 12.2%, 100% { opacity: 1; transform: none; } }
@keyframes rq-bar-a {
  0%, 13.3% { transform: scaleX(0); fill: #2ecf7c; }
  26.5% { fill: #2ecf7c; }
  26.9% { fill: #f87171; }
  27.8%, 100% { transform: scaleX(1); fill: #f87171; }
}
@keyframes rq-chip-a { 0%, 28.9% { opacity: 0; transform: scale(0.8); animation-timing-function: cubic-bezier(0.2, 1.4, 0.4, 1); } 31.1%, 100% { opacity: 1; transform: none; } }
@keyframes rq-a2 { 0%, 33.3% { opacity: 0; transform: translateY(6px); animation-timing-function: cubic-bezier(0.2, 1.25, 0.4, 1); } 36.7%, 100% { opacity: 1; transform: none; } }
@keyframes rq-b1 { 0%, 55.6% { opacity: 0; transform: translateY(6px); animation-timing-function: cubic-bezier(0.2, 1.25, 0.4, 1); } 58.9%, 100% { opacity: 1; transform: none; } }
@keyframes rq-mb { 0%, 61.1% { opacity: 0; transform: translateY(6px); animation-timing-function: cubic-bezier(0.2, 1.25, 0.4, 1); } 64.4%, 100% { opacity: 1; transform: none; } }
@keyframes rq-bar-b { 0%, 65.6% { transform: scaleX(0); fill: #2ecf7c; } 74.4%, 100% { transform: scaleX(1); fill: #2ecf7c; } }
@keyframes rq-chip-b { 0%, 75.6% { opacity: 0; transform: scale(0.8); animation-timing-function: cubic-bezier(0.2, 1.4, 0.4, 1); } 77.8%, 100% { opacity: 1; transform: none; } }
@keyframes rq-b2 { 0%, 80% { opacity: 0; transform: translateY(6px); animation-timing-function: cubic-bezier(0.2, 1.25, 0.4, 1); } 83.3%, 100% { opacity: 1; transform: none; } }

/* -------------------------------------------------------------- themes */

.fx--themes { }
.th-art { animation-name: th-art; }
.th-text { animation-name: th-text; }
.th-sel { animation-name: th-sel; }
.th-guide { animation-name: th-guide; }
.th-cursor { animation-name: th-cursor; }
.th-unsaved { animation-name: th-unsaved; }
.th-saved { animation-name: th-saved; }

@keyframes th-cursor {
  0%, 3.75% { transform: translate(200px, 50px); opacity: 0; }
  11.25%, 15% { transform: translate(0, 0); opacity: 1; }
  28.75%, 32.5% { transform: translate(206px, 0); opacity: 1; }
  40%, 100% { transform: translate(246px, 40px); opacity: 0; }
}
@keyframes th-sel {
  0%, 11.9% { opacity: 0; }
  13.1%, 32.5% { opacity: 1; }
  35%, 100% { opacity: 0; }
}
@keyframes th-art {
  0%, 15% { transform: translateX(0); }
  28.75%, 75% { transform: translateX(206px); }
  86.25%, 100% { transform: translateX(0); }
}
@keyframes th-text {
  0%, 15% { transform: translateX(0); }
  28.75%, 75% { transform: translateX(-64px); }
  86.25%, 100% { transform: translateX(0); }
}
@keyframes th-guide {
  0%, 25% { opacity: 0; }
  27.5%, 33.75% { opacity: 1; }
  37.5%, 100% { opacity: 0; }
}
@keyframes th-unsaved {
  0%, 15% { opacity: 0; }
  16.25%, 40% { opacity: 1; }
  42.5%, 100% { opacity: 0; }
}
@keyframes th-saved {
  0%, 15% { opacity: 1; }
  16.25%, 40% { opacity: 0; }
  42.5%, 100% { opacity: 1; }
}

/* ----------------------------------------------------------------- obs */

.fx--obs { }
.ob-move { animation-name: ob-move; }
.ob-m1 { animation-name: ob-m1; }
.ob-m2 { animation-name: ob-m2; }

@keyframes ob-move {
  0%, 11.25% { transform: translate(0, 0); animation-timing-function: cubic-bezier(0.55, 0, 0.15, 1.08); }
  23.75%, 56.25% { transform: translate(-82px, 78px); animation-timing-function: cubic-bezier(0.55, 0, 0.15, 1.08); }
  68.75%, 100% { transform: translate(0, 0); }
}
@keyframes ob-m1 {
  0%, 6.25% { opacity: 0; transform: translateY(4px); }
  8.75%, 93.75% { opacity: 1; transform: none; }
  98.75%, 100% { opacity: 0; }
}
@keyframes ob-m2 {
  0%, 51.25% { opacity: 0; transform: translateY(4px); }
  53.75%, 93.75% { opacity: 1; transform: none; }
  98.75%, 100% { opacity: 0; }
}

/* -------------------------------------------------------------- canvas */

.fx--canvas { }
.cv-seg { animation-name: cv-seg; }
.cv-seg-a { animation-name: cv-seg-a; }
.cv-seg-b { animation-name: cv-seg-b; }
.cv-art { animation-name: cv-art; transform-origin: center; }
.cv-video { animation-name: cv-video; }
.cv-b1 { animation-name: cv-b1; animation-duration: 6s; }
.cv-b2 { animation-name: cv-b2; animation-duration: 7s; }
.cv-b3 { animation-name: cv-b3; animation-duration: 5.5s; }

@keyframes cv-seg {
  0%, 20% { transform: translateX(0); }
  25%, 72.5% { transform: translateX(80px); }
  77.5%, 100% { transform: translateX(0); }
}
@keyframes cv-seg-a {
  0%, 20% { fill: #fafafa; }
  25%, 72.5% { fill: #71717a; }
  77.5%, 100% { fill: #fafafa; }
}
@keyframes cv-seg-b {
  0%, 20% { fill: #71717a; }
  25%, 72.5% { fill: #fafafa; }
  77.5%, 100% { fill: #71717a; }
}
/* The cover and the clip trade places when the setting flips */
@keyframes cv-art {
  0%, 25% { opacity: 1; transform: scale(1); }
  32%, 77.5% { opacity: 0; transform: scale(0.96); }
  85%, 100% { opacity: 1; transform: scale(1); }
}
@keyframes cv-video {
  0%, 25% { opacity: 0; }
  32%, 77.5% { opacity: 1; }
  85%, 100% { opacity: 0; }
}
@keyframes cv-b1 { 50% { transform: translate(26px, 10px) scale(1.1); } }
@keyframes cv-b2 { 50% { transform: translate(-28px, -12px) scale(0.92); } }
@keyframes cv-b3 { 50% { transform: translate(-16px, 8px) scale(1.25); } }

/* --------------------------------------------------------------- stats */

.fx--stats { }
.st-old { animation-name: st-old; }
.st-new { animation-name: st-new; }
.st-grow { animation-name: st-grow; transform-origin: 50% 100%; }
.st-plus { animation-name: st-plus; }

@keyframes st-old {
  0%, 37.5% { opacity: 1; transform: none; }
  42.5%, 92.5% { opacity: 0; transform: translateY(-8px); }
  97.5%, 100% { opacity: 1; transform: none; }
}
@keyframes st-new {
  0%, 37.5% { opacity: 0; transform: translateY(8px); animation-timing-function: cubic-bezier(0.2, 1.3, 0.4, 1); }
  42.5%, 92.5% { opacity: 1; transform: none; }
  97.5%, 100% { opacity: 0; transform: translateY(8px); }
}
@keyframes st-grow {
  0%, 32.5% { transform: scaleY(0); animation-timing-function: cubic-bezier(0.2, 1.4, 0.4, 1); }
  40%, 92.5% { transform: scaleY(1); }
  97.5%, 100% { transform: scaleY(0); }
}
@keyframes st-plus {
  0%, 32.5% { opacity: 0; transform: translateY(6px); }
  37.5% { opacity: 1; transform: none; }
  47.5% { opacity: 1; transform: translateY(-4px); }
  55%, 100% { opacity: 0; transform: translateY(-8px); }
}

/* -------------------------------------------------------------- reload */

.fx--reload { --d: 9s; }
.lg-1 { animation-name: lg-in-1; }
.lg-2 { animation-name: lg-in-2; }
.lg-3 { animation-name: lg-in-3; }
.lg-4 { animation-name: lg-in-4; }
.lg-1c { animation-name: lg-type-1; transform-origin: 100% 50%; }
.lg-2c { animation-name: lg-type-2; transform-origin: 100% 50%; }
.lg-3c { animation-name: lg-type-3; transform-origin: 100% 50%; }
.lg-4c { animation-name: lg-type-4; transform-origin: 100% 50%; }
.lg-pulse { animation-name: lg-pulse; animation-duration: 2s; }
/* The covers come off in steps, which reads as the line being typed */
.fx .lg-1c, .fx .lg-2c, .fx .lg-3c, .fx .lg-4c { animation-timing-function: steps(18, end); }

/* Each line: shown at its time, typed out by pulling its cover off to the
   right, and all four cleared together before the loop comes round */
@keyframes lg-in-1 { 0%, 10% { opacity: 0; } 10.1%, 92% { opacity: 1; } 97%, 100% { opacity: 0; } }
@keyframes lg-in-2 { 0%, 20% { opacity: 0; } 20.1%, 92% { opacity: 1; } 97%, 100% { opacity: 0; } }
@keyframes lg-in-3 { 0%, 46% { opacity: 0; } 46.1%, 92% { opacity: 1; } 97%, 100% { opacity: 0; } }
@keyframes lg-in-4 { 0%, 56% { opacity: 0; } 56.1%, 92% { opacity: 1; } 97%, 100% { opacity: 0; } }
@keyframes lg-type-1 { 0%, 10% { transform: scaleX(1); } 16%, 100% { transform: scaleX(0); } }
@keyframes lg-type-2 { 0%, 20% { transform: scaleX(1); } 26%, 100% { transform: scaleX(0); } }
@keyframes lg-type-3 { 0%, 46% { transform: scaleX(1); } 52%, 100% { transform: scaleX(0); } }
@keyframes lg-type-4 { 0%, 56% { transform: scaleX(1); } 62%, 100% { transform: scaleX(0); } }
@keyframes lg-pulse { 50% { opacity: 0.35; } }
</style>
