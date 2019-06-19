export const SET_STAMP_LIST = (state, { stamps, server }) => {
  state.stampList[server] = stamps
}

export const ADD_STAMP_ENTRY = (state, obj) => {
  state.stampMap[obj.server][obj.id] = obj.value
}

export const INIT_STATE_DATA = (state, servers) => {
  state.stampList = servers.reduce((sum, curr) => {
    sum[curr] = []
    return sum
  }, {})
  state.stampMap = servers.reduce((sum, curr) => {
    sum[curr] = {}
    return sum
  }, {})
}
