import { servers } from '../../constants'
const state = {}

state.ffcList = servers.reduce((sum, curr) => {
  sum[curr] = []
  return sum
}, {})

export default state
