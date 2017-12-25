import apiDBInfo from 'api/dbinfo'

const initState = {
  voiceMap: {
    jp: {},
    tw: {}
  },
  costumMap: {
    jp: {},
    tw: {}
  },
  forceReload: false
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getCharaLive2d ({commit, state}, {server, charaId}) {
    if (state.voiceMap[server][charaId] && state.costumMap[server][charaId]) {
      return {
        voices: state.voiceMap[server][charaId],
        costums: state.costumMap[server][charaId]
      }
    }
    const charaLive2d = await apiDBInfo.getCharaLive2d(server, charaId)
    await commit('SET_CHARA_LIVE2D_ENTRY', { data: charaLive2d, server, charaId })
    return charaLive2d
  }
}

const mutations = {
  SET_CHARA_LIVE2D_ENTRY (state, { data, server, charaId }) {
    state.voiceMap[server][charaId] = data.voices
    state.costumMap[server][charaId] = data.costums
    state.forceReload = true
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
