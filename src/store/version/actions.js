/*
export const someAction = (state) => {}
 */
import Vue from 'vue'

export const getResourceVersion = async ({ commit, state }) => {
  if (state.resVer.jp && state.resVer.tw) return state.resVer
  const res = await Vue.apiClient.getResVer('jp')
  commit('SET_RES_VER', {ver: res.body, server: 'jp'})
  const res2 = await Vue.apiClient.getResVer('tw')
  commit('SET_RES_VER', {ver: res2.body, server: 'tw'})
  return res.body
}

export const getMasterVersion = async ({commit, state}) => {
  if (state.masterVer) return state.masterVer
  const res = await Vue.apiClient.getMasterVer()
  commit('SET_MASTER_VER', res.body)
  return res.body
}
