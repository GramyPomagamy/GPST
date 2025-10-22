import { ConfigCreator } from '@gramypomagamy/eslint-config'

const tsParser = ConfigCreator.createTsParser({
  tsconfigFilePaths: ['tsconfig.app.json', 'tsconfig.node.json', 'tsconfig.vitest.json']
})
const tsCustom = ConfigCreator.createTsRules({
  folderPath: 'src'
})
const vueCustom = ConfigCreator.createVueRules({
  folderPath: 'src',
  tsconfigFilePaths: ['tsconfig.app.json', 'tsconfig.node.json', 'tsconfig.vitest.json']
})

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'vite-env.d.ts', '**/e2e/**']
  },
  ...tsParser,
  ...tsCustom,
  ...vueCustom
]
