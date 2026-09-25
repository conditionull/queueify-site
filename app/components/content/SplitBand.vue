<script setup lang="ts">
// Two halves of one band with a rule between them, for the end of the landing
// page: what it costs on the left, how to start on the right.
defineProps<{
  leftTitle: string
  leftDescription?: string
  rightTitle: string
  rightDescription?: string
}>()
</script>

<template>
  <div class="qf-bleed grid gap-px bg-[var(--ui-border)] lg:grid-cols-2">
    <div class="qf-split-cell">
      <h2 class="qf-split-title">{{ leftTitle }}</h2>
      <p v-if="leftDescription" class="qf-split-description">{{ leftDescription }}</p>
      <div class="qf-split-body">
        <slot name="left" />
      </div>
    </div>

    <div class="qf-split-cell">
      <h2 class="qf-split-title">{{ rightTitle }}</h2>
      <p v-if="rightDescription" class="qf-split-description">{{ rightDescription }}</p>
      <div class="qf-split-body">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
