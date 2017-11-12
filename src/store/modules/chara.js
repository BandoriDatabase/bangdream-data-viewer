import apiDBInfo from 'api/dbinfo'

const initState = {
  bandList: {
    jp: [],
    tw: []
  },
  bandCharaList: {
    jp: [],
    tw: []
  },
  charaList: {
    jp: [],
    tw: []
  },
  charaMap: {
    jp: {},
    tw: {}
  }
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getCharaList ({commit, state}, server) {
    if (state.charaList[server].length) return state.charaList[server]
    const charas = await apiDBInfo.getChara(server)
    commit('SET_CHARA_LIST', {data: charas.data, server})
    return charas.data
  },
  async getBandCharaList ({commit, state}, server) {
    if (state.bandCharaList[server].length) return state.bandCharaList[server]
    const charas = await apiDBInfo.getBandChara(server)
    commit('SET_BAND_CHARA_LIST', {data: charas, server})
    return charas
  },
  async getCharaById ({commit, state}, {charaId, server}) {
    if (state.charaMap[server][charaId]) return state.charaMap[server][charaId]
    const chara = await apiDBInfo.getCharaById(charaId, server)
    commit('ADD_CHARA_MAP_ENTRY', {id: charaId, value: chara, server})
    return chara
  }
}

const mutations = {
  SET_CHARA_LIST (state, {data, server}) {
    state.charaList[server] = data
  },
  SET_BAND_CHARA_LIST (state, {data, server}) {
    state.bandCharaList[server] = data
  },
  ADD_CHARA_MAP_ENTRY (state, obj) {
    state.charaMap[obj.server][obj.id] = obj.value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
