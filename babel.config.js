module.exports = {
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ],
  "presets": [
    "babel-preset-gatsby",
    ['@babel/preset-react',
    {
      importSource: 'theme-ui', // or '@theme-ui/core'
      runtime: 'automatic',
      throwIfNamespace: false,
    }]
  ]
}
