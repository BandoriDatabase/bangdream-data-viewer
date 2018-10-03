export const SET_STAMP_LIST = (state, { stamps, server }) => {
  state.stampList[server] = stamps
}

export const ADD_STAMP_ENTRY = (state, obj) => {
  state.stampMap[obj.server][obj.id] = obj.value
}
