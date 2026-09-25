<script setup lang="ts">
// Docus leaves this slot of the header empty for a site to fill. A plain way
// into the docs from every page, the way Vite has "Guide" in its top bar -
// until now the only route in was the landing page's buttons or the search.
const route = useRoute()

// Any page but the landing page is already in the docs
const inDocs = computed(() => route.path !== '/')
</script>

<template>
  <UButton
    to="/getting-started/introduction"
    icon="i-lucide-book-open"
    label="Docs"
    color="neutral"
    variant="ghost"
    :active="inDocs"
    active-color="primary"
    active-variant="soft"
    class="hidden sm:inline-flex"
  />
</template>
