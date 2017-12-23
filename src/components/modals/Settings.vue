<template>
  <q-modal ref="modal" :content-css="{minHeight: '415px', padding: '5px'}" @close="reloadPage">
    <q-select
      float-label="Language/语言/語言/言語"
      v-model="lang"
      :options="languages"
      @change="changeLang"
    />
    <div class="action-buttons">
      <q-btn color="pink" @click="$refs.modal.close()">Confirm</q-btn>
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
    changeLang (value) {
      this.$i18n.locale = value
      LocalStorage.set('useLocale', value)
    },
    open () {
      this.$refs.modal.open()
    },
    reloadPage () {
      window.location.reload()
    }
  }
}
</script>

<style lang="stylus">

</style>
