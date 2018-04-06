import Vue from 'vue'

export const getCurrentEvent = async ({commit, state}, server) => {
  if (state.currentEvent[server].eventId) return state.currentEvent[server]
  const event = await Vue.apiClient.getEvent(server)
  commit('SET_CURR_EVENT', { event, server })
  return event
}

export const getEventBadgeById = async ({commit, state}, { server, eventId }) => {
  if (state.eventBadgeMap[server][eventId]) return state.eventBadgeMap[server][eventId]
  const eventBadge = await Vue.apiClient.getEventBadgeById(eventId, server)
  commit('ADD_EVENT_BADGE_MAP_ENTRY', {server, id: eventId, value: eventBadge})
  return eventBadge
}

export const getDegreeById = async ({commit, state}, { server, id }) => {
  if (state.degreeMap[server][id]) return state.degreeMap[server][id]
  const degree = await Vue.apiClient.getDegreeById(id, server)
  commit('ADD_DEGREE_MAP_ENTRY', {server, id, value: degree})
  return degree
}
