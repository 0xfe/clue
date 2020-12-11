module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "jquery": true,
    "es6": true,
    "mocha": true,
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 6,
  },
  "rules": {
    "max-len": [1, 180, 2, { ignoreComments: true }],
    "prefer-destructuring": "off",
  },
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],

  "overrides": [{
    "files": ["*.ts", "*.tsx"],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
  }]
}
