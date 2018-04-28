// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
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
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons',
      // 'ionicons',
      // 'mdi',
      'fontawesome'
    ],
    supportIE: false,
    vendor: {
      add: [],
      remove: []
    },
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
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
        '/assets-kr': {
          target: 'https://res.bangdream.ga',
          changeOrigin: true
        },
        '/assets-en': {
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
          // target: 'https://api.bangdream.ga',
          target: 'http://localhost:8180',
          changeOrigin: true,
          pathRewrite: {
            '^/api/v1': '/v1'
          }
        }
      }
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemSeparator',
        'QPopover',
        'QModal',
        'QSelect',
        'QCollapsible',
        'QSpinner',
        'QSpinnerFacebook',
        'QSpinnerDots',
        'QInnerLoading',
        'QCard',
        'QCardTitle',
        'QCardMain',
        'QCardMedia',
        'QCardSeparator',
        'QCardActions',
        'QTooltip',
        'QInfiniteScroll',
        'QToggle',
        'QRadio',
        'QInput',
        'QProgress',
        'QTable',
        'QTd'
      ],
      directives: [
        'Ripple',
        'BackToTop',
        'CloseOverlay'
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
      'bounceOutUp'
    ],
    pwa: {
      start_url: '/',
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        name: 'Bandori Database',
        short_name: 'Bandori DB',
        description: 'The unified Database for the mobile idol rhythm game BanG Dream! Girls Band Party!',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#e91e63',
        background_color: '#e91e63',
        icons: [
          {
            'src': 'statics/icons/icon-72x72.png',
            'sizes': '72x72',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-96x96.png',
            'sizes': '96x96',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-144x144.png',
            'sizes': '144x144',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-152x152.png',
            'sizes': '152x152',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
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
