<template>
  <!-- gap-px over the border colour draws the dividers, so the rules stay
       correct at every breakpoint without nth-child arithmetic. It runs out to
       the band's side rails and sits on its bottom edge, so the cells share the
       frame's lines instead of floating inside it. -->
  <div class="qf-bleed grid gap-px border-t border-default bg-[var(--ui-border)] sm:grid-cols-2 lg:grid-cols-3">
    <slot />
  </div>
</template>
