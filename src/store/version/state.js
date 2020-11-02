import { servers } from '../../constants'
const state = {}

state.resVer = servers.reduce((sum, curr) => {
  sum[curr] = ''
  return sum
}, {})

export default state
