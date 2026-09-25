# queueify-site

Documentation for [Queueify](https://github.com/conditionull/queueify), built with
[Docus](https://docus.dev) (Nuxt 4 + Nuxt Content + Nuxt UI 4).

```sh
npm install
npm run dev        # http://localhost:3100
npm run build      # production build, what Vercel runs
```

## Where things are

```
content/            the docs, one folder per sidebar section
  index.md          the landing page
  1.getting-started/
  2.obs/
  3.themes/
  4.commands/
  5.dashboard/
  6.reference/
public/img/         screenshots and the wordmark
public/videos/      the landing page clip (raw captures are gitignored)
app/
  app.config.ts     colors, logo, socials, GitHub links, and table of contents
  app.css           the brand green scale, arrow hover, the light/dark wipe
  components/content/   the landing page's pieces (QueueHero, ChatDemo, FeatureGrid, FeatureCard,
                        FeatureArt, EditorSpecs, ThemeRows, SplitBand, VideoLoop) and the docs'
                        animations (InstallTerminal, PresetsDiagram, FitDiagram,
                        SceneThemesDiagram, SnapDiagram, WaveformDiagram, CooldownDiagram)
  components/           CoverArt, a song's cover drawn inside any of the animations
  components/app/       AppHeaderCTA, the Docs button in the header
  composables/          useSvgPlayback: runs the animations only while they are on screen
  utils/songs.ts        the songs and chatters the animations use, so a track looks the same
                        everywhere it appears
  plugins/          runs the colour mode switch inside a view transition
nuxt.config.ts      extends the docus layer
```

Numbers in front of folders and files set the sidebar order and are stripped from the URL, so
`content/2.obs/1.browser-source.md` is served at `/obs/browser-source`. Each folder's title and
icon come from its `.navigation.yml`.

Search, the sidebar, the table of contents, dark mode, the sitemap, OG images, and `/llms.txt`
are all handled by Docus. Nothing to configure.

## Deploying on Vercel

1. **Add New → Project** and import this repo. Vercel detects Nuxt on its own — leave the build
   command, output directory and root directory alone
2. Add one environment variable: `NUXT_SITE_URL`, set to the deployed URL (e.g.
   `https://queueify.vercel.app`). Canonical links, the sitemap and OG images need it to be
   absolute
3. Deploy. Every push to `main` redeploys, and pull requests get preview URLs

Hobby is free and non-commercial, which this is.

## Placeholders to replace

The dashboard, admin panel, stats, and theme editor screenshots are real captures. To update
one, drop a new screenshot over the file at the same path and the site picks it up — no
markdown to edit.

`public/img/widget-demo.png` is an old placeholder nothing links to any more: the landing page
plays `public/videos/widget-demo.mp4` instead.

## Videos

`public/videos/` holds the landing page's two clips, the widget on stream and the theme editor.
The raw screen captures are gitignored (`public/videos/20*.mp4` and `widget_demo.mp4`); what
ships is the compressed version beside each one:

```sh
ffmpeg -i "<raw capture>.mp4" \
  -vf "scale='min(1600,iw)':-2:flags=lanczos,fps=30" \
  -c:v libx264 -crf 26 -preset slow -profile:v high -pix_fmt yuv420p \
  -movflags +faststart -an public/videos/theme-editor.mp4

ffmpeg -i public/videos/theme-editor.mp4 -vf "select=eq(n\,0)" -frames:v 1 -q:v 3 \
  public/videos/theme-editor-poster.jpg
```

That took the editor clip from 33MB to 2.9MB, and the widget clip from 62MB to 5MB. The poster frame is what shows before the video
plays, or if the browser refuses to autoplay it.

The logo and wordmark are placeholders too:

| File | What it is |
| --- | --- |
| `public/img/wordmark-dark.svg` | "queueify" in a green-to-white gradient, shown in dark mode |
| `public/img/wordmark-light.svg` | The same word, green fading to near-black, for light mode |
| `public/favicon.ico` | Still the Docus default |

There is no separate square mark: the wordmark is the logo.

`header.logo.light` and `header.logo.dark` in `app/app.config.ts` point at the same two files.
Both have to be set: with them empty, Docus renders the site title as plain text instead.

> Everything Nuxt reads lives under `app/`, because Nuxt 4 treats that folder as the source
> directory once it exists. An `app.config.ts` at the repo root is silently ignored.

## Things deliberately left off

- **The AI assistant** (`assistant` in `app/app.config.ts`) needs a paid API key, so the floating
  input and "Explain with AI" are switched off
- **FTS5 search** is off, so search uses the default in-browser Fuse.js index. Set
  `search: { fts: true }` in `app/app.config.ts` to switch
- **`github.url`** points at this repo, not the bot's, because it drives "Edit this page" and
  "Report an issue" in the page footer. The header icon, the social links and the issue links in
  the content all point at the bot's repo

## License

MIT.
