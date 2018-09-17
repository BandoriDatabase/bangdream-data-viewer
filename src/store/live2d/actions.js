import Vue from 'vue'

export const getCharaLive2d = async ({commit, state}, {server, charaId}) => {
  if (state.voiceMap[server][charaId] && state.costumeMap[server][charaId]) {
    return {
      voices: state.voiceMap[server][charaId],
      costumes: state.costumeMap[server][charaId]
    }
  }
  const charaLive2d = await Vue.apiClient.getCharaLive2d(server, charaId)
  await commit('SET_CHARA_LIVE2D_ENTRY', { data: charaLive2d, server, charaId })
  return charaLive2d
}

export const setForceReload = ({commit}) => commit('SET_FORCE_RELOAD')
