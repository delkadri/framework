import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SearchBox from '@/components/SearchBox.vue'
import { focusDirective } from '@/directives/focus'

describe('SearchBox', () => {
  it('behaves like a controlled input', async () => {
    const wrapper = mount(SearchBox, {
      props: {
        modelValue: '',
      },
      global: {
        directives: {
          focus: focusDirective,
        },
      },
    })

    await wrapper.find('input').setValue('zelda')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['zelda'])
  })

  it('emits clear events', async () => {
    const wrapper = mount(SearchBox, {
      props: {
        modelValue: 'hades',
      },
      global: {
        directives: {
          focus: focusDirective,
        },
      },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
