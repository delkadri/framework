<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, watch } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import GameCard from '@/components/GameCard.vue'
import SearchBox from '@/components/SearchBox.vue'
import { fetchGames, RawgMissingKeyError } from '@/services/rawg'
import { useLibraryStore } from '@/stores/library'
import type { CatalogFilters, RawgGameSummary } from '@/types/game'

const library = useLibraryStore()
const filters = reactive<CatalogFilters>({
  search: '',
  genre: '',
  platform: '',
  ordering: '-rating',
})
const debouncedSearch = ref('')
const games = ref<RawgGameSummary[]>([])
const loading = ref(false)
const error = ref('')
const page = ref(1)
const total = ref(0)
let timer: number | undefined
let controller: AbortController | undefined

watch(() => filters.search, (value) => {
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    debouncedSearch.value = value.trim()
    page.value = 1
  }, 450)
}, { immediate: true })

watch([
  debouncedSearch,
  () => filters.genre,
  () => filters.platform,
  () => filters.ordering,
], () => {
  page.value = 1
})

watch([
  debouncedSearch,
  () => filters.genre,
  () => filters.platform,
  () => filters.ordering,
  page,
], loadGames, { immediate: true })

onBeforeUnmount(() => {
  window.clearTimeout(timer)
  controller?.abort()
})

function updateFilters(next: CatalogFilters): void {
  Object.assign(filters, next)
}

async function loadGames(): Promise<void> {
  controller?.abort()
  controller = new AbortController()
  loading.value = true
  error.value = ''

  try {
    const response = await fetchGames({
      page: page.value,
      pageSize: 12,
      search: debouncedSearch.value,
      genre: filters.genre,
      platform: filters.platform,
      ordering: filters.ordering,
      signal: controller.signal,
    })
    games.value = response.results
    total.value = response.count
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return
    games.value = []
    total.value = 0
    error.value = err instanceof RawgMissingKeyError
      ? 'Cle RAWG manquante. Cree un fichier .env a partir de .env.example.'
      : 'La recherche a echoue. Reessaie dans quelques secondes.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="page-title">
    <p class="eyebrow">Catalogue RAWG</p>
    <h1>Explorer les jeux</h1>
    <p class="lead">Recherche temporisee, filtres et requetes annulables quand tu changes vite de critere.</p>
  </section>

  <section class="toolbar">
    <SearchBox v-model="filters.search" placeholder="Nom, serie, studio..." />
    <FilterPanel :filters="filters" @change="updateFilters" />
  </section>

  <div class="result-line">
    <span v-if="loading">Chargement...</span>
    <span v-else>{{ total.toLocaleString('fr-FR') }} resultat(s)</span>
  </div>

  <EmptyState v-if="error">
    <h2>Catalogue indisponible</h2>
    <p>{{ error }}</p>
  </EmptyState>

  <div v-else class="card-grid">
    <GameCard
      v-for="game in games"
      :key="game.id"
      :game="game"
      :saved="library.isSaved(game.id)"
      @add="library.addGame"
      @remove="library.removeGame"
    />
  </div>

  <div v-if="!error" class="pagination">
    <button type="button" class="ghost" :disabled="page === 1 || loading" @click="page -= 1">Precedent</button>
    <span>Page {{ page }}</span>
    <button type="button" class="ghost" :disabled="games.length < 12 || loading" @click="page += 1">Suivant</button>
  </div>
</template>
