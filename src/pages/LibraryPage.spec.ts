import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it } from 'vitest'
import LibraryPage from '@/pages/LibraryPage.vue'
import { useLibraryStore } from '@/stores/library'
import type { RawgGameSummary } from '@/types/game'

const game: RawgGameSummary = {
  id: 12,
  slug: 'stardew-valley',
  name: 'Stardew Valley',
  background_image: 'stardew.jpg',
  released: '2016-02-26',
  rating: 4.4,
  metacritic: 89,
  playtime: 45,
  genres: [{ id: 1, name: 'Simulation', slug: 'simulation' }],
  platforms: [{ platform: { id: 4, name: 'PC', slug: 'pc' } }],
}

describe('LibraryPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders games saved in the shared library store', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const library = useLibraryStore()
    library.addGame(game)

    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/library', component: LibraryPage },
        { path: '/catalog', component: { template: '<div />' } },
        { path: '/games/:id', name: 'game-detail', component: { template: '<div />' } },
      ],
    })

    router.push('/library')
    await router.isReady()

    const wrapper = mount(LibraryPage, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(wrapper.text()).toContain('Stardew Valley')
    expect(wrapper.text()).not.toContain('Aucun jeu')
  })
})
