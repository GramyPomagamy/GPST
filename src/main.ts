// import './assets/main.css'

import { createApp } from 'vue'
// import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
import { pl, en } from 'vuetify/locale'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
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

const app = createApp(App)

// app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
