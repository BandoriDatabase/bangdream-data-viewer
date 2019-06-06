export const SET_CHARA_LIVE2D_ENTRY = (state, { data, server, charaId }) => {
  state.voiceMap[server][charaId] = data.voices
  state.costumeMap[server][charaId] = data.costumes
  // state.forceReload = true
}

export const SET_FORCE_RELOAD = (state) => {
  state.forceReload = true
}

export const INIT_STATE_DATA = (state, servers) => {
  state.voiceMap = servers.reduce((sum, curr) => {
    sum[curr] = {}
    return sum
  }, {})
  state.costumeMap = servers.reduce((sum, curr) => {
    sum[curr] = {}
    return sum
  }, {})
}
