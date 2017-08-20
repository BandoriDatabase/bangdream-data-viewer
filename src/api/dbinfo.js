import Vue from 'vue'

export default {
  getMasterDB () {
    return Vue.http.get('/MasterDB_parsed.json')
  },
  getLive2DDB () {
    return Vue.http.get('static/live2d.json')
  }
}
