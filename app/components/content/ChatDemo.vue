<script setup lang="ts">
// The landing page hero: Twitch chat on the bottom, the widget above it, and a
// short script of requests playing through both. The replies are queueify's
// default chat messages (config/messages.json), minus the emotes.

interface Track {
  title: string
  artist: string
  // Stands in for the colour queueify samples from the album art
  accent: string
  // The cover, drawn as sky, sun and hills: light, mid and dark
  cover: [string, string, string]
}

interface Message {
  id: number
  user: string
  color: string
  text: string
  broadcaster?: boolean
  // Set on a channel point redemption: the reward's name
  reward?: string
}

const STREAMER = 'sadrobotsdontcry'
const STEP_MS = 1900

const tracks: Track[] = [
  { title: 'Happen Twice', artist: 'Mark Whalen', accent: '#b57bea', cover: ['#e2c8ff', '#9b5de5', '#2d1b4e'] },
  { title: 'Set Piece', artist: 'Vansire', accent: '#e8875a', cover: ['#f9c9a6', '#e8875a', '#4b2f78'] },
  { title: 'You Might Be Sleeping', artist: 'Jakob, Clairo', accent: '#c9dc4a', cover: ['#eef7b0', '#b6cc3c', '#34501c'] },
  { title: 'Bloodhounds', artist: 'Small Forward', accent: '#d2b77e', cover: ['#f3e6c4', '#cfae6c', '#4a3a22'] },
  { title: 'The Place', artist: 'Far Caspian', accent: '#ef9a86', cover: ['#ffd9cc', '#ec8f79', '#5a2e3a'] },
  { title: 'Mind Fields', artist: 'No Vacation', accent: '#f2a93b', cover: ['#ffe2a3', '#f2a93b', '#6b3a10'] },
]

// The chatters in the example, in the colours Twitch hands out
const viewers = [
  { user: 'olticul', color: '#ff7f50' },
  { user: 'Rileyjo7', color: '#5aa9ff' },
  { user: 'glorysynex', color: '#9acd32' },
  { user: 'OmniscientBot', color: '#ff69b4' },
  { user: 'uhRyvn', color: '#daa520' },
  { user: 'roquettm', color: '#b57bea' },
]

// Each pass of the script casts the next three viewers, so everyone gets a turn
const VIEWERS_PER_PASS = 3

// The order is shuffled on every page load, so a refresh opens on different
// names. The shuffle can only happen in the browser - the server-rendered page
// has to match it - so the chat starts empty and its opening lines arrive
// once the page is running, the way chat fills in when you open a stream.
let cast = viewers.slice()

const shuffle = <T>(items: T[]) => {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

// Chat already under way when the demo opens: the three viewers the first
// pass does not cast, then the queue opening
const openingChat = (): Message[] => [
  { id: -4, ...cast[3]!, text: 'hiii' },
  { id: -3, ...cast[4]!, text: 'love the overlay' },
  { id: -2, ...cast[5]!, text: 'this song is so good' },
  { id: -1, user: STREAMER, color: '#1db954', text: 'Song queue is now open!', broadcaster: true },
]

// One loop of the script. Every pass adds two songs and plays two, so the queue
// is back where it started and the loop can run forever without drifting.
type Step =
  | { kind: 'request', viewer: number }
  | { kind: 'redeem', viewer: number }
  | { kind: 'added' }
  | { kind: 'cooldown', viewer: number }
  | { kind: 'np', viewer: number }
  | { kind: 'current' }
  | { kind: 'advance' }

const script: Step[] = [
  { kind: 'request', viewer: 0 },
  { kind: 'added' },
  { kind: 'redeem', viewer: 1 },
  { kind: 'added' },
  { kind: 'cooldown', viewer: 0 },
  { kind: 'advance' },
  { kind: 'np', viewer: 2 },
  { kind: 'current' },
  { kind: 'advance' },
]

const nowPlaying = ref<Track>(tracks[tracks.length - 1]!)
const queue = ref<{ track: Track, by: string }[]>([])
const messages = ref<Message[]>([])
const progress = ref(0)
const progressMs = ref(0)

let nextTrack = 0
let messageId = 0
let lastRequester = ''
let stepIndex = 0
let pass = 0
let timer: ReturnType<typeof setTimeout> | undefined
let running = false

const say = (message: Omit<Message, 'id'>) => {
  messages.value = [...messages.value.slice(-5), { ...message, id: messageId++ }]
}

const reply = (text: string) => say({ user: STREAMER, color: '#1db954', text, broadcaster: true })

const viewer = (slot: number) => cast[(slot + pass * VIEWERS_PER_PASS) % cast.length]!

const trackUrl = () => `https://open.spotify.com/track/${['4uLU6h', '0VjIjW', '7qiZfU', '1rqqCS', '3n3Ppa', '6habFh'][nextTrack % 6]}…`

// How long until the next advance, so the progress bar fills exactly as the
// song changes over.
const msUntilAdvance = (from: number) => {
  for (let i = 1; i <= script.length; i++) {
    if (script[(from + i) % script.length]!.kind === 'advance') return i * STEP_MS
  }
  return STEP_MS
}

const startProgress = (from: number) => {
  progressMs.value = 0
  progress.value = 0
  // Two frames: one to paint the empty bar without a transition, one to start it
  requestAnimationFrame(() => requestAnimationFrame(() => {
    progressMs.value = msUntilAdvance(from)
    progress.value = 100
  }))
}

const run = (step: Step) => {
  switch (step.kind) {
    case 'request':
    case 'redeem': {
      const who = viewer(step.viewer)
      lastRequester = who.user
      // A redemption carries the link in the reward's text box, not a command
      say(step.kind === 'redeem'
        ? { ...who, text: trackUrl(), reward: 'Request a song' }
        : { ...who, text: `!q ${trackUrl()}` })
      break
    }
    case 'added': {
      queue.value = [...queue.value, { track: tracks[nextTrack % tracks.length]!, by: lastRequester }]
      nextTrack++
      reply(`@${lastRequester} song added to queue!! (${queue.value.length} in queue)`)
      break
    }
    case 'cooldown': {
      const who = viewer(step.viewer)
      say({ ...who, text: `!q ${trackUrl()}` })
      // Replies land a beat after the message, the way they do in real chat
      timer = setTimeout(() => {
        reply(`@${who.user} wait 41s before queueing again`)
        schedule()
      }, STEP_MS * 0.55)
      return true
    }
    case 'np': {
      say({ ...viewer(step.viewer), text: '!np' })
      break
    }
    case 'current': {
      reply(`Current song: ${nowPlaying.value.title} - ${nowPlaying.value.artist}`)
      break
    }
    case 'advance': {
      const next = queue.value[0]
      if (next) {
        nowPlaying.value = next.track
        queue.value = queue.value.slice(1)
      }
      startProgress(stepIndex)
      break
    }
  }
  return false
}

const schedule = () => {
  if (!running) return
  timer = setTimeout(tick, STEP_MS)
}

const tick = () => {
  const step = script[stepIndex]!
  const waitsOnItsOwn = run(step)
  stepIndex = (stepIndex + 1) % script.length
  if (stepIndex === 0) pass++
  if (!waitsOnItsOwn) schedule()
}

const start = () => {
  if (running) return
  running = true
  schedule()
}

const stop = () => {
  running = false
  clearTimeout(timer)
}

const root = ref<HTMLElement | null>(null)

// The script only runs while the demo is on screen and the tab is visible
onMounted(() => {
  cast = shuffle(viewers)
  messages.value = openingChat()

  startProgress(script.length - 1)

  let visible = false
  const sync = () => (visible && !document.hidden ? start() : stop())

  const observer = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    sync()
  })
  if (root.value) observer.observe(root.value)
  document.addEventListener('visibilitychange', sync)

  onBeforeUnmount(() => {
    stop()
    observer.disconnect()
    document.removeEventListener('visibilitychange', sync)
  })
})
</script>

