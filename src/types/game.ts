export type GameStatus = 'todo' | 'playing' | 'done' | 'dropped'

export type RawgGenre = {
  id: number
  name: string
  slug: string
}

export type RawgPlatform = {
  platform: {
    id: number
    name: string
    slug: string
  }
}

export type RawgGameSummary = {
  id: number
  slug: string
  name: string
  background_image: string | null
  released: string | null
  rating: number
  metacritic: number | null
  playtime: number
  genres: RawgGenre[]
  platforms: RawgPlatform[] | null
}

export type RawgGameDetail = RawgGameSummary & {
  description_raw: string
  website: string
  developers: RawgGenre[]
  publishers: RawgGenre[]
}

export type RawgScreenshot = {
  id: number
  image: string
}

export type RawgListResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type PersonalGame = {
  id: number
  slug: string
  name: string
  image: string | null
  released: string | null
  rating: number
  metacritic: number | null
  playtime: number
  genres: string[]
  platforms: string[]
  status: GameStatus
  userRating: number
  note: string
  addedAt: string
  updatedAt: string
}

export type LibraryStats = {
  total: number
  averageRating: number
  averagePlaytime: number
  totalPlaytime: number
  byStatus: Record<GameStatus, number>
  byGenre: Record<string, number>
  topGenres: Array<{ label: string; value: number }>
  topRated: PersonalGame[]
}

export type CatalogFilters = {
  search: string
  genre: string
  platform: string
  ordering: string
}

export const statusLabels: Record<GameStatus, string> = {
  todo: 'A faire',
  playing: 'En cours',
  done: 'Termine',
  dropped: 'Abandonne',
}
