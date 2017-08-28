import Vue from 'vue'

export default {
  getRemoteLocale () {
    return Vue.http.get('static/locale.json')
  }
}
