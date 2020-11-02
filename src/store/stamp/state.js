import { servers } from '../../constants'
const state = {}

state.stampList = servers.reduce((sum, curr) => {
  sum[curr] = []
  return sum
}, {})

state.stampMap = servers.reduce((sum, curr) => {
  sum[curr] = []
  return sum
}, {})

export default state
