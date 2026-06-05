import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { PersonalGame, RawgGameDetail, RawgGameSummary } from '@/types/game'
import { buildLibraryStats } from '@/utils/stats'

const STORAGE_KEY = 'gameshelf.library.v1'

export const useLibraryStore = defineStore('library', () => {
  const items = ref<Record<number, PersonalGame>>(readStoredLibrary())
  const list = computed(() => Object.values(items.value).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
  const stats = computed(() => buildLibraryStats(list.value))
  const hasItems = computed(() => list.value.length > 0)

  watch(items, (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  }, { deep: true })

  function addGame(game: RawgGameSummary | RawgGameDetail | PersonalGame): void {
    const now = new Date().toISOString()

    if (!('background_image' in game)) {
      items.value[game.id] = {
        ...game,
        updatedAt: now,
      }
      return
    }

    items.value[game.id] = {
      id: game.id,
      slug: game.slug,
      name: game.name,
      image: game.background_image,
      released: game.released,
      rating: game.rating,
      metacritic: game.metacritic,
      playtime: game.playtime,
      genres: game.genres.map((genre) => genre.name),
      platforms: game.platforms?.slice(0, 4).map(({ platform }) => platform.name) ?? [],
      status: items.value[game.id]?.status ?? 'todo',
      userRating: items.value[game.id]?.userRating ?? 0,
      note: items.value[game.id]?.note ?? '',
      addedAt: items.value[game.id]?.addedAt ?? now,
      updatedAt: now,
    }
  }

  function removeGame(id: number): void {
    delete items.value[id]
  }

  function updateGame(id: number, patch: Partial<Pick<PersonalGame, 'status' | 'userRating' | 'note'>>): void {
    const current = items.value[id]
    if (!current) return

    items.value[id] = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    }
  }

  function isSaved(id: number): boolean {
    return Boolean(items.value[id])
  }

  function findById(id: number): PersonalGame | undefined {
    return items.value[id]
  }

  return {
    items,
    list,
    stats,
    hasItems,
    addGame,
    removeGame,
    updateGame,
    isSaved,
    findById,
  }
})

function readStoredLibrary(): Record<number, PersonalGame> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) as Record<number, PersonalGame> : {}
  } catch {
    return {}
  }
}
