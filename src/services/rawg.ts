import type { RawgGameDetail, RawgGameSummary, RawgListResponse, RawgScreenshot } from '@/types/game'

const BASE_URL = 'https://api.rawg.io/api'
const API_KEY = import.meta.env.VITE_RAWG_API_KEY as string | undefined

type SearchParams = {
  page?: number
  pageSize?: number
  search?: string
  genre?: string
  platform?: string
  ordering?: string
  signal?: AbortSignal
}

export class RawgMissingKeyError extends Error {
  constructor() {
    super('La cle RAWG est absente.')
  }
}

export async function fetchGames(params: SearchParams = {}): Promise<RawgListResponse<RawgGameSummary>> {
  return request('/games', {
    page: String(params.page ?? 1),
    page_size: String(params.pageSize ?? 12),
    search: params.search ?? '',
    genres: params.genre ?? '',
    platforms: params.platform ?? '',
    ordering: params.ordering ?? '-rating',
  }, params.signal)
}

export async function fetchGameDetail(id: string, signal?: AbortSignal): Promise<RawgGameDetail> {
  return request(`/games/${id}`, {}, signal)
}

export async function fetchScreenshots(id: string, signal?: AbortSignal): Promise<RawgListResponse<RawgScreenshot>> {
  return request(`/games/${id}/screenshots`, {}, signal)
}

async function request<T>(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  if (!API_KEY) {
    throw new RawgMissingKeyError()
  }

  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('key', API_KEY)

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value)
  }

  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`RAWG a repondu ${response.status}`)
  }

  return response.json() as Promise<T>
}
