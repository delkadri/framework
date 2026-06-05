import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GameCard from '@/components/GameCard.vue'
import type { RawgGameSummary } from '@/types/game'

const game: RawgGameSummary = {
  id: 7,
  slug: 'hollow-knight',
  name: 'Hollow Knight',
  background_image: null,
  released: '2017-02-24',
  rating: 4.4,
  metacritic: 90,
  playtime: 20,
  genres: [{ id: 1, name: 'Metroidvania', slug: 'metroidvania' }],
  platforms: [{ platform: { id: 4, name: 'PC', slug: 'pc' } }],
}

describe('GameCard', () => {
  it('emits the selected game when add is clicked', async () => {
    const wrapper = mount(GameCard, {
      props: {
        game,
        saved: false,
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('add')?.[0]).toEqual([game])
  })
})
