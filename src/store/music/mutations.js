export const SET_MUSIC_LIST = (state, { data, params, server }) => {
  // check params and set data in correct position
  if (!params) state.musicList[server] = data
  else {
    const startIndex = params.limit * (params.page - 1)
    state.musicList[server].splice(startIndex, params.limit, ...data)
  }
}

export const ADD_MUSIC_MAP_ENTRY = (state, obj) => {
  state.musicMap[obj.server][obj.id] = obj.value
}

export const INIT_STATE_DATA = (state, servers) => {
  state.musicList = servers.reduce((sum, curr) => {
    sum[curr] = []
    return sum
  }, {})
  state.musicMap = servers.reduce((sum, curr) => {
    sum[curr] = {}
    return sum
  }, {})
}
