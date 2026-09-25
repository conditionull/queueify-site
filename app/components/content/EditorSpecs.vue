<script setup lang="ts">
const stats = [
  { value: '4', label: 'starting layouts', hint: 'Classic, Spotlight, Ticker, and Stacked' },
  { value: '50', label: 'fonts', hint: 'plus UPPERCASE and italic' },
  { value: '2,000+', label: 'Lucide icons', hint: 'colour, weight, rotation, and opacity' },
  { value: '0', label: 'restarts', hint: 'saved themes load straight away' },
]

const pills = [
  'Gradients',
  'Outlines',
  'Drop shadows',
  'Colours from the album art',
  'Waveform progress bar',
  'Canvas blur and dim',
  'Snapping and guides',
  'Undo and revert',
  'Live preview of the real widget',
  'Export and import',
]
</script>

<template>
  <div>
    <ul class="flex flex-wrap gap-2">
      <li
        v-for="pill in pills"
        :key="pill"
        class="qf-pill"
      >
        {{ pill }}
      </li>
    </ul>

    <!-- The stats run rail to rail along the bottom of the band -->
    <dl class="qf-bleed mt-10 grid grid-cols-2 gap-px border-t border-default bg-[var(--ui-border)] lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-[var(--ui-bg)] px-6 py-7 sm:px-8"
      >
        <dt class="text-3xl font-semibold tracking-tight text-[var(--queueify-green)] tabular-nums">
          {{ stat.value }}
        </dt>
        <dd class="mt-1 text-sm font-medium text-highlighted">
          {{ stat.label }}
        </dd>
        <dd class="mt-1 text-xs leading-relaxed text-muted">
          {{ stat.hint }}
        </dd>
      </div>
    </dl>
  </div>
</template>
