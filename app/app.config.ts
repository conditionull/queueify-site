export default defineAppConfig({
  ui: {
    colors: {
      // 'spotify' is defined as a full 50-950 scale in app/app.css
      primary: 'spotify',
      neutral: 'zinc',
    },
  },

  seo: {
    title: 'Queueify',
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
    title: 'Queueify',
    // There is no separate mark: the wordmark is the logo. `light` and `dark`
    // have to be set or Docus falls back to rendering the title as plain text.
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
        label: 'Queueify on GitHub',
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

  // The AI assistant needs a paid API key (Vercel AI Gateway or similar), so the
  // floating input and "Explain with AI" stay off.
  assistant: {
    floatingInput: false,
    explainWithAi: false,
  },
})
