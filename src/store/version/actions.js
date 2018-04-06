/*
export const someAction = (state) => {}
 */
import Vue from 'vue'

export const getResourceVersion = async ({ commit, state }) => {
  if (state.resVer.jp && state.resVer.tw) return state.resVer
  Vue.apiClient.getResVer('jp').then(res => commit('SET_RES_VER', {ver: res.body, server: 'jp'}))
  Vue.apiClient.getResVer('tw').then(res => commit('SET_RES_VER', {ver: res.body, server: 'tw'}))
  Vue.apiClient.getResVer('kr').then(res => commit('SET_RES_VER', {ver: res.body, server: 'kr'}))
  Vue.apiClient.getResVer('en').then(res => commit('SET_RES_VER', {ver: res.body, server: 'en'}))
}

export const getMasterVersion = async ({commit, state}) => {
  if (state.masterVer) return state.masterVer
  const res = await Vue.apiClient.getMasterVer()
  commit('SET_MASTER_VER', res.body)
  return res.body
}
