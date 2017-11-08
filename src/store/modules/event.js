import apiDBInfo from 'api/dbinfo'

const initState = {
  currentEvent: {},
  eventBadgeMap: {},
  degreeMap: {}
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getCurrentEvent ({commit, state}) {
    if (state.currentEvent.eventId) return state.currentEvent
    const event = await apiDBInfo.getEvent()
    commit('SET_CURR_EVENT', event)
    return event
  },
  async getEventBadgeById ({commit, state}, eventId) {
    if (state.eventBadgeMap[eventId]) return state.eventBadgeMap[eventId]
    const eventBadge = await apiDBInfo.getEventBadgeById(eventId)
    commit('ADD_EVENT_BADGE_MAP_ENTRY', {id: eventId, value: eventBadge})
    return eventBadge
  },
  async getDegreeById ({commit, state}, id) {
    if (state.degreeMap[id]) return state.degreeMap[id]
    const degree = await apiDBInfo.getDegreeById(id)
    commit('ADD_DEGREE_MAP_ENTRY', {id, value: degree})
    return degree
  }
}

const mutations = {
  SET_CURR_EVENT (state, event) {
    state.currentEvent = event
  },
  ADD_EVENT_BADGE_MAP_ENTRY (state, obj) {
    state.eventBadgeMap[obj.id] = obj.value
  },
  ADD_DEGREE_MAP_ENTRY (state, obj) {
    state.degreeMap[obj.id] = obj.value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
