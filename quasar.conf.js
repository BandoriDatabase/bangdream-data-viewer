// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    boot: [
      'i18n',
      'addressbar-color',
      'pixi-live2d',
      'api-client',
      'utils'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      'roboto-font',
      'material-icons',
      // 'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5'
      // 'eva-icons'
    ],
    vendor: {
      add: [],
      remove: []
    },
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      showProgress: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
      }
    },
    devServer: {
      // https: true,
      port: 8090,
      open: true, // opens browser window automatically
      proxy: {
        '/assets': {
          target: 'https://res.bandori.top/file/bandori-assets/',
          // target: 'http://localhost:8000',
          changeOrigin: true,
          pathRewrite: {
            '^/assets': ''
          }
        },
        // '/live2d': {
        //   target: 'http://localhost:8000/assets/live2d/chara',
        //   // target: 'https://res.bandori.ga/assets/live2d/chara',
        //   changeOrigin: true,
        //   pathRewrite: {
        //     '^/live2d': ''
        //   }
        // },
        '/api': {
          // target: 'https://api.bandori.ga',
          target: 'http://localhost:8180',
          changeOrigin: true,
          pathRewrite: {
            '^/api/v1': '/v1',
            '^/api/v2': '/v2'
          }
        }
      }
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      importStrategy: 'auto',
      // components: [
      //   'QLayout',
      //   'QHeader',
      //   'QDrawer',
      //   'QPageContainer',
      //   'QPageScroller',
      //   'QPage',
      //   'QToolbar',
      //   'QToolbarTitle',
      //   'QBtn',
      //   'QChip',
      //   'QCheckbox',
      //   'QIcon',
      //   'QList',
      //   'QItem',
      //   'QItemSection',
      //   'QItemLabel',
      //   'QSeparator',
      //   'QMenu',
      //   'QDialog',
      //   'QSelect',
      //   'QExpansionItem',
      //   'QSpinner',
      //   'QSpinnerFacebook',
      //   'QSpinnerDots',
      //   'QInnerLoading',
      //   'QCard',
      //   'QCardSection',
      //   'QCardActions',
      //   'QTooltip',
      //   'QInfiniteScroll',
      //   'QToggle',
      //   'QRadio',
      //   'QInput',
      //   'QLinearProgress',
      //   'QCircularProgress',
      //   'QTable',
      //   'QTd',
      //   'QBar',
      //   'QBanner',
      //   'QImg',
      //   'QSlider',
      //   'QBadge'
      // ],
      directives: [
        'Ripple',
        // 'BackToTop',
        // 'CloseOverlay',
        'ClosePopup'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'AddressbarColor',
        'LocalStorage',
        'Dialog'
      ]
    },
    // animations: 'all' --- includes all animations
    animations: [
      'bounceInUp',
      'bounceOutUp',
      'bounceInDown',
      'bounceOutDown',
      'bounceInLeft',
      'bounceOutRight'
    ],
    pwa: {
      start_url: '/',
      // workboxPluginMode: 'InjectManifest',
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {
        // runtimeCaching: [{
        //   urlPattern: /api\/v1\/\S{2}\/chara\/birthday/,
        //   handler: 'NetworkFirst',
        //   options: {
        //     cacheName: 'bd-api-cache'
        //   }
        // }, {
        //   urlPattern: /api\/v1\/\S{2}\/(card|chara|live2d\/model|live2d\/costume|music|stamp|degree|event\/badge)\/.+/,
        //   handler: 'StaleWhileRevalidate',
        //   options: {
        //     cacheName: 'bd-api-cache'
        //   }
        // }]
        skipWaiting: true
      },
      manifest: {
        name: 'Bandori Top',
        short_name: 'Bandori DB',
        description: 'The unified Database for the mobile idol rhythm game BanG Dream! Girls Band Party!',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#e91e63',
        background_color: '#e91e63',
        icons: [
          {
            'src': 'icons/icon-72x72.png',
            'sizes': '72x72',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-96x96.png',
            'sizes': '96x96',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-144x144.png',
            'sizes': '144x144',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-152x152.png',
            'sizes': '152x152',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.0'
  }
}
