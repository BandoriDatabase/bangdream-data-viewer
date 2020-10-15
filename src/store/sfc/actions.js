import Vue from 'vue'

export const getSFCList = async ({ commit, state }, { server, params }) => {
  if (state.sfcList[server].length >= params.limit * params.page) return state.sfcList[server]
  const sfcs = await Vue.apiClient.getSingleFrameCartoon(server, params)
  commit('APPEND_SFC_LIST', { data: sfcs.data, server })
  return sfcs.data
}

export const clearSFCList = ({ commit }, server) => commit('CLEAR_SFC_LIST', server)

export const initState = {
  root: true,
  handler ({ commit }, servers) {
    commit('INIT_STATE_DATA', servers)
  }
}
