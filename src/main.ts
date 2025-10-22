import { createPinia } from 'pinia'
import { createApp } from 'vue'
// Vuetify
import 'vuetify/styles'
import { fonts } from '@/fontLoader'
import { defaultVuetify } from '@/vuetifyInstance'
import App from './App.vue'
import router from './router'

const vuetify = defaultVuetify(),
  app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(fonts)

app.mount('#app')
