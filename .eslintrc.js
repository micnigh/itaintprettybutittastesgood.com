module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2019,
  },
  plugins: ["@typescript-eslint", "jest"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react/recommended", "prettier"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-unused-vars": "warn",
    "no-control-regex": 0,
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/no-unknown-property": "warn",
    "no-undef": "warn",
  },
}
