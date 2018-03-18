export const SET_GACHA_LIST = (state, gachas) => {
  state.gachaList = gachas
}

export const SET_GACHA_CURRENT_LIST = (state, {data, server}) => {
  state.currentGachaList[server] = data
}

export const ADD_GACHA_ENTRY = (state, obj) => {
  state.gachaMap[obj.id] = obj.value
}
