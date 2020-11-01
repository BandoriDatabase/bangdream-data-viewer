// import something here
import VueResource from 'vue-resource'
import VueLazyload from 'vue-lazyload'
import VueAnalytics from 'vue-analytics'
import { QImg } from 'quasar'
import { detectWebpSupport, loadBinaryData, WebpMachine } from 'webp-hero'

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import VueOffline from 'vue-offline'
import VuePlyr from 'vue-plyr'

import { servers } from '../constants'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  Vue.use(VueResource)
  Vue.use(VueLazyload, {
    loading: 'loading.gif',
    lazyComponent: true,
    observer: true
  })
  if (process.env.NODE_ENV === 'production') {
    Vue.use(VueAnalytics, {
      id: 'UA-96644570-1',
      router,
      autoTracking: {
        exception: true
      }
    })
  }

  Vue.use(Viewer)
  Vue.use(VueOffline)
  Vue.use(VuePlyr)
  Vue.component('MyQImg', QImg.extend({
    methods: {
      __load () {
        clearTimeout(this.ratioTimer)
        this.hasError = false

        if (!this.src) {
          this.isLoading = false
          this.image = void 0
          this.currentSrc = ''
          return
        }

        this.isLoading = true

        const img = new Image()
        this.image = img

        img.onerror = err => {
          // if we are still rendering same image
          if (this.image === img && this.destroyed !== true) {
            this.__onError(err)
          }
        }

        img.onload = () => {
          if (this.destroyed === true) {
            return
          }

          // if we are still rendering same image
          if (this.image === img) {
            if (img.decode !== void 0) {
              img
                .decode()
                .catch(err => {
                  if (this.image === img && this.destroyed !== true) {
                    this.__onError(err)
                  }
                })
                .then(() => {
                  if (this.image === img && this.destroyed !== true) {
                    this.__onLoad(img)
                  }
                })
            } else {
              this.__onLoad(img)
            }
          }
        }

        if (this.src.includes('.webp')) {
          detectWebpSupport()
            .then(isWebpSupport => {
              if (!isWebpSupport) {
                return loadBinaryData(this.src)
              } else {
                img.src = this.src
              }
            }).then(webpData => {
              if (webpData) {
                const wM = new WebpMachine()
                return wM.decode(webpData)
              }
            }).then(pngData => {
              if (pngData) {
                img.src = pngData
              }
            })
        } else {
          img.src = this.src
        }

        if (this.srcset) {
          img.srcset = this.srcset
        }

        if (this.sizes !== void 0) {
          img.sizes = this.sizes
        } else {
          Object.assign(img, {
            height: this.height,
            width: this.width
          })
        }
      }
    }
  }))

  Vue.serverList = Vue.prototype.$servers = servers

  Vue.specialCardList = Vue.prototype.$specialCardList = {
    jp: [],
    tw: [5001],
    kr: [],
    en: [],
    cn: []
  }
}
