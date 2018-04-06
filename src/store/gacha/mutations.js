export const SET_GACHA_LIST = (state, {server, gachas}) => {
  state.gachaList[server] = gachas
}

export const SET_GACHA_CURRENT_LIST = (state, {data, server}) => {
  state.currentGachaList[server] = data
}

export const ADD_GACHA_ENTRY = (state, {server, obj}) => {
  state.gachaMap[server][obj.id] = obj.value
}
