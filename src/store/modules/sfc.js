import apiDBInfo from 'api/dbinfo'

const initState = {
  sfcList: []
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getSFCList ({commit, state}) {
    if (state.sfcList.length) return state.sfcList
    const sfcs = await apiDBInfo.getSingleFrameCartoon()
    commit('SET_SFC_LIST', sfcs.data)
    return sfcs.data
  }
}

const mutations = {
  SET_SFC_LIST (state, sfcs) {
    state.sfcList = sfcs
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
