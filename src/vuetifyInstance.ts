import { h } from 'vue'
import { createVuetify } from 'vuetify'
import type { IconSet, IconProps } from 'vuetify'
import { VLigatureIcon } from 'vuetify/components'
import { aliases, md } from 'vuetify/iconsets/md'
import { mdi } from 'vuetify/iconsets/mdi'
import { en, pl } from 'vuetify/locale'
import colors from 'vuetify/util/colors'

const mdso: IconSet = {
    component: (props: IconProps) =>
      h(VLigatureIcon, {
        ...props,
        class: 'material-symbols-outlined'
      })
  },
  defaultVuetify = function () {
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
        defaultSet: 'mdso',
        aliases,
        sets: {
          md,
          mdi,
          mdso
        }
      }
    })
  }

export { defaultVuetify }
