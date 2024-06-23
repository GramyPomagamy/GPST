import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
import { pl, en } from 'vuetify/locale'

export function defaultVuetify() {
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
