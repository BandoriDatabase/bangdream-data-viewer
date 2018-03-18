export const SET_BAND_LIST = (state, { data, server }) => {
  state.bandList[server] = data
}
