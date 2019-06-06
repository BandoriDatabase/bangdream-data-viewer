/*
export const someAction = (state) => {}
 */
import Vue from 'vue'

export const getResourceVersion = async ({ commit, state }) => {
  if (state.resVer.jp && state.resVer.tw) return state.resVer
  Vue.serverList.forEach(server =>
    Vue.apiClient.getResVer(server).then(res => commit('SET_RES_VER', { ver: res.body, server })))
}

export const getMasterVersion = async ({ commit, state }) => {
  if (state.masterVer) return state.masterVer
  const res = await Vue.apiClient.getMasterVer()
  commit('SET_MASTER_VER', res.body)
  return res.body
}

export const initState = {
  root: true,
  handler ({ commit }, servers) {
    commit('INIT_STATE_DATA', servers)
  }
}
