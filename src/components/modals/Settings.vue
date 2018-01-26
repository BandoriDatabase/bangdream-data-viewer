<template>
  <q-modal ref="modal" :content-css="{minHeight: '415px', padding: '5px'}">
    <q-select
      float-label="Language/语言/語言/言語"
      v-model="lang"
      :options="languages"
    />
    <div class="action-buttons">
      <q-btn color="pink" @click="changeLang()">Confirm</q-btn>
    </div>
  </q-modal>
</template>

<script>
import {
  QModal,
  QSelect,
  QBtn,
  QIcon,
  LocalStorage
} from 'quasar'

export default {
  name: 'settings',
  components: {
    QModal,
    QSelect,
    QBtn,
    QIcon
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
    changeLang () {
      this.$i18n.locale = this.lang
      LocalStorage.set('useLocale', this.lang)
      this.reloadPage()
    },
    open () {
      this.$refs.modal.open()
    },
    reloadPage () {
      this.$refs.modal.close()
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  }
}
</script>

<style lang="stylus">

</style>
