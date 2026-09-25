<script setup lang="ts">
defineProps<{
  icon: string
  label?: string
  title: string
  to?: string
  cta?: string
  // A FeatureArt picture to run along the bottom of the card, in place of the icon
  art?: 'requests' | 'themes' | 'obs' | 'canvas' | 'stats' | 'reload'
}>()
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="group flex flex-col gap-3 bg-[var(--ui-bg)] p-6 transition-colors sm:p-8 hover:bg-[var(--ui-bg-elevated)]"
  >
    <span v-if="!art" class="qf-tile">
      <UIcon :name="icon" class="size-5" />
    </span>

    <!-- With a picture below, the way into the docs sits up by the label -->
    <span v-if="label || art" class="flex items-center justify-between gap-3">
      <span v-if="label" class="qf-chip">{{ label }}</span>
      <span v-if="art" class="qf-cta">
        <span class="qf-cta-label">{{ cta || 'Read the docs' }}</span>
        <span class="qf-cta-icon">
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </span>
      </span>
    </span>

    <h3 class="text-lg font-semibold text-highlighted">{{ title }}</h3>

    <p class="text-sm leading-relaxed text-muted">
      <slot />
    </p>

    <span v-if="art" class="qf-art">
      <FeatureArt :name="art" />
    </span>
    <span v-else class="mt-auto pt-5">
      <span class="qf-cta">
        <span class="qf-cta-label">{{ cta || 'Read the docs' }}</span>
        <span class="qf-cta-icon">
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </span>
      </span>
    </span>
  </NuxtLink>

  <div
    v-else
    class="group flex flex-col gap-3 bg-[var(--ui-bg)] p-6 sm:p-8"
  >
    <span v-if="!art" class="qf-tile">
      <UIcon :name="icon" class="size-5" />
    </span>

    <span v-if="label" class="qf-chip">{{ label }}</span>

    <h3 class="text-lg font-semibold text-highlighted">{{ title }}</h3>

    <p class="text-sm leading-relaxed text-muted">
      <slot />
    </p>

    <span v-if="art" class="qf-art">
      <FeatureArt :name="art" />
    </span>
  </div>
</template>
