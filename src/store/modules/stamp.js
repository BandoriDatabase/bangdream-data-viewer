import apiDBInfo from 'api/dbinfo'

const initState = {
  stampList: {
    jp: [],
    tw: []
  },
  stampMap: {
    jp: {},
    tw: {}
  }
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getStampList ({commit, state}, server) {
    if (state.stampList[server].length) return state[server].stampList
    const stamps = await apiDBInfo.getStamp(server)
    commit('SET_STAMP_LIST', {stamps: stamps.data, server})
    return stamps
  },
  async getStampById ({commit, state}, {id, server}) {
    if (state.stampMap[server][id]) return state.stampMap[server][id]
    const stamp = await apiDBInfo.getStampById(id, server)
    commit('ADD_STAMP_ENTRY', {id: id, value: stamp, server})
    return stamp
  }
}

const mutations = {
  SET_STAMP_LIST (state, {stamps, server}) {
    state.stampList = stamps
  },
  ADD_STAMP_ENTRY (state, obj) {
    state.stampMap[obj.server][obj.id] = obj.value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
