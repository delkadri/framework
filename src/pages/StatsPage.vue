<script setup lang="ts">
import { computed } from 'vue'
import StatBars from '@/components/StatBars.vue'
import { useLibraryStore } from '@/stores/library'
import { statusLabels } from '@/types/game'

const library = useLibraryStore()

const statusBars = computed(() => {
  return Object.entries(library.stats.byStatus).map(([key, value]) => ({
    label: statusLabels[key as keyof typeof statusLabels],
    value,
  }))
})
</script>

<template>
  <section class="page-title">
    <p class="eyebrow">Synthese</p>
    <h1>Statistiques</h1>
    <p class="lead">Les indicateurs se recalculent automatiquement avec ta liste locale.</p>
  </section>

  <section class="kpi-grid">
    <article>
      <span>Total</span>
      <strong>{{ library.stats.total }}</strong>
    </article>
    <article>
      <span>Note moyenne</span>
      <strong>{{ library.stats.averageRating || '-' }}</strong>
    </article>
    <article>
      <span>Temps RAWG cumule</span>
      <strong>{{ library.stats.totalPlaytime }}h</strong>
    </article>
    <article>
      <span>Temps moyen</span>
      <strong>{{ library.stats.averagePlaytime }}h</strong>
    </article>
  </section>

  <section class="stats-grid">
    <StatBars title="Repartition par statut" :items="statusBars" />
    <StatBars title="Top genres" :items="library.stats.topGenres" />
  </section>

  <section class="stats-panel">
    <h2>Top notes personnelles</h2>
    <ol v-if="library.stats.topRated.length" class="ranked-list">
      <li v-for="game in library.stats.topRated" :key="game.id">
        <RouterLink :to="{ name: 'game-detail', params: { id: game.id } }">{{ game.name }}</RouterLink>
        <strong>{{ game.userRating }}/5</strong>
      </li>
    </ol>
    <p v-else class="muted">Note quelques jeux pour faire apparaitre ce classement.</p>
  </section>
</template>
