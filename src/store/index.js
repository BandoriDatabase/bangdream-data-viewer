import Vue from 'vue'
import Vuex from 'vuex'

import version from './version'
import event from './event'
import card from './card'
import gacha from './gacha'
import chara from './chara'
import sfc from './sfc'
import ffc from './ffc'
import band from './band'
import music from './music'
import live2d from './live2d'
import stamp from './stamp'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    version,
    event,
    card,
    gacha,
    chara,
    sfc,
    ffc,
    band,
    music,
    live2d,
    stamp
  }
})

export default store
