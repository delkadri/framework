import type { Directive } from 'vue'

export const focusDirective: Directive<HTMLElement, boolean | undefined> = {
  mounted(el, binding) {
    if (binding.value === false) return
    requestAnimationFrame(() => el.focus())
  },
}
