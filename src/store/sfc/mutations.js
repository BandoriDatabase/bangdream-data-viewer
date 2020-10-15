export const SET_SFC_LIST = (state, { data, server }) => {
  state.sfcList[server] = data
}

export const APPEND_SFC_LIST = (state, { data, server }) => {
  state.sfcList[server] = [...state.sfcList[server], ...data]
}

export const CLEAR_SFC_LIST = (state, server) => {
  state.sfcList[server] = []
}

export const INIT_STATE_DATA = (state, servers) => {
  // state.sfcList = servers.reduce((sum, curr) => {
  //   sum[curr] = []
  //   return sum
  // }, {})
}
