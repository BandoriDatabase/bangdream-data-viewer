import apiDBInfo from 'api/dbinfo'

const initState = {
  stampList: [],
  stampMap: {}
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getStampList ({commit, state}) {
    if (state.stampList.length) return state.stampList
    const stamps = await apiDBInfo.getStamp()
    commit('SET_STAMP_LIST', stamps.data)
    return stamps
  },
  async getStampById ({commit, state}, id) {
    if (state.stampMap[id]) return state.stampMap[id]
    const stamp = await apiDBInfo.getStampById(id)
    commit('ADD_STAMP_ENTRY', {id: id, value: stamp})
    return stamp
  }
}

const mutations = {
  SET_STAMP_LIST (state, stamps) {
    state.stampList = stamps
  },
  ADD_STAMP_ENTRY (state, obj) {
    state.stampMap[obj.id] = obj.value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
