import { servers } from '../../constants'
const state = {}

state.sfcList = servers.reduce((sum, curr) => {
  sum[curr] = []
  return sum
}, {})

export default state
