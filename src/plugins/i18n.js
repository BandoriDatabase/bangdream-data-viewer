import VueI18n from 'vue-i18n'
import Quasar, { LocalStorage } from 'quasar'
import messages from 'src/i18n'

export default ({ app, Vue }) => {
  Vue.use(VueI18n)

  let locale = LocalStorage.get.item('useLocale')
  if (!locale || locale !== locale.toLowerCase()) {
    locale = Quasar.i18n.getLocale().toLowerCase()
    LocalStorage.set('useLocale', locale)
  }

  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale,
    fallbackLocale: 'en',
    messages
  })
}
