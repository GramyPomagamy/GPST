// Import './assets/main.css'

import { createApp } from 'vue'
// Import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'

import { defaultVuetify } from '@/vuetifyInstance'

import App from './App.vue'
import router from './router'

const vuetify = defaultVuetify(),

 app = createApp(App)

// App.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
