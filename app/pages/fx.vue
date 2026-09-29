<script setup lang="ts">
/*
 * The page a viewer lands on from `!fx` in chat: a widget playing a song,
 * with every effect to try on it. Picking one plays it, and the bar at the
 * bottom copies the command that sets it, to paste back into chat.
 *
 * The bot builds the link, telling the page what to show in the query:
 *   c      the command, as that channel types it (it may be renamed)
 *   a      the sub tier each effect in ORDER needs - 1 every sub, 2 Tier 2 and
 *          up, 3 Tier 3 only, 0 nobody - packed three to a character (see
 *          accessCode in the bot's services/perks.js). Effects past its end
 *          are ones that bot has not got, so they stay hidden
 *   allow  (older form) the effects every sub may pick, by name, with
 *   t2     the ones that need a Tier 2 sub, and t3 the ones for Tier 3
 * With none of them, every effect shows, open to every sub.
 *
 * The effects are drawn by public/fx/effects.js, a copy of the bot's
 * widget/public/effects.js, so what plays here is exactly what plays on
 * stream. Copy it over again whenever the bot's file changes.
 */

definePageMeta({ header: false, footer: false, layout: false })

useSeoMeta({
  title: 'Song effects',
  description: 'Pick the effect your song request starts with on stream, then paste the command in chat.',
})

useHead({
  script: [{ src: '/fx/effects.js', defer: true }],
  meta: [{ name: 'theme-color', content: '#0b0d10' }],
})

// Every effect, in the order of EFFECTS in the bot's services/perks.js. That
// order only ever grows at the end, and `a` in a link goes along it: a bot
// that knows 48 effects sends 48, and one added after them stays hidden from
// its viewers. Add a new effect to the end of this, and to its group.
const ORDER = [
  'sparkles', 'stars', 'confetti', 'hearts', 'notes', 'fireworks', 'pixels', 'coins', 'embers', 'bubbles', 'petals',
  'scatter', 'wave', 'jelly', 'glitch', 'heartbeat', 'spotlight',
  'comet', 'neon', 'warp', 'aurora', 'scanline', 'lightning', 'supernova', 'vortex',
  'bokeh', 'glimmer', 'fairy', 'mist', 'shine', 'flare', 'halo', 'glitter', 'wisps', 'love', 'starfall', 'fountain', 'bloom',
  'ripple', 'rune', 'blaze', 'meteors', 'swirl', 'portal', 'poof', 'crackle', 'slash', 'impact',
]

// What `a` is written in: the same as CODE in services/perks.js.
const CODE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

// The same effects, in the same groups, as effects.js and services/perks.js.
const GROUPS = [
  { name: 'burst', label: 'Bursts', effects: ['sparkles', 'stars', 'confetti', 'hearts', 'notes', 'fireworks', 'pixels', 'coins', 'embers', 'bubbles', 'petals'] },
  { name: 'widget', label: 'The widget itself', effects: ['scatter', 'wave', 'jelly', 'glitch', 'heartbeat', 'spotlight'] },
  { name: 'light', label: 'Light shows', effects: ['comet', 'neon', 'warp', 'aurora', 'scanline', 'lightning', 'supernova', 'vortex'] },
  { name: 'glow', label: 'Glow', effects: ['bokeh', 'glimmer', 'fairy', 'mist', 'shine', 'flare', 'halo', 'glitter', 'wisps', 'love', 'starfall', 'fountain', 'bloom'] },
  { name: 'magic', label: 'Magic', effects: ['ripple', 'rune', 'blaze', 'meteors', 'swirl', 'portal', 'poof', 'crackle', 'slash', 'impact'] },
]
const LABELS: Record<string, string> = {
  sparkles: 'Sparkles', stars: 'Stars', confetti: 'Confetti', hearts: 'Hearts', notes: 'Notes', fireworks: 'Fireworks',
  pixels: 'Pixels', coins: 'Coins', embers: 'Embers', bubbles: 'Bubbles', petals: 'Petals', scatter: 'Scatter', wave: 'Wave',
  jelly: 'Jelly', glitch: 'Glitch', heartbeat: 'Heartbeat', spotlight: 'Spotlight', comet: 'Comet', neon: 'Neon trace',
  warp: 'Warp', aurora: 'Aurora', scanline: 'Scanline', lightning: 'Lightning', supernova: 'Supernova', vortex: 'Vortex',
  bokeh: 'Bokeh', glimmer: 'Glimmer', fairy: 'Fairy dust', mist: 'Mist', shine: 'Shine', flare: 'Lens flare', halo: 'Halo', glitter: 'Glitter', wisps: 'Wisps', love: 'Love', starfall: 'Starfall', fountain: 'Fountain', bloom: 'Bloom', ripple: 'Ripple', rune: 'Rune', blaze: 'Blaze', meteors: 'Meteors', swirl: 'Swirl', portal: 'Portal', poof: 'Poof', crackle: 'Crackle', slash: 'Slash', impact: 'Impact',
}

