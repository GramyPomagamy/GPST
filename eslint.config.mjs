import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },

  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    rules: {
      ...pluginPlaywright.configs['flat/recommended'].rules
    }
  },
  skipFormatting,
  {
    rules: {
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true
        }
      ],
      'vue/multi-word-component-names': 'off'
    }
  }
]
