import apiDBInfo from 'api/dbinfo'

const initState = {
  gachaList: {
    jp: [],
    tw: []
  },
  gachaMap: {
    jp: {},
    tw: {}
  },
  currentGachaList: {
    jp: [],
    tw: []
  }
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getGachaList ({commit, state}) {
    if (state.gachaList.length) return state.gachaList
    const gachas = await apiDBInfo.getGacha()
    commit('SET_GACHA_LIST', gachas.data)
    return gachas
  },
  async getGachaById ({commit, state}, id) {
    if (state.gachaMap[id]) return state.gachaMap[id]
    const gacha = await apiDBInfo.getGachaById(id)
    commit('ADD_GACHA_ENTRY', {id: id, value: gacha})
    return gacha
  },
  async getGachaCurrent ({commit, state}, server) {
    if (state.currentGachaList[server].length) return state.currentGachaList[server]
    const gachas = await apiDBInfo.getGachaCurrent(server)
    commit('SET_GACHA_CURRENT_LIST', {data: gachas.data, server})
    return gachas
  }
}

const mutations = {
  SET_GACHA_LIST (state, gachas) {
    state.gachaList = gachas
  },
  SET_GACHA_CURRENT_LIST (state, {data, server}) {
    state.currentGachaList[server] = data
  },
  ADD_GACHA_ENTRY (state, obj) {
    state.gachaMap[obj.id] = obj.value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
