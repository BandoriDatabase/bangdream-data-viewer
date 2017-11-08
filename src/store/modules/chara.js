import apiDBInfo from 'api/dbinfo'

const initState = {
  bandList: [],
  bandCharaList: [],
  charaList: [],
  charaMap: {}
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getCharaList ({commit, state}) {
    if (state.charaList.length) return state.charaList
    const charas = await apiDBInfo.getChara()
    commit('SET_CHARA_LIST', charas.data)
    return charas.data
  },
  async getBandCharaList ({commit, state}) {
    if (state.bandCharaList.length) return state.bandCharaList
    const charas = await apiDBInfo.getBandChara()
    commit('SET_BAND_CHARA_LIST', charas)
    return charas
  },
  async getCharaById ({commit, state}, charaId) {
    if (state.charaMap[charaId]) return state.charaMap[charaId]
    const chara = await apiDBInfo.getCharaById(charaId)
    commit('ADD_CHARA_MAP_ENTRY', {id: charaId, value: chara})
    return chara
  }
}

const mutations = {
  SET_CHARA_LIST (state, charas) {
    state.charaList = charas
  },
  SET_BAND_CHARA_LIST (state, charas) {
    state.bandCharaList = charas
  },
  ADD_CHARA_MAP_ENTRY (state, obj) {
    state.charaMap[obj.id] = obj.value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
