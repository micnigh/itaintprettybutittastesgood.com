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
  plugins: ["@typescript-eslint", "@emotion", "jest"],
  extends: ["plugin:@typescript-eslint/recommended", "plugin:react/recommended", "prettier"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/prop-types": "off",
    "react/no-unknown-property": "off",
  },
}
