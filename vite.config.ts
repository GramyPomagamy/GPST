import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import packageJson from './package.json'
import vueDevTools from 'vite-plugin-vue-devtools'
import generateFile from 'vite-plugin-generate-file'

// https://vitejs.dev/config/
const config = defineConfig({
  plugins: [vue(), vuetify({ autoImport: { labs: true } }), vueDevTools()],
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

// parse process.argv and get base path, I couldn't find a better way to do it
let base = '/'
let basePrevious = false
for (const argv of process.argv) {
  if (argv == '--base') {
    basePrevious = true
  } else if (basePrevious) {
    base = argv
  }
}

config.plugins?.push(
  generateFile([
    {
      type: 'template',
      output: './.htaccess',
      template: './htaccess_template.ejs',
      data: {
        path: base
      }
    }
  ])
)

export default config
