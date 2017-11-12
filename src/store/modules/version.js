import apiDBInfo from 'api/dbinfo'

const initState = {
  resVer: {
    jp: '',
    tw: ''
  },
  masterVer: ''
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getResourceVersion ({commit, state}) {
    if (state.resVer.jp && state.resVer.tw) return state.resVer
    const res = await apiDBInfo.getResVer('jp')
    commit('SET_RES_VER', {ver: res.body, server: 'jp'})
    const res2 = await apiDBInfo.getResVer('tw')
    commit('SET_RES_VER', {ver: res2.body, server: 'tw'})
    return res.body
  },
  async getMasterVersion ({commit, state}) {
    if (state.masterVer) return state.masterVer
    const res = await apiDBInfo.getMasterVer()
    commit('SET_MASTER_VER', res.body)
    return res.body
  }
}

const mutations = {
  SET_RES_VER (state, {ver, server}) {
    state.resVer[server] = ver
  },
  SET_MASTER_VER (state, ver) {
    state.masterVer = ver
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
