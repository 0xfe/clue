module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    jquery: true,
    es6: true,
    mocha: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
  },
  rules: {
    'prefer-destructuring': 'off',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
    },
  ],
};