const PALETTES = [
  { name: 'album', label: 'Album', swatch: 'conic-gradient(from 200deg, #1da9c6, #98e6fa, #345555, #1da9c6)' },
  { name: 'rainbow', label: 'Rainbow', swatch: 'conic-gradient(#ff4d4d, #ffd43b, #51cf66, #339af0, #cc5de8, #ff4d4d)' },
  { name: 'gold', label: 'Gold', swatch: 'linear-gradient(135deg, #fff3c4, #ffd24a, #f0a000)' },
  { name: 'silver', label: 'Silver', swatch: 'linear-gradient(135deg, #ffffff, #dfe6f2, #9fb0c8)' },
  { name: 'ice', label: 'Ice', swatch: 'linear-gradient(135deg, #e6fcff, #7fe7ff, #3a9dff)' },
  { name: 'fire', label: 'Fire', swatch: 'linear-gradient(135deg, #fff2a8, #ffa200, #ff4a1c)' },
  { name: 'candy', label: 'Candy', swatch: 'linear-gradient(135deg, #ffd1ec, #ff7ac6, #a98bff)' },
  { name: 'neon', label: 'Neon', swatch: 'linear-gradient(135deg, #2dff9a, #00d9ff, #ff3df2)' },
  { name: 'sunset', label: 'Sunset', swatch: 'linear-gradient(135deg, #ffe29a, #ff8a5c, #ff4f8b)' },
]

// The song on the sample widget, with the colors the widget takes from its cover.
const SONG = {
  title: 'A Beautiful Word',
  artist: 'Evan Call',
  cover: 'https://i.scdn.co/image/ab67616d0000b273ad53f15ea633847a2ec46313',
  colors: { vibrant: '#1da9c6', light: '#98e6fa', dark: '#345555' },
}

const route = useRoute()

// Only a name chat could actually type, so nothing odd lands on the clipboard.
const command = computed(() => {
  const typed = String(route.query.c || '').trim().replace(/^!/, '')
  return /^[a-z0-9_]{1,25}$/i.test(typed) ? typed.toLowerCase() : 'fx'
})

const listed = (key: string) => String(route.query[key] || '').split(',').map(name => name.trim().toLowerCase()).filter(Boolean)

// The sub tier each effect needs: 1 for every sub.
const needs = computed(() => {
  const tiers: Record<string, number> = {}
  const code = String(route.query.a || '')
  if (/^[A-Za-z0-9_-]+$/.test(code)) {
    ORDER.forEach((name, i) => {
      const packed = CODE.indexOf(code[Math.floor(i / 3)] ?? '')
      const tier = packed < 0 ? 0 : (packed >> (4 - (i % 3) * 2)) & 3
      if (tier) tiers[name] = tier
    })
  }
  for (const name of listed('allow')) tiers[name] = 1
  for (const name of listed('t2')) tiers[name] = 2
  for (const name of listed('t3')) tiers[name] = 3
  return tiers
})

// A link from the bot always says what is open, even when that is nothing.
// Only a bare /fx, with no channel behind it, shows everything.
const fromBot = ['a', 'allow', 't2', 't3'].some(key => key in route.query)

const groups = computed(() => {
  const open = Object.keys(needs.value)
  if (!open.length) return fromBot ? [] : GROUPS
  const shown = GROUPS
    .map(group => ({ ...group, effects: open.length ? group.effects.filter(name => open.includes(name)) : group.effects }))
    .filter(group => group.effects.length)
  return shown.length ? shown : GROUPS
})

const tierOf = (name: string) => needs.value[name] || 1

const selected = ref('')
const palette = ref('album')
const copied = ref(false)
const manual = ref(false)
const stage = ref<HTMLElement | null>(null)
const widget = ref<HTMLElement | null>(null)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const commandText = computed(() => {
  if (!selected.value) return ''
  return palette.value === 'album'
    ? `!${command.value} ${selected.value}`
    : `!${command.value} ${selected.value} ${palette.value}`
})

