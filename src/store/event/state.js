import { servers } from '../../constants'
const state = {}

state.currentEvent = servers.reduce((sum, curr) => {
  sum[curr] = {}
  return sum
}, {})
state.eventItemMap = servers.reduce((sum, curr) => {
  sum[curr] = {}
  return sum
}, {})
state.degreeMap = servers.reduce((sum, curr) => {
  sum[curr] = {}
  return sum
}, {})

export default state
