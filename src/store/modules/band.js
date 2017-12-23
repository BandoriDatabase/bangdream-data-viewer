import apiDBInfo from 'api/dbinfo'

const initState = {
  bandList: {
    jp: [],
    tw: []
  },
  bandMap: {
    jp: {},
    tw: {}
  }
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getBandList ({commit, state}, server) {
    if (state.bandList[server].length) {
      return state.bandList[server]
    }
    const bands = await apiDBInfo.getBand(server)
    commit('SET_BAND_LIST', { data: bands, server })
    return bands
  }
}

const mutations = {
  SET_BAND_LIST (state, { data, server }) {
    state.bandList[server] = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
