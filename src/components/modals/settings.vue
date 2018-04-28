<template>
  <q-modal ref="modal" :content-css="{padding: '15px'}"
  v-model="isOpen" @hide="changeLang">
    <q-select
      float-label="Language/语言/語言/言語"
      v-model="lang"
      :options="languages"
    />
    <div class="action-buttons">
      <q-btn color="pink" @click="isOpen = false">Confirm</q-btn>
    </div>
  </q-modal>
</template>

<script>
import { LocalStorage } from 'quasar'

export default {
  // name: 'ComponentName',
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
        label: '日本語 (by 石道 夜楓)',
        value: 'ja'
      }, {
        label: '한국 (by Mau)',
        value: 'kr'
      }],
      isOpen: false
    }
  },
  mounted () {
    this.lang = LocalStorage.get.item('useLocale')
  },
  methods: {
    changeLang (newVal) {
      this.$i18n.locale = newVal || this.lang
      LocalStorage.set('useLocale', newVal || this.lang)
    },
    open () {
      this.isOpen = true
    }
  }
}
</script>

<style>
</style>
