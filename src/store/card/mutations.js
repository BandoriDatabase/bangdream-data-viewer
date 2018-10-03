export const SET_CARD_LIST = (state, { data, params, server }) => {
  // check params and set data in correct position
  if (!params) state.cardList[server] = data
  else {
    const startIndex = params.limit * (params.page - 1)
    state.cardList[server].splice(startIndex, params.limit, ...data)
  }
}

export const ADD_CARD_MAP_ENTRY = (state, obj) => {
  state.cardMap[obj.server][obj.id] = obj.value
}

export const SET_SKILL_LIST = (state, { data, server }) => {
  state.skillList[server] = data
}

export const ADD_SKILL_MAP_ENTRY = (state, obj) => {
  state.skillMap[obj.server][obj.id] = obj.value
}

export const ADD_MULTI_CARD_MAP = (state, obj) => {
  Object.assign(state.cardMap[obj.server], obj.cardMap)
}
