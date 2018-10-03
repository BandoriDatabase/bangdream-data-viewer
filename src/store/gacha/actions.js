import Vue from 'vue'

export const getGachaList = async ({ commit, state }, server) => {
  if (state.gachaList[server].length) return state.gachaList[server]
  const gachas = await Vue.apiClient.getGacha()
  commit('SET_GACHA_LIST', { gachas: gachas.data, server })
  return gachas
}

export const getGachaById = async ({ commit, state }, { server, id }) => {
  if (state.gachaMap[server][id]) return state.gachaMap[server][id]
  const gacha = await Vue.apiClient.getGachaById(id, server)
  commit('ADD_GACHA_ENTRY', { obj: { id: id, value: gacha }, server })
  return gacha
}

export const getGachaCurrent = async ({ commit, state }, server) => {
  if (state.currentGachaList[server].length) return state.currentGachaList[server]
  const gachas = await Vue.apiClient.getGachaCurrent(server)
  commit('SET_GACHA_CURRENT_LIST', { data: gachas.data, server })
  return gachas
}
