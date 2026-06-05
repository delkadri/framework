import { describe, expect, it } from 'vitest'
import { buildLibraryStats } from '@/utils/stats'
import type { PersonalGame } from '@/types/game'

const baseGame: PersonalGame = {
  id: 1,
  slug: 'hades',
  name: 'Hades',
  image: null,
  released: '2020-09-17',
  rating: 4.3,
  metacritic: 93,
  playtime: 18,
  genres: ['Action', 'RPG'],
  platforms: ['PC'],
  status: 'done',
  userRating: 5,
  note: '',
  addedAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('buildLibraryStats', () => {
  it('aggregates personal games', () => {
    const stats = buildLibraryStats([
      baseGame,
      {
        ...baseGame,
        id: 2,
        name: 'Celeste',
        status: 'playing',
        userRating: 4,
        playtime: 10,
        genres: ['Platformer', 'Action'],
      },
    ])

    expect(stats.total).toBe(2)
    expect(stats.averageRating).toBe(4.5)
    expect(stats.totalPlaytime).toBe(28)
    expect(stats.byStatus.done).toBe(1)
    expect(stats.byStatus.playing).toBe(1)
    expect(stats.topGenres[0]).toEqual({ label: 'Action', value: 2 })
    expect(stats.topRated[0].name).toBe('Hades')
  })

  it('returns empty values for an empty library', () => {
    const stats = buildLibraryStats([])

    expect(stats.total).toBe(0)
    expect(stats.averageRating).toBe(0)
    expect(stats.byStatus.todo).toBe(0)
    expect(stats.topGenres).toEqual([])
  })
})
