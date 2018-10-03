import Vue from 'vue'

export const getCharaList = async ({ commit, state }, server) => {
  if (state.charaList[server].length) return state.charaList[server]
  const charas = await Vue.apiClient.getChara(server)
  commit('SET_CHARA_LIST', { data: charas.data, server })
  return charas.data
}

export const getBandCharaList = async ({ commit, state }, server) => {
  if (state.bandCharaList[server].length) return state.bandCharaList[server]
  const charas = await Vue.apiClient.getBandChara(server)
  commit('SET_BAND_CHARA_LIST', { data: charas, server })
  return charas
}

export const getCharaById = async ({ commit, state }, { charaId, server }) => {
  if (state.charaMap[server][charaId]) return state.charaMap[server][charaId]
  const chara = await Vue.apiClient.getCharaById(charaId, server)
  commit('ADD_CHARA_MAP_ENTRY', { id: charaId, value: chara, server })
  return chara
}
