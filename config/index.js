var path = require('path')

module.exports = {
  // Webpack aliases
  aliases: {
    quasar: path.resolve(__dirname, '../node_modules/quasar-framework/'),
    src: path.resolve(__dirname, '../src'),
    assets: path.resolve(__dirname, '../src/assets'),
    components: path.resolve(__dirname, '../src/components'),
    icons: path.resolve(__dirname, "../node_modules/vue-material-design-icons")
  },

  // Progress Bar Webpack plugin format
  // https://github.com/clessg/progress-bar-webpack-plugin#options
  progressFormat: ' [:bar] ' + ':percent'.bold + ' (:msg)',

  // Default theme to build with ('ios' or 'mat')
  defaultTheme: 'mat',

  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    publicPath: '',
    productionSourceMap: false,

    // Remove unused CSS
    // Disable it if it has side-effects for your specific app
    purifyCSS: false
  },
  dev: {
    env: require('./dev.env'),
    cssSourceMap: true,
    // auto open browser or not
    openBrowser: true,
    publicPath: '/',
    port: 8090,

    // If for example you are using Quasar Play
    // to generate a QR code then on each dev (re)compilation
    // you need to avoid clearing out the console, so set this
    // to "false", otherwise you can set it to "true" to always
    // have only the messages regarding your last (re)compilation.
    clearConsoleOnRebuild: false,

    // Proxy your API if using any.
    // Also see /build/script.dev.js and search for "proxy api requests"
    // https://github.com/chimurai/http-proxy-middleware
    proxyTable: {
      // '/static/': {
      //   target: 'http://127.0.0.1:8080/',
      //   changeOrigin: true,
      // },
      '/assets': {
        target: 'https://res.bangdream.ga',
        changeOrigin: true
      },
      '/assets-jp': {
        target: 'https://res.bangdream.ga',
        changeOrigin: true
      },
      '/assets-tw': {
        target: 'https://res.bangdream.ga',
        changeOrigin: true
      },
      '/live2d': {
        target: 'https://res.bangdream.ga/assets/live2d/chara',
        changeOrigin: true,
        pathRewrite: {
          '^/live2d': ''
        }
      },
      '/api': {
        target: 'http://localhost:8180',
        changeOrigin: true,
        pathRewrite: {
          '^/api/v1': '/v1'
        }
      }
    }
  }
}

/*
 * proxyTable example:
 *
   proxyTable: {
      // proxy all requests starting with /api
      '/api': {
        target: 'https://some.address.com/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
 */
