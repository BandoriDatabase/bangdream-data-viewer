/*
export const someMutation = (state) => {}
 */

export const SET_RES_VER = (state, { ver, server }) => {
  state.resVer[server] = ver
}

export const SET_MASTER_VER = (state, ver) => {
  state.masterVer = ver
}

export const INIT_STATE_DATA = (state, servers) => {
  state.resVer = servers.reduce((sum, curr) => {
    sum[curr] = ''
    return sum
  }, {})
}
