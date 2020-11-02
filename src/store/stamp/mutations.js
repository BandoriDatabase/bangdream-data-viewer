export const SET_STAMP_LIST = (state, { stamps, server }) => {
  state.stampList[server] = stamps
}

export const APPEND_STAMP_LIST = (state, { stamps, server }) => {
  state.stampList[server] = [...state.stampList[server], ...stamps]
}

export const CLEAR_STAMP_LIST = (state, server) => {
  state.stampList[server] = []
}

export const ADD_STAMP_ENTRY = (state, obj) => {
  state.stampMap[obj.server][obj.id] = obj.value
}

export const INIT_STATE_DATA = (state, servers) => {
  // state.stampList = servers.reduce((sum, curr) => {
  //   sum[curr] = []
  //   return sum
  // }, {})
  // state.stampMap = servers.reduce((sum, curr) => {
  //   sum[curr] = {}
  //   return sum
  // }, {})
}
