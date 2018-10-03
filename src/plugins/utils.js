// import something here
import VueResource from 'vue-resource'
import VueLazyload from 'vue-lazyload'
import VueAnalytics from 'vue-analytics'

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

import imgPreview from '../components/modals/img-preview'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  Vue.use(VueResource)
  Vue.use(VueLazyload, {
    loading: 'statics/loading.gif',
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

  Vue.use((Vue) => {
    const ImgPreClass = Vue.extend(imgPreview)
    const imgVM = new ImgPreClass({ el: document.createElement('div') })
    document.body.appendChild(imgVM.$el)

    Vue.preview = Vue.prototype.$preview = {
      open (option) {
        imgVM.open(option)
      }
    }
  })

  Vue.serverList = Vue.prototype.$servers = ['jp', 'tw', 'kr', 'en']

  Vue.specialCardList = Vue.prototype.$specialCardList = {
    jp: [],
    tw: [5001],
    kr: [],
    en: []
  }
}
