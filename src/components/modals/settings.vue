<template>
  <q-modal ref="modal" :content-css="{padding: '15px'}" v-model="isOpen" @hide="saveSetting">
    <q-select
      float-label="Language/语言/語言/言語"
      v-model="lang"
      @input="changeLang"
      :options="languages"
    />
    <br>
    <q-select
      :float-label="$t('common.data-lang')"
      v-model="dataLang"
      @input="changeDataLang"
      :options="dataLangOptions"
    />
    <br>
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
      dataLang: 'jp',
      dataLangOptions: this.$servers.map(sr => ({
        label: this.$t(`common.${sr}`),
        value: sr
      })),
      isOpen: false
    }
  },
  mounted () {
    this.lang = LocalStorage.get.item('useLocale')
    this.dataLang = LocalStorage.get.item('dataLang') || 'jp'
  },
  methods: {
    saveSetting () {
      LocalStorage.set('useLocale', this.lang)
      LocalStorage.set('dataLang', this.dataLang)

      const { name, params } = this.$router.currentRoute
      if (params.server) params.server = this.dataLang
      this.$router.push({ name, params })
    },
    changeLang (newVal) {
      this.$i18n.locale = newVal || this.lang

      this.updateSettings()
    },
    changeDataLang (newVal) {
      this.$setDataLang(newVal)
    },
    updateSettings () {
      this.dataLangOptions = this.$servers.map(sr => ({
        label: this.$t(`common.${sr}`),
        value: sr
      }))
    },
    open () {
      this.isOpen = true
    }
  }
}
</script>

<style>
</style>
