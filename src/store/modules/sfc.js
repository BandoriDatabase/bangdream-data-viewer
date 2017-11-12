import apiDBInfo from 'api/dbinfo'

const initState = {
  sfcList: {
    jp: [],
    tw: []
  }
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getSFCList ({commit, state}, server) {
    if (state.sfcList[server].length) return state.sfcList[server]
    const sfcs = await apiDBInfo.getSingleFrameCartoon(server)
    commit('SET_SFC_LIST', {data: sfcs.data, server})
    return sfcs.data
  }
}

const mutations = {
  SET_SFC_LIST (state, {data, server}) {
    state.sfcList[server] = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
