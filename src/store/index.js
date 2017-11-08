import Vue from 'vue'
import Vuex from 'vuex'
// import createLogger from 'vuex/dist/logger'
import DB from './modules/db'
import card from './modules/card'
import chara from './modules/chara'
import event from './modules/event'
import stamp from './modules/stamp'
import gacha from './modules/gacha'
import version from './modules/version'
import sfc from './modules/sfc'
import music from './modules/music'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    DB,
    card,
    chara,
    event,
    stamp,
    gacha,
    version,
    sfc,
    music
  }
  // plugins: [
  //   createLogger()
  // ]
})
