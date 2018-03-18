/*
export const someMutation = (state) => {}
 */

export const SET_RES_VER = (state, {ver, server}) => {
  state.resVer[server] = ver
}

export const SET_MASTER_VER = (state, ver) => {
  state.masterVer = ver
}
