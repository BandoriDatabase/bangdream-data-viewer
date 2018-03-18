import Vue from 'vue'

export const getStampList = async ({commit, state}, server) => {
  if (state.stampList[server].length) return state[server].stampList
  const stamps = await Vue.apiClient.getStamp(server)
  commit('SET_STAMP_LIST', {stamps: stamps.data, server})
  return stamps
}

export const getStampById = async ({commit, state}, {id, server}) => {
  if (state.stampMap[server][id]) return state.stampMap[server][id]
  const stamp = await Vue.apiClient.getStampById(id, server)
  commit('ADD_STAMP_ENTRY', {id: id, value: stamp, server})
  return stamp
}
