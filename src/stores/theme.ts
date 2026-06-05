import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'gameshelf.theme'

export const useThemeStore = defineStore('theme', () => {
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const mode = ref<ThemeMode>((localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? preferred)
  const isDark = computed(() => mode.value === 'dark')

  watch(mode, (value) => {
    document.documentElement.dataset.theme = value
    localStorage.setItem(STORAGE_KEY, value)
  }, { immediate: true })

  function toggleTheme(): void {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    mode,
    isDark,
    toggleTheme,
  }
})
