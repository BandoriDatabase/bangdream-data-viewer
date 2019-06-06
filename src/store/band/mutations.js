export const SET_BAND_LIST = (state, { data, server }) => {
  state.bandList[server] = data
}

export const INIT_STATE_DATA = (state, servers) => {
  state.bandList = servers.reduce((sum, curr) => {
    sum[curr] = []
    return sum
  }, {})
  state.bandMap = servers.reduce((sum, curr) => {
    sum[curr] = {}
    return sum
  }, {})
}
