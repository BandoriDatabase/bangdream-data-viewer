import Vue from 'vue'

export const getFFCList = async ({ commit, state }, { params, server }) => {
  if (state.ffcList[server].length >= params.limit * params.page) return state.ffcList[server]
  const ffcs = await Vue.apiClient.getFourFrameCartoon(server, params)
  commit('APPEND_FFC_LIST', { data: ffcs.data, server })
  return ffcs.data
}

export const clearFFCList = ({ commit }, server) => commit('CLEAR_FFC_LIST', server)

export const initState = {
  root: true,
  handler ({ commit }, servers) {
    commit('INIT_STATE_DATA', servers)
  }
}
