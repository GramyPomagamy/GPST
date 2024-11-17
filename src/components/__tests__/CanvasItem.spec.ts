import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'

import { defaultVuetify } from '@/vuetifyInstance'

import { createTestingPinia } from '@pinia/testing'

import CanvasItem from '@/components/CanvasItem.vue'

const vuetify = defaultVuetify()

describe('CanvasItem', () => {
  it('renders props.msg when passed', () => {
    const width = 800,
      height = 600,
      title = 'title',
      wrapper = mount(CanvasItem, {
        props: { canvasWidth: width, canvasHeight: height, title },
        global: {
          plugins: [vuetify, createTestingPinia()]
        }
      })
    //Expect(wrapper.text()).
  })
})
