import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
import { en, pl } from 'vuetify/locale'

export const defaultVuetify = function () {
  return createVuetify({
    theme: {
      defaultTheme: 'dark'
    },
    locale: {
      locale: 'pl',
      fallback: 'en',
      messages: { pl, en }
    },
    icons: {
      defaultSet: 'md',
      aliases,
      sets: {
        md
      }
    }
  })
}