function whenLoaded(): Promise<any> {
  return new Promise((resolve) => {
    const check = () => ((window as any).QueueifyFx ? resolve((window as any).QueueifyFx) : setTimeout(check, 50))
    check()
  })
}

async function play() {
  const fx = await whenLoaded()
  if (!stage.value || !widget.value || !selected.value) return
  fx.stop()
  fx.play(selected.value, {
    host: stage.value,
    target: widget.value,
    colors: SONG.colors,
    power: 2,
    style: { colors: palette.value },
  })
}

function choose(name: string) {
  selected.value = name
  copied.value = false
  manual.value = false
  play()
}

function choosePalette(name: string) {
  palette.value = name
  copied.value = false
  play()
}

async function copy() {
  const text = commandText.value
  let ok = false
  try {
    await navigator.clipboard.writeText(text)
    ok = true
  }
  catch {
    // Older phones, or a browser that says no: the textarea way still works
    // in most of them.
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    try {
      ok = document.execCommand('copy')
    }
    catch {
      ok = false
    }
    area.remove()
  }

  clearTimeout(copiedTimer)
  copied.value = ok
  // Copying is out of our hands; show it to copy by hand.
  manual.value = !ok
  if (ok) copiedTimer = setTimeout(() => (copied.value = false), 3500)
}

// Something plays straight away, so the page shows what it is for.
onMounted(() => {
  selected.value = groups.value[0]?.effects[0] || ''
  setTimeout(play, 500)
})
</script>

