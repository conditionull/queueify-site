import type { Ref } from 'vue'

// Animations only run while someone can see them. This watches `root` and
// reports `playing` - on screen, in a visible tab - for components to drive
// their CSS animations from, and pauses and resumes any SMIL animations in
// the <svg> elements inside it to match.
export function useSvgPlayback(root: Ref<Element | null>) {
  const playing = ref(false)
  let cleanup: (() => void) | undefined

  onMounted(() => {
    const el = root.value
    if (!el) return

    const svgs = el instanceof SVGSVGElement ? [el] : Array.from(el.querySelectorAll('svg'))

    let visible = false
    const sync = () => {
      playing.value = visible && !document.hidden
      for (const svg of svgs) {
        if (playing.value) svg.unpauseAnimations()
        else svg.pauseAnimations()
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
      sync()
    }, { threshold: 0.15 })
    observer.observe(el)
    document.addEventListener('visibilitychange', sync)

    cleanup = () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  })

  onBeforeUnmount(() => cleanup?.())

  return { playing }
}

// SMIL wants key times as fractions of the loop. These take seconds, which is
// how the timelines are written, and turn them into that.
export function smilTimeline(loopSeconds: number) {
  const at = (s: number) => +(s / loopSeconds).toFixed(4)

  return {
    dur: `${loopSeconds}s`,
    // Invisible, fading in over [inFrom, inTo], out over [outFrom, outTo]
    fade: (inFrom: number, inTo: number, outFrom: number, outTo: number) => ({
      values: '0;0;1;1;0;0',
      keyTimes: [0, inFrom, inTo, outFrom, outTo, loopSeconds].map(at).join(';'),
    }),
    // Along a path, leaving at `from` and arriving at `to`, eased in between
    travel: (from: number, to: number) => ({
      keyPoints: '0;0;1;1',
      keyTimes: [0, from, to, loopSeconds].map(at).join(';'),
      keySplines: '0 0 1 1;0.45 0 0.2 1;0 0 1 1',
    }),
    // Any other value track: `stops` are [seconds, value] pairs
    track: (stops: [number, string | number][]) => ({
      values: stops.map(([, v]) => v).join(';'),
      keyTimes: stops.map(([s]) => at(s)).join(';'),
    }),
  }
}
