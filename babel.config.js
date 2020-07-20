module.exports = {
  presets: [
    '@quasar/babel-preset-app'
    // [
    //   '@babel/preset-env', {
    //     'modules': false,
    //     'loose': false,
    //     'useBuiltIns': 'usage'
    //   }
    // ],
    // [
    //   '@babel/preset-stage-2', {
    //     'modules': false,
    //     'loose': false,
    //     'useBuiltIns': true,
    //     'decoratorsLegacy': true
    //   }
    // ]
  ],
  plugins: [
    [
      '@babel/transform-runtime', {
        'regenerator': false
      }
    ],
    [
      'transform-imports', {
        'quasar': {
          'transform': require('quasar/dist/babel-transforms/imports.js'),
          'preventFullImport': true
        }
      }
    ]
  ]
}