<template>
  <div class="fx">
    <header class="fx-head">
      <p class="fx-eyebrow">
        Song effects
      </p>
      <h1>Pick how your song starts</h1>
      <p class="fx-lede">
        Subs get an effect when their requested song comes on stream. Tap one to watch it.
      </p>
    </header>

    <section
      ref="stage"
      class="fx-stage"
      aria-label="A widget showing the effect"
    >
      <div
        ref="widget"
        class="fx-widget"
      >
        <img
          class="fx-cover"
          :src="SONG.cover"
          alt=""
        >
        <div class="fx-title title-wrapper">
          {{ SONG.title }}
        </div>
        <div class="fx-artist">
          {{ SONG.artist }}
        </div>
        <div class="fx-bar">
          <i />
        </div>
        <div class="fx-times">
          <span>1:36</span><span>3:38</span>
        </div>
      </div>
    </section>

    <p
      v-if="!groups.length"
      class="fx-closed"
    >
      This channel has not opened any effects for subs yet.
    </p>

    <div
      v-if="groups.length"
      class="fx-now"
    >
      <span>{{ selected ? LABELS[selected] : '' }}</span>
      <button
        type="button"
        class="fx-replay"
        @click="play"
      >
        Play again
      </button>
    </div>

    <section
      v-if="groups.length"
      class="fx-section"
      aria-label="Colors"
    >
      <h2>Colors</h2>
      <div class="fx-swatches">
        <button
          v-for="choice in PALETTES"
          :key="choice.name"
          type="button"
          class="fx-swatch"
          :class="{ 'is-on': palette === choice.name }"
          :aria-pressed="palette === choice.name"
          @click="choosePalette(choice.name)"
        >
          <span
            class="fx-dot"
            :style="{ background: choice.swatch }"
          />
          {{ choice.label }}
        </button>
      </div>
    </section>

    <section
      v-for="group in groups"
      :key="group.name"
      class="fx-section"
      :aria-label="group.label"
    >
      <h2>{{ group.label }}</h2>
      <div class="fx-chips">
        <button
          v-for="name in group.effects"
          :key="name"
          type="button"
          class="fx-chip"
          :class="{ 'is-on': selected === name }"
          :aria-pressed="selected === name"
          @click="choose(name)"
        >
          {{ LABELS[name] }}
          <span
            v-if="tierOf(name) > 1"
            class="fx-tier"
          >Tier {{ tierOf(name) }}</span>
        </button>
      </div>
    </section>

    <p
      v-if="groups.length"
      class="fx-foot"
    >
      It plays on every song you request from then on. Picking one is a sub perk.
      <code>!{{ command }} off</code> goes back to the default.
    </p>
    <p class="fx-credit">
      <a
        href="/"
        target="_blank"
        rel="noopener"
      >Made with queueify</a>
      · Glow and Magic textures by
      <a
        href="https://kenney.nl/assets/particle-pack"
        target="_blank"
        rel="noopener"
      >Kenney Vleugels</a>
    </p>

    <div
      v-if="groups.length"
      class="fx-bar-bottom"
    >
      <div class="fx-bar-inner">
        <div
          v-if="manual"
          class="fx-manual"
        >
          <span>Copy this and send it in chat:</span>
          <input
            :value="commandText"
            readonly
            @focus="($event.target as HTMLInputElement).select()"
          >
        </div>
        <template v-else>
          <span class="fx-command-wrap">
            <code class="fx-command">{{ commandText }}</code>
            <span
              v-if="selected && tierOf(selected) > 1"
              class="fx-needs"
            >Needs a Tier {{ tierOf(selected) }} sub{{ tierOf(selected) === 2 ? ' or higher' : '' }}</span>
          </span>
          <button
            type="button"
            class="fx-copy"
            :class="{ 'is-done': copied }"
            :disabled="!selected"
            @click="copy"
          >
            {{ copied ? 'Copied - paste it in chat' : 'Copy' }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fx {
  --bg: #0b0d10;
  --card: #14171c;
  --line: rgba(255, 255, 255, .08);
  --text: #f3f4f6;
  --muted: #9ca3af;
  --green: #1db954;
  min-height: 100dvh;
  box-sizing: border-box;
  padding: max(24px, env(safe-area-inset-top)) 16px 132px;
  background:
    radial-gradient(90% 50% at 50% -5%, rgba(29, 169, 198, .18), transparent 60%),
    var(--bg);
  color: var(--text);
  font-family: var(--font-sans, system-ui, sans-serif);
}
.fx > * { max-width: 640px; margin-inline: auto; }

.fx-eyebrow { margin: 0 0 6px; color: var(--green); font-size: 13px; font-weight: 600; }
.fx-head h1 { margin: 0; font-size: clamp(26px, 7vw, 36px); line-height: 1.1; font-weight: 650; letter-spacing: -.02em; }
.fx-lede { margin: 10px 0 0; color: var(--muted); font-size: 15.5px; line-height: 1.5; }

/* The sample widget: a real one's parts, so the effects that move them have
   something to move. */
.fx-stage { position: relative; width: 100%; margin-top: 22px; aspect-ratio: 680 / 210; min-height: 124px; }
.fx-widget {
  position: absolute; inset: 0; box-sizing: border-box;
  /* minmax(0, 1fr): a long title is cut short, never widens the page. */
  display: grid; grid-template-columns: auto minmax(0, 1fr); grid-template-rows: 1fr auto auto auto 1fr;
  column-gap: clamp(12px, 4%, 22px); padding: clamp(10px, 3.2%, 18px);
  border-radius: clamp(14px, 4%, 22px); overflow: hidden;
  background: linear-gradient(120deg, #2c4a4b, #16252a 60%, #0f191c);
  box-shadow: 0 18px 50px rgba(0, 0, 0, .45), inset 0 0 0 1px rgba(255, 255, 255, .06);
}
.fx-cover {
  grid-row: 1 / -1; height: 100%; aspect-ratio: 1; object-fit: cover; border-radius: clamp(8px, 2.6%, 14px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, .4);
}
.fx-title { grid-column: 2; grid-row: 2; font-size: clamp(15px, 4.4vw, 24px); font-weight: 700; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fx-artist { grid-column: 2; grid-row: 3; margin-top: 2px; font-size: clamp(12px, 3.2vw, 15px); color: #98e6fa; }
.fx-bar { grid-column: 2; grid-row: 4; margin-top: clamp(8px, 2.4vw, 14px); height: 5px; border-radius: 3px; background: rgba(255, 255, 255, .14); overflow: hidden; }
.fx-bar i { display: block; width: 44%; height: 100%; border-radius: inherit; background: #1da9c6; }
.fx-times { grid-column: 2; grid-row: 5; align-self: start; display: flex; justify-content: space-between; margin-top: 4px; font-size: 11px; color: rgba(255, 255, 255, .55); font-variant-numeric: tabular-nums; }

.fx-now { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; font-size: 14px; font-weight: 600; }
.fx-replay {
  padding: 6px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--card);
  color: var(--muted); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
}
.fx-replay:hover { color: var(--text); }

.fx-section { margin-top: 22px; }
.fx-section h2 { margin: 0 0 10px; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }

.fx-swatches { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-inline: -16px; padding-inline: 16px; scrollbar-width: none; }
.fx-swatches::-webkit-scrollbar { display: none; }
/* A row you swipe on a phone; with room to spare, they all just show. */
@media (min-width: 700px) {
  .fx-swatches { flex-wrap: wrap; overflow: visible; margin-inline: 0; padding-inline: 0; }
}
.fx-swatch {
  flex: none; display: inline-flex; align-items: center; gap: 7px; padding: 7px 13px 7px 8px;
  border: 1px solid var(--line); border-radius: 999px; background: var(--card);
  color: var(--text); font: inherit; font-size: 13.5px; cursor: pointer; -webkit-tap-highlight-color: transparent;
}
.fx-swatch.is-on { border-color: var(--green); background: color-mix(in srgb, var(--green) 14%, var(--card)); }
.fx-dot { width: 18px; height: 18px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .25); }

.fx-chips { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 8px; }
@media (max-width: 359px) { .fx-chips { grid-template-columns: 1fr 1fr; } }
.fx-chip {
  min-height: 44px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 12px;
  background: var(--card); color: var(--text); font: inherit; font-size: 14.5px; font-weight: 500; text-align: left;
  cursor: pointer; transition: border-color .15s, background .15s, transform .15s; -webkit-tap-highlight-color: transparent;
}
.fx-chip:hover { border-color: rgba(255, 255, 255, .2); }
/* Scrolled to, a chip stops clear of the copy bar rather than under it. */
.fx-chip, .fx-swatch, .fx-foot, .fx-credit { scroll-margin-bottom: 120px; }
.fx-chip:active { transform: scale(.97); }
.fx-chip.is-on { border-color: var(--green); background: color-mix(in srgb, var(--green) 16%, var(--card)); box-shadow: 0 0 0 1px var(--green) inset; }
.fx-chip:focus-visible, .fx-swatch:focus-visible, .fx-copy:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }

.fx-foot { margin-top: 26px; color: var(--muted); font-size: 13.5px; line-height: 1.6; }
.fx-foot code { padding: 2px 6px; border-radius: 5px; background: rgba(255, 255, 255, .07); color: #e5e7eb; }
.fx-credit { margin-top: 14px; font-size: 13px; color: var(--muted); }
.fx-closed { margin: 18px 0 0; font-size: 15px; color: var(--muted); }
.fx-credit a { color: var(--muted); text-decoration: none; }
.fx-credit a:hover { color: var(--green); }

/* Pinned to the bottom, so the command is one tap away wherever you are. */
.fx-bar-bottom {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 20; max-width: none;
  padding: 12px 16px max(12px, env(safe-area-inset-bottom));
  background: linear-gradient(to top, var(--bg) 70%, rgba(11, 13, 16, 0));
}
.fx-bar-inner {
  display: flex; align-items: center; gap: 10px; max-width: 640px; margin: 0 auto; padding: 8px 8px 8px 14px;
  border: 1px solid var(--line); border-radius: 16px; background: #171b21; box-shadow: 0 14px 40px rgba(0, 0, 0, .5);
}
.fx-command-wrap { flex: 1; min-width: 0; display: grid; gap: 2px; }
.fx-command { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 15px; color: #e5e7eb; }
.fx-needs { font-size: 12px; color: #fbbf24; }
.fx-tier {
  display: inline-block; margin-left: 6px; padding: 1px 6px; border-radius: 999px; vertical-align: 1px;
  background: rgba(251, 191, 36, .14); color: #fbbf24; font-size: 11px; font-weight: 600;
}
.fx-copy {
  flex: none; min-height: 44px; padding: 0 18px; border: 0; border-radius: 12px;
  background: var(--green); color: #04130a; font: inherit; font-size: 15px; font-weight: 700; cursor: pointer;
}
.fx-copy.is-done { background: #e5e7eb; color: #0b0d10; }
.fx-copy:disabled { opacity: .5; cursor: default; }
.fx-manual { display: grid; gap: 6px; width: 100%; font-size: 13px; color: var(--muted); }
.fx-manual input {
  padding: 10px 12px; border: 1px solid #374151; border-radius: 10px; background: #0f1216;
  font: 600 16px var(--font-mono, ui-monospace, monospace); color: #fff;
}
</style>
