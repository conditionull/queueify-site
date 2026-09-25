// The browser tab reads "queueify | docs" on the landing page and
// "<page> | queueify docs" everywhere else.
//
// Docus builds tab titles from one template string ("%s - Queueify"), which
// cannot give the landing page a title of its own, and changing the landing
// page's title instead would change its link previews too - they reuse it.
// A template function only touches the tab. It outranks Docus's string, which
// is set later, in app.vue.
export default defineNuxtPlugin(() => {
  const route = useRoute()

  useHead({
    titleTemplate: (title?: string) =>
      route.path === '/' || !title ? 'queueify | docs' : `${title} | queueify docs`,
  }, { tagPriority: 'high' })
})
