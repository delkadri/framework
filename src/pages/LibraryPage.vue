<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import EmptyState from '@/components/EmptyState.vue'
import GameCard from '@/components/GameCard.vue'
import RatingInput from '@/components/RatingInput.vue'
import StatusSelect from '@/components/StatusSelect.vue'
import { useLibraryStore } from '@/stores/library'
import { statusLabels, type GameStatus, type PersonalGame } from '@/types/game'

const route = useRoute()
const library = useLibraryStore()
const statusFilter = ref<GameStatus | 'all'>('all')
const pendingRemove = ref<PersonalGame | null>(null)

const filteredGames = computed(() => {
  if (statusFilter.value === 'all') return library.list
  return library.list.filter((game) => game.status === statusFilter.value)
})

const statuses = Object.entries(statusLabels) as Array<[GameStatus, string]>
</script>

<template>
  <section class="page-title">
    <p class="eyebrow">Liste personnelle</p>
    <h1>Ma ludotheque</h1>
    <p v-if="route.query.blocked" class="notice">Ajoute au moins un jeu pour acceder aux statistiques.</p>
  </section>

  <EmptyState v-if="!library.hasItems">
    <h2>Aucun jeu pour l'instant</h2>
    <p>Ajoute un jeu depuis le catalogue pour commencer a suivre ton backlog.</p>
    <template #actions>
      <RouterLink class="primary" to="/catalog">Explorer le catalogue</RouterLink>
    </template>
  </EmptyState>

  <template v-else>
    <div class="segmented">
      <button type="button" :class="{ active: statusFilter === 'all' }" @click="statusFilter = 'all'">Tous</button>
      <button
        v-for="[value, label] in statuses"
        :key="value"
        type="button"
        :class="{ active: statusFilter === value }"
        @click="statusFilter = value"
      >
        {{ label }}
      </button>
    </div>

    <div class="library-list">
      <GameCard
        v-for="game in filteredGames"
        :key="game.id"
        :game="game"
        saved
        @remove="pendingRemove = game"
      >
        <template #actions>
          <div class="personal-controls">
            <StatusSelect :model-value="game.status" @update:model-value="library.updateGame(game.id, { status: $event })" />
            <RatingInput :model-value="game.userRating" label="Note" @update:model-value="library.updateGame(game.id, { userRating: $event })" />
            <textarea
              :value="game.note"
              rows="2"
              placeholder="Commentaire"
              @input="library.updateGame(game.id, { note: ($event.target as HTMLTextAreaElement).value })"
            />
            <button type="button" class="danger small" @click="pendingRemove = game">Retirer</button>
          </div>
        </template>
      </GameCard>
    </div>
  </template>

  <ConfirmDialog
    :open="Boolean(pendingRemove)"
    title="Retirer ce jeu ?"
    :message="pendingRemove ? `${pendingRemove.name} sera supprime de ta liste locale.` : ''"
    @cancel="pendingRemove = null"
    @confirm="pendingRemove && library.removeGame(pendingRemove.id); pendingRemove = null"
  />
</template>
