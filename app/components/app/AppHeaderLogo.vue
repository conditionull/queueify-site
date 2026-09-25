<script setup lang="ts">
// The header's wordmark, as live text rather than Docus's SVG image. The SVG
// sets "queueify" in whatever system font the device has, inside a fixed box,
// and iOS Safari rasterises an image like that on its own and scales it - the
// wordmark came out blurry on iPhones. Text is drawn at the screen's full
// resolution everywhere. The right-click menu Docus puts on its logo (copy it,
// download the brand assets) is kept.
const appConfig = useAppConfig()
const { contextMenuItems } = useLogoAssets()
</script>

<template>
  <UContextMenu :items="contextMenuItems">
    <span class="qf-wordmark">{{ appConfig.header?.title || 'queueify' }}</span>
  </UContextMenu>
</template>
