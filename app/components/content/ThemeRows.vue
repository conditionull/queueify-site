<script setup lang="ts">
// The three built-in themes as rows of a table: the name and the chat command
// that switches to it on the left, the theme itself on the right.
const themes = [
  { name: 'swag', src: '/img/theme-swag.png', width: 680, height: 165 },
  { name: 'default', src: '/img/theme-default.png', width: 680, height: 192 },
  { name: 'minimal', src: '/img/theme-minimal.png', width: 400, height: 36 },
]
</script>

<template>
  <div class="qf-bleed grid gap-px border-t border-default bg-[var(--ui-border)]">
    <div
      v-for="theme in themes"
      :key="theme.name"
      class="grid gap-px bg-[var(--ui-border)] md:grid-cols-[14rem_1fr]"
    >
      <div class="flex flex-row items-baseline justify-between gap-2 bg-[var(--ui-bg)] px-6 py-5 sm:px-8 md:flex-col md:justify-center">
        <span class="text-lg font-semibold text-highlighted">{{ theme.name }}</span>
        <code class="text-sm text-muted">!theme {{ theme.name }}</code>
      </div>
      <div class="qf-theme-stage flex items-center justify-center px-6 py-8 sm:px-8">
        <img
          :src="theme.src"
          :alt="`The ${theme.name} theme`"
          :width="theme.width"
          :height="theme.height"
          loading="lazy"
          class="h-auto max-w-full rounded-xl"
        >
      </div>
    </div>
  </div>
</template>
