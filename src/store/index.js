import Vue from 'vue'
import Vuex from 'vuex'
// import createLogger from 'vuex/dist/logger'
import DB from './modules/db'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    DB
  }
  // plugins: [
  //   createLogger()
  // ]
})
