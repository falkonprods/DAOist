module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:node/recommended',
    'plugin:promise/recommended',
  ],
  plugins: ['prettier', 'promise', 'node'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017,
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 0,
    'linebreak-style': ['error', 'unix'],
    'node/no-deprecated-api': 'error',
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
  },
  overrides: [{
    files: ['**/*.vue'],
    rules: {
      'node/no-unsupported-features/es-syntax': 0,
      'node/no-unsupported-features/es-builtins': 0,
      'node/no-unsupported-features/node-builtins': 0,
    },
  }]
}
