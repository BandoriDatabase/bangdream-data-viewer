import Vue from 'vue'

export const getBandList = async ({commit, state}, server) => {
  if (state.bandList[server].length) {
    return state.bandList[server]
  }
  const bands = await Vue.apiClient.getBand(server)
  commit('SET_BAND_LIST', { data: bands, server })
  return bands
}
