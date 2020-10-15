import Vue from 'vue'

export const getStampList = async ({ commit, state }, { server, params }) => {
  if (state.stampList[server].length >= params.limit * params.page) return state.stampList[server]
  const stamps = await Vue.apiClient.getStamp(server, params)
  commit('APPEND_STAMP_LIST', { stamps: stamps.data, server })
  return stamps.data
}

export const clearStampList = ({ commit }, server) => commit('CLEAR_STAMP_LIST', server)

export const getStampById = async ({ commit, state }, { id, server }) => {
  if (state.stampMap[server][id]) return state.stampMap[server][id]
  const stamp = await Vue.apiClient.getStampById(id, server)
  commit('ADD_STAMP_ENTRY', { id: id, value: stamp, server })
  return stamp
}

export const initState = {
  root: true,
  handler ({ commit }, servers) {
    commit('INIT_STATE_DATA', servers)
  }
}
