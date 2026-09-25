---
seo:
  title: A Twitch bot that queues Spotify tracks
  description: queueify lets your viewers request Spotify songs from Twitch chat or channel
    points, shows what is playing in an OBS overlay you design yourself, and runs entirely
    on your own machine.
---

::u-page-hero
---
class: qf-hero
orientation: horizontal
ui:
  container: py-16 sm:py-24 lg:py-28
  title: text-5xl sm:text-6xl lg:text-[3.5rem] font-bold tracking-tight text-balance
---
  :::queue-hero
  :::

#title
[Spotify song requests for Twitch]{.qf-headline}

#description
Viewers queue songs from chat or with channel points, and an OBS overlay you design yourself
shows what is playing. Free, MIT licensed, and it runs on your own machine.

#links
  :::u-button
  ---
  class: qf-cta-primary
  color: neutral
  size: xl
  to: /getting-started/installation
  trailing-icon: i-lucide-chevron-right
  ui:
    trailingIcon: size-5
  variant: outline
  ---
  Get started
  :::

  :::u-button
  ---
  color: neutral
  icon: i-simple-icons-github
  size: xl
  to: https://github.com/conditionull/queueify
  variant: outline
  target: _blank
  ---
  View on GitHub
  :::
::

::u-page-section
---
class: qf-band qf-band-flush
title: On stream
description: The widget over gameplay, running a theme someone built in the editor.
---
  :::div{.qf-bleed}
  ::video-loop{src="/videos/widget-demo.mp4" poster="/videos/widget-demo-poster.jpg"}
  ::
  :::
::

::u-page-section
---
class: qf-band
orientation: horizontal
title: How a request reaches the screen
description: Everything between the chat message and the overlay runs on your computer. queueify only talks to Twitch and Spotify.
features:
  - title: A viewer asks
    description: They type !q with a Spotify link, or redeem the channel point reward.
    icon: i-lucide-message-square
  - title: queueify checks it
    description: Cooldown, length, repeats, the deny list and the explicit filter, then a reply in chat either way.
    icon: i-lucide-list-checks
  - title: It plays, and the overlay shows it
    description: The song joins your Spotify queue, and when it comes up the OBS overlay changes over to it.
    icon: i-lucide-monitor-play
---
  :::chat-demo
  :::
::

::u-page-section
---
class: qf-band qf-band-flush
title: From chat to overlay
description: What queueify handles once it is running.
---
  :::feature-grid
    ::::feature-card{icon="i-lucide-list-music" label="Requests" art="requests" title="Chat and channel points" to="/commands/chat-commands"}
    `!q <spotify link>` for everyone, or a channel point reward on Affiliate and Partner
    channels. Cooldowns, repeat blocking, a maximum length, and an explicit filter decide what
    gets through.
    ::::

    ::::feature-card{icon="i-lucide-palette" label="Themes" art="themes" title="A visual theme editor" to="/themes/theme-editor"}
    Drag the album art, title, artist, progress bar, and song times around a canvas. 50 fonts,
    outlines, drop shadows, 2,000+ icons, and a waveform progress bar, saved as a real theme.
    ::::

    ::::feature-card{icon="i-lucide-monitor" label="OBS" art="obs" title="Sized and placed for you" to="/obs/browser-source"}
    Each theme renders at the size it was designed at, and the browser source is resized to fit
    the space you gave it. Mods can reposition the widget from chat with `!tr` and `!bc`.
    ::::

    ::::feature-card{icon="i-lucide-clapperboard" label="Canvas" art="canvas" title="Spotify Canvas videos" to="/themes/built-in-themes"}
    The looping clip Spotify ships with many tracks, playing in the widget where the album
    cover would be.
    ::::

    ::::feature-card{icon="i-lucide-bar-chart-3" label="Stats" art="stats" title="Every request, counted" to="/dashboard/stats"}
    Top requesters, songs, and artists, why requests were rejected, listening twins, and a row
    per stream. The record stays on your machine.
    ::::

    ::::feature-card{icon="i-lucide-refresh-cw" label="Live reload" art="reload" title="No restarts" to="/reference/files-and-data"}
    Credentials, settings, aliases, chat messages, and themes are re-read while the bot runs,
    and the dashboard stays open the whole time.
    ::::
  :::
::

::u-page-section
---
class: qf-band qf-band-flush
title: Design the widget yourself
description: The theme editor is a canvas, not a settings page. Drag every part where you want it, restyle it, and save it as a theme the widget uses immediately.
links:
  - label: What the editor does
    to: /themes/theme-editor
    color: neutral
    trailingIcon: i-lucide-arrow-right
---
::video-loop{src="/videos/theme-editor.mp4" poster="/videos/theme-editor-poster.jpg" caption="The theme editor, building a full-canvas theme"}
::

::editor-specs
::
::

::u-page-section
---
class: qf-band qf-band-flush
title: Built-in themes
description: Three themes ship with queueify and are read-only, so there is always a working fallback. Duplicate one in the editor to make your own.
---
::theme-rows
::
::

::u-page-section
---
class: qf-band qf-band-bare qf-band-end
---
  :::split-band
  ---
  left-title: Free and open source
  left-description: MIT licensed, with no paid tier and nothing gated. If it saved you some hassle you can buy me a coffee.
  right-title: Start taking requests
  right-description: You need Node 20 or newer, OBS, and Spotify Premium. Run these four lines and the dashboard walks you through the rest.
  ---
  #left
    ::::div{.qf-split-links}
      :::::u-button
      ---
      color: neutral
      icon: i-lucide-coffee
      to: https://buymeacoffee.com/bobabeans
      target: _blank
      ---
      Buy me a coffee
      :::::

      :::::u-button
      ---
      color: neutral
      icon: i-simple-icons-twitch
      to: https://www.twitch.tv/sadrobotsdontcry
      target: _blank
      variant: outline
      ---
      sadrobotsdontcry on Twitch
      :::::
    ::::

  #right
  ```sh
  git clone https://github.com/conditionull/queueify.git
  cd queueify
  npm install
  npm start
  ```

    ::::u-button
    ---
    class: btn-spotify
    size: lg
    to: /getting-started/installation
    trailing-icon: i-lucide-arrow-right
    ---
    Read the full setup
    ::::
  :::
::
