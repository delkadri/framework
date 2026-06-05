<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import RatingInput from '@/components/RatingInput.vue'
import StatusSelect from '@/components/StatusSelect.vue'
import { fetchGameDetail, fetchScreenshots, RawgMissingKeyError } from '@/services/rawg'
import { useLibraryStore } from '@/stores/library'
import type { GameStatus, RawgGameDetail, RawgScreenshot } from '@/types/game'
import { formatDate } from '@/utils/format'

const route = useRoute()
const library = useLibraryStore()
const game = ref<RawgGameDetail | null>(null)
const screenshots = ref<RawgScreenshot[]>([])
const loading = ref(false)
const error = ref('')
let controller: AbortController | undefined

const personal = computed(() => {
  const id = Number(route.params.id)
  return Number.isFinite(id) ? library.findById(id) : undefined
})

watch(() => route.params.id, loadGame, { immediate: true })
onBeforeUnmount(() => controller?.abort())

async function loadGame(): Promise<void> {
  const id = String(route.params.id)
  controller?.abort()
  controller = new AbortController()
  loading.value = true
  error.value = ''

  try {
    const [detail, shots] = await Promise.all([
      fetchGameDetail(id, controller.signal),
      fetchScreenshots(id, controller.signal),
    ])
    game.value = detail
    screenshots.value = shots.results.slice(0, 4)
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return
    error.value = err instanceof RawgMissingKeyError
      ? 'Cle RAWG manquante. Cree un fichier .env a partir de .env.example.'
      : 'Impossible de charger ce jeu.'
  } finally {
    loading.value = false
  }
}

function updateStatus(status: GameStatus): void {
  if (game.value && !personal.value) library.addGame(game.value)
  if (game.value) library.updateGame(game.value.id, { status })
}

function updateRating(userRating: number): void {
  if (game.value && !personal.value) library.addGame(game.value)
  if (game.value) library.updateGame(game.value.id, { userRating })
}

function updateNote(note: string): void {
  if (game.value && !personal.value) library.addGame(game.value)
  if (game.value) library.updateGame(game.value.id, { note })
}
</script>

<template>
  <p v-if="loading" class="muted">Chargement du jeu...</p>

  <EmptyState v-else-if="error">
    <h2>Detail indisponible</h2>
    <p>{{ error }}</p>
  </EmptyState>

  <article v-else-if="game" class="detail-layout">
    <section class="detail-hero">
      <img v-if="game.background_image" :src="game.background_image" :alt="game.name" />
      <div class="detail-copy">
        <p class="eyebrow">{{ formatDate(game.released) }}</p>
        <h1>{{ game.name }}</h1>
        <p class="lead">{{ game.description_raw || 'Aucune description fournie par RAWG.' }}</p>
        <div class="score-row wide">
          <span>RAWG {{ game.rating.toFixed(1) }}</span>
          <span v-if="game.metacritic">Metacritic {{ game.metacritic }}</span>
          <span>{{ game.playtime }}h moyenne</span>
        </div>
        <button v-if="!personal" type="button" class="primary" @click="library.addGame(game)">Ajouter a ma liste</button>
        <button v-else type="button" class="ghost" @click="library.removeGame(game.id)">Retirer de ma liste</button>
      </div>
    </section>

    <section class="detail-grid">
      <div class="panel">
        <h2>Infos</h2>
        <dl class="info-list">
          <dt>Genres</dt>
          <dd>{{ game.genres.map((genre) => genre.name).join(', ') || '-' }}</dd>
          <dt>Plateformes</dt>
          <dd>{{ game.platforms?.map(({ platform }) => platform.name).slice(0, 8).join(', ') || '-' }}</dd>
          <dt>Developpeurs</dt>
          <dd>{{ game.developers.map((studio) => studio.name).join(', ') || '-' }}</dd>
          <dt>Site</dt>
          <dd>
            <a v-if="game.website" :href="game.website" target="_blank" rel="noreferrer">{{ game.website }}</a>
            <span v-else>-</span>
          </dd>
        </dl>
      </div>

      <div class="panel personal-panel">
        <h2>Mon suivi</h2>
        <StatusSelect :model-value="personal?.status ?? 'todo'" @update:model-value="updateStatus" />
        <RatingInput :model-value="personal?.userRating ?? 0" @update:model-value="updateRating" />
        <label class="note-field">
          <span>Note</span>
          <textarea :value="personal?.note ?? ''" rows="5" placeholder="Pourquoi tu veux y jouer ?" @input="updateNote(($event.target as HTMLTextAreaElement).value)" />
        </label>
      </div>
    </section>

    <section v-if="screenshots.length" class="screenshots">
      <h2>Screenshots</h2>
      <div>
        <img v-for="shot in screenshots" :key="shot.id" :src="shot.image" alt="" loading="lazy" />
      </div>
    </section>
  </article>
</template>
