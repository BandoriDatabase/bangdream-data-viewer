export const SET_CHARA_LIST = async (state, { data, server }) => {
  state.charaList[server] = data
}

export const SET_BAND_CHARA_LIST = async (state, { data, server }) => {
  state.bandCharaList[server] = data
}

export const ADD_CHARA_MAP_ENTRY = async (state, obj) => {
  state.charaMap[obj.server][obj.id] = obj.value
}

export const INIT_STATE_DATA = (state, servers) => {
  state.bandList = servers.reduce((sum, curr) => {
    sum[curr] = []
    return sum
  }, {})
  state.bandCharaList = servers.reduce((sum, curr) => {
    sum[curr] = []
    return sum
  }, {})
  state.charaList = servers.reduce((sum, curr) => {
    sum[curr] = []
    return sum
  }, {})
  state.charaMap = servers.reduce((sum, curr) => {
    sum[curr] = {}
    return sum
  }, {})
}
