import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RatingInput from '@/components/RatingInput.vue'

describe('RatingInput', () => {
  it('emits v-model updates when a star is clicked', async () => {
    const wrapper = mount(RatingInput, {
      props: {
        modelValue: 0,
      },
    })

    await wrapper.findAll('button')[3].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
  })

  it('clears the rating when the same value is selected', async () => {
    const wrapper = mount(RatingInput, {
      props: {
        modelValue: 3,
      },
    })

    await wrapper.findAll('button')[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })
})
