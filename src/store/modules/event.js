import apiDBInfo from 'api/dbinfo'

const initState = {
  currentEvent: {
    jp: {},
    tw: {}
  },
  eventBadgeMap: {
    jp: {},
    tw: {}
  },
  degreeMap: {
    jp: {},
    tw: {}
  }
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getCurrentEvent ({commit, state}, server) {
    if (state.currentEvent[server].eventId) return state.currentEvent[server]
    const event = await apiDBInfo.getEvent(server)
    commit('SET_CURR_EVENT', { event, server })
    return event
  },
  async getEventBadgeById ({commit, state}, { server, eventId }) {
    if (state.eventBadgeMap[server][eventId]) return state.eventBadgeMap[server][eventId]
    const eventBadge = await apiDBInfo.getEventBadgeById(eventId, server)
    commit('ADD_EVENT_BADGE_MAP_ENTRY', {server, id: eventId, value: eventBadge})
    return eventBadge
  },
  async getDegreeById ({commit, state}, { server, id }) {
    if (state.degreeMap[id]) return state.degreeMap[id]
    const degree = await apiDBInfo.getDegreeById(id, server)
    commit('ADD_DEGREE_MAP_ENTRY', {server, id, value: degree})
    return degree
  }
}

const mutations = {
  SET_CURR_EVENT (state, { event, server }) {
    state.currentEvent[server] = event
  },
  ADD_EVENT_BADGE_MAP_ENTRY (state, { server, id, value }) {
    state.eventBadgeMap[server][id] = value
  },
  ADD_DEGREE_MAP_ENTRY (state, { server, id, value }) {
    state.degreeMap[server][id] = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
