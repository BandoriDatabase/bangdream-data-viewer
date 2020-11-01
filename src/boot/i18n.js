import VueI18n from 'vue-i18n'
import { Quasar, LocalStorage } from 'quasar'
import messages from 'src/i18n'
import moment from 'moment'

let i18n

export default ({ app, router, Vue }) => {
  Vue.use(VueI18n)

  let locale = LocalStorage.getItem('useLocale')
  if (!locale || locale !== locale.toLowerCase()) {
    locale = Quasar.lang.getLocale().toLowerCase()
    LocalStorage.set('useLocale', locale)
  }
  moment.locale(locale)

  // Set i18n instance on app
  i18n = app.i18n = new VueI18n({
    locale,
    fallbackLocale: 'en',
    messages
  })

  Vue.dataLang = Vue.prototype.$dataLang = LocalStorage.getItem('dataLang') || 'jp'
  Vue.setDataLang = Vue.prototype.$setDataLang = (newVal) => {
    Vue.dataLang = Vue.prototype.$dataLang = newVal
    LocalStorage.set('dataLang', newVal)
    moment.locale(newVal)
  }
}

export { i18n }
