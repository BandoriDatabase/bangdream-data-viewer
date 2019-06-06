export const SET_CURR_EVENT = (state, { event, server }) => {
  state.currentEvent[server] = event
}

export const ADD_EVENT_BADGE_MAP_ENTRY = (state, { server, id, value }) => {
  state.eventBadgeMap[server][id] = value
}

export const ADD_DEGREE_MAP_ENTRY = (state, { server, id, value }) => {
  state.degreeMap[server][id] = value
}

export const INIT_STATE_DATA = (state, servers) => {
  state.currentEvent = servers.reduce((sum, curr) => {
    sum[curr] = {}
    return sum
  }, {})
  state.eventBadgeMap = servers.reduce((sum, curr) => {
    sum[curr] = {}
    return sum
  }, {})
  state.degreeMap = servers.reduce((sum, curr) => {
    sum[curr] = {}
    return sum
  }, {})
}
