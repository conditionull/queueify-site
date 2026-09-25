<script setup lang="ts">
// A song's cover inside an animation's <svg>: sky, sun and hills in the
// song's colours, the same drawing at any size.
const props = defineProps<{
  cover: readonly [string, string, string]
  size: number
  x?: number
  y?: number
}>()

const id = useId()
</script>

<template>
  <g :transform="`translate(${props.x ?? 0} ${props.y ?? 0}) scale(${props.size / 64})`">
    <defs>
      <linearGradient :id="id" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" :stop-color="props.cover[0]" />
        <stop offset="0.58" :stop-color="props.cover[1]" />
        <stop offset="1" :stop-color="props.cover[2]" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="9" :fill="`url(#${id})`" />
    <circle cx="41" cy="23" r="8.5" fill="#fff" fill-opacity="0.82" />
    <path d="M0 47 q16 -9 32 -2 t32 -3 v13 a9 9 0 0 1 -9 9 h-46 a9 9 0 0 1 -9 -9 z" :fill="props.cover[2]" fill-opacity="0.85" />
    <rect width="64" height="64" rx="9" fill="none" stroke="#fff" stroke-opacity="0.14" vector-effect="non-scaling-stroke" />
  </g>
</template>
