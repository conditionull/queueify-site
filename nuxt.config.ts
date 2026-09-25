export default defineNuxtConfig({
  extends: ['docus'],

  site: {
    // The deployed URL comes from NUXT_SITE_URL (set it in Vercel), so canonical
    // links and OG images are absolute. Locally it falls back to localhost.
    name: 'Queueify',
  },

  // The Queueify bot's Express server already listens on 3000 and 3001.
  devServer: {
    port: 3100,
  },
})
