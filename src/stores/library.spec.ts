import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLibraryStore } from '@/stores/library'
import type { RawgGameSummary } from '@/types/game'

const rawgGame: RawgGameSummary = {
  id: 42,
  slug: 'portal-2',
  name: 'Portal 2',
  background_image: 'portal.jpg',
  released: '2011-04-18',
  rating: 4.6,
  metacritic: 95,
  playtime: 11,
  genres: [{ id: 1, name: 'Puzzle', slug: 'puzzle' }],
  platforms: [{ platform: { id: 4, name: 'PC', slug: 'pc' } }],
}

describe('library store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds, updates and removes games', () => {
    const library = useLibraryStore()

    library.addGame(rawgGame)
    expect(library.isSaved(42)).toBe(true)
    expect(library.list[0].name).toBe('Portal 2')
    expect(localStorage.getItem('gameshelf.library.v1')).toContain('Portal 2')

    library.updateGame(42, { status: 'done', userRating: 5, note: 'Coop parfait' })
    expect(library.findById(42)?.status).toBe('done')
    expect(library.stats.averageRating).toBe(5)

    library.removeGame(42)
    expect(library.hasItems).toBe(false)
    expect(localStorage.getItem('gameshelf.library.v1')).toBe('{}')
  })

  it('loads stored games from localStorage', () => {
    localStorage.setItem('gameshelf.library.v1', JSON.stringify({
      42: {
        id: 42,
        slug: 'portal-2',
        name: 'Portal 2',
        image: 'portal.jpg',
        released: '2011-04-18',
        rating: 4.6,
        metacritic: 95,
        playtime: 11,
        genres: ['Puzzle'],
        platforms: ['PC'],
        status: 'todo',
        userRating: 0,
        note: '',
        addedAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    }))

    setActivePinia(createPinia())
    const library = useLibraryStore()

    expect(library.hasItems).toBe(true)
    expect(library.list[0].genres).toEqual(['Puzzle'])
  })
})
