import Vue from 'vue'

export const getGachaList = async ({commit, state}) => {
  if (state.gachaList.length) return state.gachaList
  const gachas = await Vue.apiClient.getGacha()
  commit('SET_GACHA_LIST', gachas.data)
  return gachas
}

export const getGachaById = async ({commit, state}, id) => {
  if (state.gachaMap[id]) return state.gachaMap[id]
  const gacha = await Vue.apiClient.getGachaById(id)
  commit('ADD_GACHA_ENTRY', {id: id, value: gacha})
  return gacha
}

export const getGachaCurrent = async ({commit, state}, server) => {
  if (state.currentGachaList[server].length) return state.currentGachaList[server]
  const gachas = await Vue.apiClient.getGachaCurrent(server)
  commit('SET_GACHA_CURRENT_LIST', {data: gachas.data, server})
  return gachas
}
