import Vue from 'vue'
import db from '../../db'
import { servers } from '../../constants'

const curreventdb = db.currevent
const degreedb = db.degree
const eventitemdb = db.eventitem

let curreventLoaded = servers.reduce((obj, item) => {
    obj[item] = false
    return obj
  }, {}), degreeLoaded = servers.reduce((obj, item) => {
    obj[item] = false
    return obj
  }, {}), eventItemLoaded = servers.reduce((obj, item) => {
    obj[item] = false
    return obj
  }, {})

export const getCurrentEvent = async ({ commit, state }, server) => {
  const isOnline = navigator.onLine
  if (!curreventLoaded[server]) {
    const events = await curreventdb.toArray()
    if (events.length && events.find(event => event.server === server)) {
      const event = events.find(event => event.server === server)
      if (isOnline) {
        const { eventId } = await Vue.apiClient.getEventId(server)
        if (event.eventId === eventId) {
          state.currentEvent[server] = event
        }
      } else {
        state.currentEvent[server] = event
      }
    }

    curreventLoaded[server] = true
  }
  if (state.currentEvent[server].eventId) return state.currentEvent[server]
  const event = await Vue.apiClient.getEvent(server)
  commit('SET_CURR_EVENT', { event, server })
  return event
}

export const getEventBadgeById = async ({ commit, state }, { server, eventId }) => {
  if (!eventItemLoaded[server]) {
    const eventItems = await eventitemdb.toArray()
    if (eventItems.length) {
      state.eventItemMap[server] = eventItems.filter(ei => ei.server === server).reduce((obj, item) => {
        obj[item.eventItemId] = item
        return obj
      }, {})
    }

    eventItemLoaded[server] = true
  }
  if (state.eventItemMap[server][eventId]) return state.eventItemMap[server][eventId]
  const eventBadge = await Vue.apiClient.getEventBadgeById(eventId, server)
  commit('ADD_EVENT_BADGE_MAP_ENTRY', { server, id: eventId, value: eventBadge })
  return eventBadge
}

export const getDegreeById = async ({ commit, state }, { server, id }) => {
  if (!degreeLoaded[server]) {
    const degrees = await degreedb.toArray()
    if (degrees.length) {
      state.degreeMap[server] = degrees.filter(degree => degree.server === server).reduce((obj, item) => {
        obj[item.degreeId] = item
        return obj
      }, {})
    }

    degreeLoaded[server] = true
  }
  if (state.degreeMap[server][id]) return state.degreeMap[server][id]
  const degree = await Vue.apiClient.getDegreeById(id, server)
  commit('ADD_DEGREE_MAP_ENTRY', { server, id, value: degree })
  return degree
}
