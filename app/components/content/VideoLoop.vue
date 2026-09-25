<script setup lang="ts">
const props = defineProps<{
  src: string
  poster?: string
  caption?: string
}>()

const video = ref<HTMLVideoElement | null>(null)
const playing = ref(true)

// Autoplay is a courtesy, not a guarantee: a browser can refuse it, and then
// the poster frame and the play button are what show.
onMounted(() => {
  const el = video.value
  if (!el) return

  el.play().catch(() => {
    playing.value = false
  })
})

const toggle = () => {
  const el = video.value
  if (!el) return

  if (el.paused) {
    el.play().then(() => { playing.value = true }).catch(() => {})
  }
  else {
    el.pause()
    playing.value = false
  }
}
</script>

<template>
  <figure class="qf-video">
    <div class="qf-video-frame">
      <video
        ref="video"
        :src="props.src"
        :poster="props.poster"
        muted
        loop
        playsinline
        preload="metadata"
        class="qf-video-el"
        @click="toggle"
      />

      <button
        type="button"
        class="qf-video-toggle"
        :aria-label="playing ? 'Pause the video' : 'Play the video'"
        @click="toggle"
      >
        <UIcon :name="playing ? 'i-lucide-pause' : 'i-lucide-play'" class="size-4" />
      </button>
    </div>

    <figcaption v-if="props.caption" class="qf-video-caption">
      {{ props.caption }}
    </figcaption>
  </figure>
</template>
