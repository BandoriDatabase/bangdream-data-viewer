import Vue from 'vue'

export const getSFCList = async ({ commit, state }, server) => {
  if (state.sfcList[server].length) return state.sfcList[server]
  const sfcs = await Vue.apiClient.getSingleFrameCartoon(server)
  commit('SET_SFC_LIST', { data: sfcs.data, server })
  return sfcs.data
}
