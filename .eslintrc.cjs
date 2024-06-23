/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-shadow': 'error',
    'one-var': 'error',
    /*
     * 'require-await': 'off',
     * '@typescript-eslint/require-await': 'error',
     */
    'func-style': 'error',
    eqeqeq: 'error',
    'max-lines-per-function': 'error',
    'max-statements': 'error',
    '@typescript-eslint/no-use-before-define': 'error',
    'no-warning-comments': 'warn',
    'max-lines': 'error',
    'multiline-comment-style': 'error',
    'prefer-const': 'error',
    'no-eq-null': 'error'
    //no-magic-numbers
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
