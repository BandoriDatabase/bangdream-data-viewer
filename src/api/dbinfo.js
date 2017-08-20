import Vue from 'vue'

export default {
  getMasterDB () {
    return Vue.http.get('static/MasterDB.json')
  },
  getLive2DDB () {
    return Vue.http.get('static/live2d.json')
  }
}
