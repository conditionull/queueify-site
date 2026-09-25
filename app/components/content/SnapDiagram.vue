<script setup lang="ts">
// Snapping in the theme editor: the title is dragged towards the cover, and
// as it comes within reach it snaps to the spacing and the centre line, with
// the guides showing what it lined up with. Then the same drag with Ctrl
// held: no guides, no snap, it goes exactly where it is let go.

const song = SONGS.thePlace

const uid = useId()
const root = ref<HTMLElement | null>(null)
const { playing } = useSvgPlayback(root)
</script>

<template>
  <figure ref="root" :class="['dg', 'sn', { 'is-playing': playing }]" style="--loop: 8s">
    <div class="dg-stage">
      <svg
        viewBox="0 0 480 226"
        role="img"
        aria-label="In the theme editor, the title is dragged towards the cover art. Guides appear as it lines up with the cover's centre and a 12 pixel gap, and it snaps into place. Then Ctrl is held and the title is dragged again, with no guides and no snapping."
      >
        <defs>
          <filter :id="`${uid}-shadow`" x="-20%" y="-30%" width="140%" height="180%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000" flood-opacity="0.5" />
          </filter>
        </defs>

        <rect x="12" y="12" width="456" height="202" rx="9" class="dg-panel" />
        <text x="26" y="32" class="dg-head">Theme editor</text>
        <text x="454" y="32" text-anchor="end" class="dg-tiny dg-mono">Canvas · 680 × 192</text>
        <line x1="12" x2="468" y1="42.5" y2="42.5" class="dg-rule" />

        <rect x="36" y="58" width="408" height="120" rx="8" class="sn-canvas" />
        <rect x="52" y="72" width="376" height="92" rx="18" class="dg-widget" :filter="`url(#${uid}-shadow)`" />
        <CoverArt :cover="song.cover" :size="64" :x="66" :y="86" />

        <!-- What it lines up with: the cover's centre, and a 12px gap -->
        <g class="da sn-guides">
          <line x1="44" x2="436" y1="118.5" y2="118.5" class="sn-guide" />
          <line x1="142.5" x2="142.5" y1="62" y2="174" class="sn-guide" />
          <path d="M131 152 v6 m0 -3 h12 m0 -3 v6" class="sn-gap" />
          <text x="137" y="170" text-anchor="middle" class="sn-gap-label">12</text>
        </g>

        <!-- The title block being dragged -->
        <g class="da sn-block">
          <rect x="206" y="98" width="150" height="40" rx="4" class="sn-select" />
          <text x="212" y="116" class="dg-title" :fill="song.accent" font-size="16">{{ song.title }}</text>
          <text x="212" y="131" class="dg-artist" font-size="11">{{ song.artist }}</text>
        </g>

        <!-- The pointer, and Ctrl while it is held -->
        <g transform="translate(262 112)">
          <path class="da sn-cursor" d="M0 0 v15 l4 -4 l3 7 l3 -1.4 l-3 -6.6 h5.6 z" />
        </g>
        <g class="da sn-ctrl">
          <rect x="36" y="186" width="34" height="18" rx="4" class="sn-key" />
          <text x="53" y="198.5" text-anchor="middle" class="sn-key-text">Ctrl</text>
          <text x="78" y="198.5" class="dg-tiny" fill="#a1a1aa">held: snapping off</text>
        </g>
      </svg>
    </div>
  </figure>
</template>

<style>
.sn-canvas { fill: rgba(255, 255, 255, 0.015); stroke: rgba(255, 255, 255, 0.12); stroke-dasharray: 3 3; }
.sn-guide { stroke: #ff4fd8; stroke-width: 1; stroke-dasharray: 3 3; }
.sn-gap { fill: none; stroke: #ff4fd8; stroke-width: 1; }
.sn-gap-label { fill: #ff4fd8; font-size: 9px; font-weight: 700; }
.sn-select { fill: none; stroke: #1db954; stroke-width: 1; }
.sn-cursor { fill: #fff; stroke: #0a0a0e; stroke-width: 1; stroke-linejoin: round; }
.sn-key { fill: #18181f; stroke: rgba(255, 255, 255, 0.25); }
.sn-key-text { fill: #fafafa; font-size: 9.5px; font-weight: 600; }

.sn-block { animation-name: sn-block; }
.sn-cursor { animation-name: sn-cursor; }
.sn-guides { animation-name: sn-guides; }
.sn-ctrl { animation-name: sn-ctrl; transform-origin: 0 50%; }

/* Dragged left until it is within reach (27.5%), then a quick snap onto the
   gap and the centre line; with Ctrl, dragged right and left exactly where
   it is let go; then back where it began */
@keyframes sn-block {
  0%, 10% { transform: translate(0, 0); animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1); }
  27.5% { transform: translate(-58px, 3px); animation-timing-function: cubic-bezier(0.2, 1.6, 0.4, 1); }
  29.5%, 56.25% { transform: translate(-64px, 0); animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1); }
  75%, 92.5% { transform: translate(-27px, 7px); animation-timing-function: cubic-bezier(0.5, 0, 0.2, 1); }
  100% { transform: translate(0, 0); }
}
@keyframes sn-cursor {
  0% { transform: translate(60px, 40px); opacity: 0; }
  7.5%, 10% { transform: translate(0, 0); opacity: 1; animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1); }
  27.5% { transform: translate(-58px, 3px); opacity: 1; }
  29.5%, 32.5% { transform: translate(-64px, 0); opacity: 1; }
  40%, 48% { transform: translate(-30px, 40px); opacity: 0; }
  53.75%, 56.25% { transform: translate(-64px, 0); opacity: 1; animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1); }
  75%, 77.5% { transform: translate(-27px, 7px); opacity: 1; }
  82.5%, 100% { transform: translate(10px, 40px); opacity: 0; }
}
@keyframes sn-guides {
  0%, 26% { opacity: 0; }
  28%, 38% { opacity: 1; }
  41%, 100% { opacity: 0; }
}
@keyframes sn-ctrl {
  0%, 48% { opacity: 0; transform: translateY(4px); }
  51%, 80% { opacity: 1; transform: none; }
  84%, 100% { opacity: 0; }
}
</style>
