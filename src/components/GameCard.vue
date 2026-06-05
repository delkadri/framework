<script setup lang="ts">
import { computed } from 'vue'
import type { PersonalGame, RawgGameSummary } from '@/types/game'
import { formatDate } from '@/utils/format'

const props = defineProps<{
  game: RawgGameSummary | PersonalGame
  saved?: boolean
}>()

defineEmits<{
  add: [game: RawgGameSummary | PersonalGame]
  remove: [id: number]
}>()

const image = computed(() => 'background_image' in props.game ? props.game.background_image : props.game.image)
const genres = computed(() => {
  if ('background_image' in props.game) return props.game.genres.map((genre) => genre.name)
  return props.game.genres
})
const platforms = computed(() => {
  if ('background_image' in props.game) return props.game.platforms?.slice(0, 3).map(({ platform }) => platform.name) ?? []
  return props.game.platforms.slice(0, 3)
})
</script>

<template>
  <article class="game-card">
    <RouterLink class="cover-link" :to="{ name: 'game-detail', params: { id: game.id } }">
      <img v-if="image" class="cover" :src="image" :alt="game.name" loading="lazy" />
      <div v-else class="cover placeholder">{{ game.name.slice(0, 2).toUpperCase() }}</div>
    </RouterLink>

    <div class="game-card-body">
      <div class="game-card-top">
        <p class="eyebrow">{{ formatDate(game.released) }}</p>
        <span v-if="saved" class="saved-badge">En liste</span>
      </div>

      <RouterLink class="game-title" :to="{ name: 'game-detail', params: { id: game.id } }">
        {{ game.name }}
      </RouterLink>

      <p class="meta-line">
        <span v-if="genres.length">{{ genres.slice(0, 2).join(', ') }}</span>
        <span v-if="platforms.length">{{ platforms.join(', ') }}</span>
      </p>

      <div class="score-row">
        <span>RAWG {{ game.rating.toFixed(1) }}</span>
        <span v-if="game.metacritic">Meta {{ game.metacritic }}</span>
        <span>{{ game.playtime }}h moy.</span>
      </div>

      <div class="card-actions">
        <slot name="actions" :game="game">
          <button v-if="!saved" type="button" class="primary small" @click.stop="$emit('add', game)">Ajouter</button>
          <button v-else type="button" class="ghost small" @click.stop="$emit('remove', game.id)">Retirer</button>
        </slot>
      </div>
    </div>
  </article>
</template>
