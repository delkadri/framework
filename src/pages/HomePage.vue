<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import GameCard from '@/components/GameCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { fetchGames, RawgMissingKeyError } from '@/services/rawg'
import { useLibraryStore } from '@/stores/library'
import type { RawgGameSummary } from '@/types/game'

const library = useLibraryStore()
const games = ref<RawgGameSummary[]>([])
const loading = ref(false)
const error = ref('')
const controller = new AbortController()

onMounted(loadHighlights)
onBeforeUnmount(() => controller.abort())

async function loadHighlights(): Promise<void> {
  loading.value = true
  error.value = ''

  try {
    const response = await fetchGames({ pageSize: 6, ordering: '-metacritic', signal: controller.signal })
    games.value = response.results
  } catch (err) {
    if (err instanceof RawgMissingKeyError) {
      error.value = 'Ajoute VITE_RAWG_API_KEY dans un fichier .env pour charger le catalogue RAWG.'
    } else if (!(err instanceof DOMException && err.name === 'AbortError')) {
      error.value = 'Impossible de charger les jeux du moment.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="hero-section">
    <div>
      <p class="eyebrow">Backlog personnel</p>
      <h1>Choisis tes prochains jeux sans perdre ta liste en route.</h1>
      <p class="lead">
        Explore RAWG, ajoute tes jeux, note-les, classe-les et suis tes statistiques sans compte serveur.
      </p>
      <div class="hero-actions">
        <RouterLink class="primary" to="/catalog">Explorer</RouterLink>
        <RouterLink class="ghost" to="/library">Ma liste</RouterLink>
      </div>
    </div>

    <aside class="summary-strip">
      <strong>{{ library.stats.total }}</strong>
      <span>jeux sauvegardes</span>
      <strong>{{ library.stats.averageRating || '-' }}</strong>
      <span>note moyenne</span>
      <strong>{{ library.stats.totalPlaytime }}h</strong>
      <span>temps moyen RAWG cumule</span>
    </aside>
  </section>

  <section class="section-header">
    <div>
      <p class="eyebrow">Selection</p>
      <h2>Jeux bien notes</h2>
    </div>
    <RouterLink class="text-link" to="/catalog">Voir le catalogue</RouterLink>
  </section>

  <p v-if="loading" class="muted">Chargement du catalogue...</p>
  <EmptyState v-else-if="error">
    <h2>Configuration requise</h2>
    <p>{{ error }}</p>
    <template #actions>
      <RouterLink class="primary" to="/catalog">Ouvrir le catalogue</RouterLink>
    </template>
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
</template>
