import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App.vue'
import { router } from '@/router'

vi.mock('@/services/rawg', () => ({
  RawgMissingKeyError: class RawgMissingKeyError extends Error {},
  fetchGames: vi.fn(async () => ({
    count: 1,
    next: null,
    previous: null,
    results: [
      {
        id: 99,
        slug: 'elden-ring',
        name: 'Elden Ring',
        background_image: null,
        released: '2022-02-25',
        rating: 4.6,
        metacritic: 96,
        playtime: 60,
        genres: [{ id: 1, name: 'RPG', slug: 'rpg' }],
        platforms: [{ platform: { id: 4, name: 'PC', slug: 'pc' } }],
      },
    ],
  })),
  fetchGameDetail: vi.fn(),
  fetchScreenshots: vi.fn(),
}))

describe('App navigation', () => {
  beforeEach(async () => {
    localStorage.clear()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
    window.scrollTo = vi.fn()
    setActivePinia(createPinia())
    router.push('/')
    await router.isReady()
  })

  it('keeps an added game visible after navigating to the library', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
        directives: {
          focus: {},
        },
      },
    })

    await router.push('/catalog')
    await flushPromises()

    const addButton = wrapper.findAll('button').find((button) => button.text() === 'Ajouter')
    expect(addButton).toBeTruthy()

    await addButton?.trigger('click')
    expect(localStorage.getItem('gameshelf.library.v1')).toContain('Elden Ring')

    await router.push('/library')
    await flushPromises()

    expect(wrapper.text()).toContain('Elden Ring')
    expect(wrapper.text()).not.toContain("Aucun jeu pour l'instant")
  })
})