<template>
  <div
    ref="root"
    class="qd"
    role="img"
    aria-label="An example stream: viewers request songs in Twitch chat with !q and a channel point reward, queueify replies in chat, and the overlay on the stream shows the song playing."
  >
    <div class="qd-stage" aria-hidden="true">
      <!-- The game behind the overlay -->
      <svg class="qd-scene" viewBox="0 0 520 240" preserveAspectRatio="xMidYMax slice">
        <circle cx="400" cy="62" r="20" fill="#f5d77a" fill-opacity="0.82" />
        <path d="M0 168 q90 -46 190 -18 t180 -16 t150 10 V240 H0 z" fill="#1d1a4f" />
        <path d="M0 198 q120 -26 250 -6 t270 -2 V240 H0 z" fill="#100e2e" />
      </svg>

      <span class="qd-live"><span class="qd-live-dot" />LIVE</span>
      <span class="qd-viewers"><UIcon name="i-lucide-user" class="size-3" />214</span>

      <div
        class="qd-widget"
        :style="{
          '--qd-accent': nowPlaying.accent,
          '--c1': nowPlaying.cover[0],
          '--c2': nowPlaying.cover[1],
          '--c3': nowPlaying.cover[2],
        }"
      >
        <Transition name="qd-swap" mode="out-in">
          <div :key="nowPlaying.title" class="qd-widget-inner">
            <div class="qd-art" />
            <div class="qd-meta">
              <p class="qd-title">{{ nowPlaying.title }}</p>
              <p class="qd-artist">{{ nowPlaying.artist }}</p>
              <div class="qd-bar">
                <div
                  class="qd-bar-fill"
                  :style="{ width: `${progress}%`, transitionDuration: `${progressMs}ms` }"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <div class="qd-chat" aria-hidden="true">
      <div class="qd-chat-head">
        <UIcon name="i-lucide-arrow-left-to-line" class="size-3.5" />
        <span>Stream chat</span>
        <UIcon name="i-lucide-users" class="size-3.5" />
      </div>
      <TransitionGroup name="qd-msg" tag="ul" class="qd-chat-body">
        <li
          v-for="message in messages"
          :key="message.id"
          class="qd-msg"
          :class="{ 'qd-msg-reward': message.reward }"
        >
          <span v-if="message.reward" class="qd-reward">
            <span class="qd-points-icon" />
            <span><b>{{ message.user }}</b> redeemed <b>{{ message.reward }}</b></span>
            <span class="qd-cost">500</span>
          </span>
          <span>
            <span v-if="message.broadcaster" class="qd-badge" title="Broadcaster">
              <UIcon name="i-lucide-video" class="size-2.5" />
            </span>
            <b :style="{ color: message.color }">{{ message.user }}</b>:
            <span class="qd-text">{{ message.text }}</span>
          </span>
        </li>
      </TransitionGroup>
      <div class="qd-input">
        <span class="qd-input-box">Send a message</span>
        <span class="qd-points"><span class="qd-points-icon" />2.4K</span>
        <span class="qd-send">Chat</span>
      </div>
    </div>
  </div>
</template>
