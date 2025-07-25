import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'

import { defaultVuetify } from '@/vuetifyInstance'
import { fonts } from '@/fontLoader'

import App from './App.vue'
import router from './router'

const vuetify = defaultVuetify(),
  app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(fonts)

app.mount('#app')
