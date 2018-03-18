export const SET_CHARA_LIVE2D_ENTRY = (state, { data, server, charaId }) => {
  state.voiceMap[server][charaId] = data.voices
  state.costumMap[server][charaId] = data.costums
  state.forceReload = true
}
