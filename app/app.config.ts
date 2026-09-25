export default defineAppConfig({
  ui: {
    colors: {
      // 'spotify' is defined as a full 50-950 scale in app/app.css
      primary: 'spotify',
      neutral: 'zinc',
    },
    // The sticky header solid, with no backdrop blur. After the light/dark
    // wipe, Chrome on some GPUs dropped the blurred header's whole backdrop
    // layer and the page showed straight through it; without backdrop-filter
    // there is no such layer to lose.
    header: { slots: { root: 'bg-default backdrop-blur-none' } },
    // Headings one step lighter than Nuxt UI's bold: at display sizes the
    // bold reads heavy and clotted, semibold stays crisp
    pageHero: { slots: { title: 'font-semibold' } },
    pageSection: { slots: { title: 'font-semibold' } },
    pageHeader: { slots: { title: 'font-semibold' } },
    pageCta: { slots: { title: 'font-semibold' } },
    prose: {
      h1: { slots: { base: 'font-semibold' } },
      h2: { slots: { base: 'font-semibold' } },
      h3: { slots: { base: 'font-semibold' } },
      h4: { slots: { base: 'font-semibold' } },
    },
  },

  seo: {
    title: 'queueify',
    description: 'A Twitch bot that queues Spotify tracks, with an OBS overlay widget, a setup dashboard and a visual theme editor.',
    schema: {
      type: 'SoftwareApplication',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Windows, macOS, Linux',
      price: 0,
      sameAs: [
        'https://github.com/conditionull/queueify',
      ],
    },
  },

  header: {
    title: 'queueify',
    // There is no separate mark: the wordmark is the logo. The header draws it
    // as text (components/app/AppHeaderLogo.vue) so it stays sharp on phones;
    // these SVGs are what the logo's right-click menu copies and downloads.
    logo: {
      light: '/img/wordmark-light.svg',
      dark: '/img/wordmark-dark.svg',
      alt: 'queueify',
      wordmark: {
        light: '/img/wordmark-light.svg',
        dark: '/img/wordmark-dark.svg',
      },
      display: 'wordmark',
      class: 'h-7',
    },
  },

  socials: {
    github: 'https://github.com/conditionull/queueify',
    twitch: 'https://www.twitch.tv/sadrobotsdontcry',
    buymeacoffee: 'https://buymeacoffee.com/bobabeans',
  },

  toc: {
    title: 'On this page',
    bottom: {
      title: 'Elsewhere',
      links: [{
        icon: 'i-simple-icons-github',
        label: 'queueify on GitHub',
        to: 'https://github.com/conditionull/queueify',
        target: '_blank',
      }, {
        icon: 'i-lucide-scroll-text',
        label: 'Changelog',
        to: 'https://github.com/conditionull/queueify/blob/main/CHANGELOG.md',
        target: '_blank',
      }, {
        icon: 'i-lucide-bug',
        label: 'Report an issue',
        to: 'https://github.com/conditionull/queueify/issues/new',
        target: '_blank',
      }],
    },
  },

  // "Edit this page" and "Report an issue" in the page footer point here, so it
  // has to be the repo the docs live in, not the bot's repo.
  github: {
    url: 'https://github.com/conditionull/queueify-site',
    branch: 'main',
  },

  // The AI assistant is switched off in nuxt.config.ts; these keep its floating
  // input and "Explain with AI" off too, should it ever be turned back on.
  assistant: {
    floatingInput: false,
    explainWithAi: false,
  },
})
