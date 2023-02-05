module.exports = {
  "plugins": [

  ],
  "presets": [
    "babel-preset-gatsby",
    ['@babel/preset-react',
    {
      importSource: 'theme-ui', // or '@theme-ui/core'
      runtime: 'automatic',
      throwIfNamespace: false,
    }],
    "@babel/preset-typescript",
  ]
}
