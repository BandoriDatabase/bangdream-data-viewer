<template>
  <q-dialog ref="modal" :content-css="{padding: '15px'}" v-model="isOpen" @hide="saveSetting">
    <q-card style="width: 100%; max-width: 350px;">
      <q-card-section>
        <q-select
          label="Language/语言/語言/言語"
          v-model="lang"
          @input="changeLang"
          :options="languages"
        >
          <template v-slot:selected-item="scope">
            {{ scope.opt.label }}
          </template>
        </q-select>
        <q-select
          :label="$t('common.data-lang')"
          v-model="dataLang"
          @input="changeDataLang"
          :options="dataLangOptions"
        >
          <template v-slot:selected-item="scope">
            {{ scope.opt.label }}
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions>
        <q-btn color="pink" @click="isOpen = false">Confirm</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
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
    this.lang = this.languages.find(elem => elem.value === this.$q.localStorage.getItem('useLocale'))
    this.dataLang = this.dataLangOptions.find(elem => elem.value === (this.$q.localStorage.getItem('dataLang') || 'jp'))
  },
  methods: {
    saveSetting () {
      this.$q.localStorage.set('useLocale', this.lang.value)
      this.$q.localStorage.set('dataLang', this.dataLang.value)

      const { name, params } = this.$router.currentRoute
      if (params.server) params.server = this.dataLang.value
      this.$router.push({ name, params })
    },
    changeLang (newVal) {
      this.$i18n.locale = newVal.value || this.lang.value

      this.updateSettings()
    },
    changeDataLang (newVal) {
      this.$setDataLang(newVal.value)
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
