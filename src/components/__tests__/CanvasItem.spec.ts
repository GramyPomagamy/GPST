import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CanvasItem from '@/components/CanvasItem.vue'
import { defaultVuetify } from '@/vuetifyInstance'

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
    expect(wrapper.text()).contain('Nie pójdzie bez JS')
  })
})
