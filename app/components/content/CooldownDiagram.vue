<script setup lang="ts">
// Global against per-user cooldowns, the same four !np's run through both.
// olticul asks first and gets an answer either way. Rileyjo7 asks two seconds
// later: the global cooldown turns them away, the per-user one does not,
// because it was olticul's timer that started. olticul asking again is turned
// away by both. And a mod gets straight through, cooldown or not.

const panels = [
  {
    x: 12,
    title: 'Global cooldown',
    note: 'one timer for all of chat',
    timers: [{ label: 'chat', cls: 'cd-t1' }],
    verdicts: [true, false, false, true],
  },
  {
    x: 246,
    title: 'Per-user cooldown',
    note: 'a timer for each viewer',
    timers: [{ label: 'olticul', cls: 'cd-t1' }, { label: 'Rileyjo7', cls: 'cd-t2' }],
    verdicts: [true, true, false, true],
  },
]

const messages = [
  { user: 'olticul', color: CHATTERS.olticul, mod: false },
  { user: 'Rileyjo7', color: CHATTERS.Rileyjo7, mod: false },
  { user: 'olticul', color: CHATTERS.olticul, mod: false },
  { user: 'glorysynex', color: CHATTERS.glorysynex, mod: true },
]

const root = ref<HTMLElement | null>(null)
const { playing } = useSvgPlayback(root)
</script>

<template>
  <figure ref="root" :class="['dg', 'cd', { 'is-playing': playing }]" style="--loop: 10s">
    <div class="dg-stage">
      <svg
        viewBox="0 0 480 236"
        role="img"
        aria-label="Two chats side by side, one with a global cooldown and one with per-user cooldowns. olticul runs !np and it works in both. Rileyjo7 runs it two seconds later: turned away by the global cooldown, answered under the per-user one. olticul runs it again and is turned away by both. A mod runs it and gets through in both."
      >
        <g v-for="panel in panels" :key="panel.x" :transform="`translate(${panel.x} 12)`">
          <rect width="222" height="212" rx="9" class="dg-panel" />
          <text x="14" y="22" class="dg-head">{{ panel.title }}</text>
          <text x="14" y="36" class="dg-tiny">{{ panel.note }}</text>

          <!-- The timers, running down -->
          <g v-for="(timer, t) in panel.timers" :key="timer.label" :transform="`translate(14 ${48 + t * 14})`">
            <text x="0" y="7" class="dg-tiny dg-mono">{{ timer.label }}</text>
            <rect x="58" y="2" width="136" height="4" rx="2" fill="#fff" fill-opacity="0.08" />
            <rect x="58" y="2" width="136" height="4" rx="2" :class="['da', 'cd-timer', timer.cls]" />
          </g>
          <line x1="0" x2="222" y1="84.5" y2="84.5" class="dg-rule" />

          <!-- The four requests, and what each chat made of them -->
          <!-- Placed by the outer group, animated by the inner: a CSS transform
               would replace an SVG transform attribute on the same element -->
          <g v-for="(msg, m) in messages" :key="m" :transform="`translate(14 ${106 + m * 28})`">
            <g :class="['da', `cd-m${m + 1}`]">
              <rect v-if="msg.mod" x="0" y="-9" width="10" height="10" rx="2" fill="#00ad03" />
              <text :x="msg.mod ? 14 : 0" y="0" class="dg-text" :class="{ 'cd-ignored': !panel.verdicts[m] }"><tspan :fill="msg.color" font-weight="700">{{ msg.user }}</tspan>: !np</text>
              <g :class="['da', `cd-v${m + 1}`]">
                <rect x="136" y="-11" width="58" height="16" rx="8" :class="panel.verdicts[m] ? 'cd-ok' : 'cd-no'" />
                <text x="165" y="0.5" text-anchor="middle" class="cd-chip" :fill="panel.verdicts[m] ? '#6ee7a0' : '#a1a1aa'">{{ panel.verdicts[m] ? (msg.mod ? 'mod' : 'answered') : 'cooldown' }}</text>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  </figure>
</template>

<style>
.cd-ok { fill: rgba(29, 185, 84, 0.16); stroke: rgba(29, 185, 84, 0.5); }
.cd-no { fill: rgba(255, 255, 255, 0.04); stroke: rgba(255, 255, 255, 0.14); }
.cd-chip { font-size: 9px; font-weight: 700; }
.cd-ignored { opacity: 0.5; }
.cd-timer { fill: #2ecf7c; transform-origin: 0 50%; }

.cd-t1 { animation-name: cd-t1; }
.cd-t2 { animation-name: cd-t2; }
.dg.cd .cd-timer { animation-timing-function: linear; }
.cd-m1 { animation-name: cd-m1; }
.cd-m2 { animation-name: cd-m2; }
.cd-m3 { animation-name: cd-m3; }
.cd-m4 { animation-name: cd-m4; }
.cd-v1 { animation-name: cd-v1; transform-origin: center; }
.cd-v2 { animation-name: cd-v2; transform-origin: center; }
.cd-v3 { animation-name: cd-v3; transform-origin: center; }
.cd-v4 { animation-name: cd-v4; transform-origin: center; }

/* Six-second timers: olticul's from 0.6s, Rileyjo7's from 2.6s */
@keyframes cd-t1 {
  0%, 5.5% { transform: scaleX(1); opacity: 0; }
  6% { transform: scaleX(1); opacity: 1; }
  66% { transform: scaleX(0); opacity: 1; }
  67%, 100% { transform: scaleX(0); opacity: 0; }
}
@keyframes cd-t2 {
  0%, 25.5% { transform: scaleX(1); opacity: 0; }
  26% { transform: scaleX(1); opacity: 1; }
  86% { transform: scaleX(0); opacity: 1; }
  87%, 100% { transform: scaleX(0); opacity: 0; }
}

/* The messages at 0.6s, 2.6s, 4.6s and 6.8s, each answered - or not - 0.4s on */
@keyframes cd-m1 { 0%, 5% { opacity: 0; transform: translateY(5px); } 7%, 94% { opacity: 1; transform: none; } 98%, 100% { opacity: 0; } }
@keyframes cd-m2 { 0%, 25% { opacity: 0; transform: translateY(5px); } 27%, 94% { opacity: 1; transform: none; } 98%, 100% { opacity: 0; } }
@keyframes cd-m3 { 0%, 45% { opacity: 0; transform: translateY(5px); } 47%, 94% { opacity: 1; transform: none; } 98%, 100% { opacity: 0; } }
@keyframes cd-m4 { 0%, 67% { opacity: 0; transform: translateY(5px); } 69%, 94% { opacity: 1; transform: none; } 98%, 100% { opacity: 0; } }
@keyframes cd-v1 { 0%, 10% { opacity: 0; transform: scale(0.8); animation-timing-function: cubic-bezier(0.2, 1.4, 0.4, 1); } 12.5%, 100% { opacity: 1; transform: none; } }
@keyframes cd-v2 { 0%, 30% { opacity: 0; transform: scale(0.8); animation-timing-function: cubic-bezier(0.2, 1.4, 0.4, 1); } 32.5%, 100% { opacity: 1; transform: none; } }
@keyframes cd-v3 { 0%, 50% { opacity: 0; transform: scale(0.8); animation-timing-function: cubic-bezier(0.2, 1.4, 0.4, 1); } 52.5%, 100% { opacity: 1; transform: none; } }
@keyframes cd-v4 { 0%, 72% { opacity: 0; transform: scale(0.8); animation-timing-function: cubic-bezier(0.2, 1.4, 0.4, 1); } 74.5%, 100% { opacity: 1; transform: none; } }
</style>
