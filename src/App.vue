<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useLibraryStore } from '@/stores/library'
import { useThemeStore } from '@/stores/theme'

const library = useLibraryStore()
const theme = useThemeStore()
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="GameShelf accueil">
        <span class="brand-mark">GS</span>
        <span>GameShelf</span>
      </RouterLink>

      <nav class="main-nav" aria-label="Navigation principale">
        <RouterLink to="/catalog">Catalogue</RouterLink>
        <RouterLink to="/library">Ma liste</RouterLink>
        <RouterLink :to="{ name: 'stats' }" :class="{ disabled: !library.hasItems }">Stats</RouterLink>
      </nav>

      <button class="icon-button" type="button" :aria-label="theme.isDark ? 'Mode clair' : 'Mode sombre'" @click="theme.toggleTheme">
        {{ theme.isDark ? '☀' : '☾' }}
      </button>
    </header>

    <main>
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <section :key="route.fullPath" class="page-frame">
            <component :is="Component" />
          </section>
        </Transition>
      </RouterView>
    </main>

    <footer class="site-footer">
      Donnees et images fournies par
      <a href="https://rawg.io/" target="_blank" rel="noreferrer">RAWG</a>.
    </footer>
  </div>
</template>
