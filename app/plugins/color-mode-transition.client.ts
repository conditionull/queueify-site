import { nextTick } from 'vue'

const DURATION = 700

// Nuxt UI's colour mode button flips the class on <html> directly, which the
// browser has nothing to animate. Intercepting the click and making the same
// change inside a view transition gives the wipe in app.css something to run on.
// Browsers without the View Transition API get the same diagonal by hand.
export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  const isColorModeToggle = (target: EventTarget | null) => {
    const el = target as Element | null
    const button = el?.closest?.('button[aria-label]')
    if (!button) return false
    return /switch to (light|dark)/i.test(button.getAttribute('aria-label') || '')
  }

  const fallbackWipe = async (apply: () => Promise<void>) => {
    const root = document.documentElement
    const oldBackground = getComputedStyle(root).getPropertyValue('--ui-bg').trim()
      || getComputedStyle(document.body).backgroundColor

    const overlay = document.createElement('div')
    overlay.className = 'qf-wipe'
    overlay.style.background = oldBackground
    document.body.appendChild(overlay)

    // The page underneath is already on the new scheme; sliding the overlay off
    // to the right is what uncovers it.
    await apply()

    const animation = overlay.animate(
      [{ transform: 'skewX(-12deg) translateX(0)' }, { transform: 'skewX(-12deg) translateX(160vw)' }],
      { duration: DURATION, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
    )

    try {
      await animation.finished
    }
    finally {
      overlay.remove()
    }
  }

  document.addEventListener('click', (event) => {
    if (!isColorModeToggle(event.target)) return

    event.preventDefault()
    event.stopImmediatePropagation()

    const next = colorMode.value === 'dark' ? 'light' : 'dark'
    const apply = async () => {
      colorMode.preference = next
      await nextTick()
    }

    if (typeof document.startViewTransition === 'function') {
      document.startViewTransition(apply)
      return
    }

    void fallbackWipe(apply)
  }, true)
})
