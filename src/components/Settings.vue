<template>
  <div>
    <q-select
      float-label="Language/语言/語言/言語"
      v-model="lang"
      :options="languages"
      @change="changeLang"
    />
  </div>
</template>

<script>
import { QSelect, LocalStorage } from 'quasar'

export default {
  name: 'settings',
  components: {
    QSelect
  },
  data () {
    return {
      lang: 'en',
      languages: [{
        label: 'English',
        value: 'en'
      }, {
        label: '简体中文',
        value: 'zh-cn'
      }, {
        label: '繁體中文',
        value: 'zh-tw'
      }, {
        label: '日本語',
        value: 'ja'
      }]
    }
  },
  mounted () {
    this.lang = LocalStorage.get.item('useLocale')
  },
  methods: {
    changeLang (value) {
      this.$i18n.locale = value
      LocalStorage.set('useLocale', value)
    }
  }
}
</script>

<style lang="stylus">

</style>
