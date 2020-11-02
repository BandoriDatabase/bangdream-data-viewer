export const SET_FFC_LIST = (state, { data, server }) => {
  state.ffcList[server] = data
}

export const APPEND_FFC_LIST = (state, { data, server }) => {
  state.ffcList[server] = [...state.ffcList[server], ...data]
}

export const CLEAR_FFC_LIST = (state, server) => {
  state.ffcList[server] = []
}

export const INIT_STATE_DATA = (state, servers) => {
  // state.ffcList = servers.reduce((sum, curr) => {
  //   sum[curr] = []
  //   return sum
  // }, {})
}
