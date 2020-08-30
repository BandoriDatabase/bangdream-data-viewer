import db from '../../db'

const carddb = db.card
const skilldb = db.skill

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

  carddb.put(Object.assign({}, obj.value, { server: obj.server }))
}

export const SET_SKILL_LIST = (state, { data, server }) => {
  state.skillList[server] = data

  data.forEach(skill => {
    skilldb.get({ skillId: skill.skillId, server }).then(_skill => {
      if (!_skill) skilldb.put(Object.assign({}, skill, { server }))
    })
  })
}

export const ADD_SKILL_MAP_ENTRY = (state, obj) => {
  state.skillMap[obj.server][obj.id] = obj.value

  skilldb.put(Object.assign({}, obj.value, { server: obj.server }))
}

export const ADD_MULTI_CARD_MAP = (state, obj) => {
  Object.assign(state.cardMap[obj.server], obj.cardMap)

  obj.cardMap.values().forEach(card => {
    carddb.get({ situationId: card.situationId, server: obj.server }).then(_card => {
      if (!_card) carddb.put(Object.assign({}, card, { server: obj.server }))
    })
  })
}
