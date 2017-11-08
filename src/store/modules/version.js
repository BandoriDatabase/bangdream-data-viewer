import apiDBInfo from 'api/dbinfo'

const initState = {
  resVer: '',
  masterVer: ''
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getResourceVersion ({commit, state}) {
    if (state.resVer) return state.resVer
    const res = await apiDBInfo.getResVer()
    commit('SET_RES_VER', res.body)
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
  SET_RES_VER (state, ver) {
    state.resVer = ver
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
