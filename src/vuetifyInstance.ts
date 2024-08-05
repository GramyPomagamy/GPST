import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
import { mdi } from 'vuetify/iconsets/mdi'
import { en, pl } from 'vuetify/locale'
import colors from 'vuetify/util/colors'

export const defaultVuetify = function () {
  return createVuetify({
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            primary: colors.deepPurple.base,
            secondary: colors.deepPurple.lighten4
          }
        }
      }
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
        md,
        mdi
      }
    }
  })
}
