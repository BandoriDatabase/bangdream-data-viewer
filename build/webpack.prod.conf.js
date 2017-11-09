var
  path = require('path'),
  config = require('../config'),
  cssUtils = require('./css-utils'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  baseWebpackConfig = require('./webpack.base.conf'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'),
  UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
  workboxPlugin = require('workbox-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: cssUtils.styleRules({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      postcss: true
    })
  },
  output: {
    filename: 'js/[name].[chunkhash].js',
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  plugins: [
    new UglifyJSPlugin({
      sourceMap: config.build.productionSourceMap,
      uglifyOptions: {
        compress: {
          warnings: false
        },
      },
      parallel: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: 'src/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          (
            module.resource.indexOf('quasar') > -1 ||
            module.resource.indexOf(
              path.join(__dirname, '../node_modules')
            ) === 0
          )
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // create service worker using workbox by Google
    new workboxPlugin({
      globDirectory: path.resolve(__dirname, '../dist'),
      globPatterns: ['**/*.{html,js,css,png,gif,woff}'],
      swDest: path.join(path.resolve(__dirname, '../dist'), 'sw.js'),
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp('https://api.bangdream.ga'),
          handler: 'networkFirst'
        },
        {
          urlPattern: new RegExp('https://res.bangdream.ga/assets'),
          handler: 'cacheFirst'
        }
      ]
    })
  ]
})
