import db from '../../db'

const curreventdb = db.currevent
const degreedb = db.degree
const eventitemdb = db.eventitem

export const SET_CURR_EVENT = (state, { event, server }) => {
  state.currentEvent[server] = event

  curreventdb.put(Object.assign({}, event, { server }))
}

export const ADD_EVENT_BADGE_MAP_ENTRY = (state, { server, id, value }) => {
  state.eventItemMap[server][id] = value

  eventitemdb.put(Object.assign({}, value, { server }))
}

export const ADD_DEGREE_MAP_ENTRY = (state, { server, id, value }) => {
  state.degreeMap[server][id] = value

  degreedb.put(Object.assign({}, value, { server }))
}
