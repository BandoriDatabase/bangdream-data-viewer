export const SET_SFC_LIST = (state, { data, server }) => {
  state.sfcList[server] = data
}
