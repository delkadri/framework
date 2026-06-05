import type { GameStatus, LibraryStats, PersonalGame } from '@/types/game'

const emptyStatus: Record<GameStatus, number> = {
  todo: 0,
  playing: 0,
  done: 0,
  dropped: 0,
}

export function buildLibraryStats(items: PersonalGame[]): LibraryStats {
  const byStatus = { ...emptyStatus }
  const byGenre: Record<string, number> = {}
  let totalRating = 0
  let ratedCount = 0
  let totalPlaytime = 0

  for (const game of items) {
    byStatus[game.status] += 1
    totalPlaytime += game.playtime || 0

    if (game.userRating > 0) {
      totalRating += game.userRating
      ratedCount += 1
    }

    for (const genre of game.genres) {
      byGenre[genre] = (byGenre[genre] ?? 0) + 1
    }
  }

  const topGenres = Object.entries(byGenre)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
    .slice(0, 5)

  const topRated = [...items]
    .filter((game) => game.userRating > 0)
    .sort((a, b) => b.userRating - a.userRating || a.name.localeCompare(b.name))
    .slice(0, 5)

  return {
    total: items.length,
    averageRating: ratedCount ? round(totalRating / ratedCount) : 0,
    averagePlaytime: items.length ? round(totalPlaytime / items.length) : 0,
    totalPlaytime,
    byStatus,
    byGenre,
    topGenres,
    topRated,
  }
}

function round(value: number): number {
  return Math.round(value * 10) / 10
}
