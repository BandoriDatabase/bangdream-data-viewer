import { servers } from '../../constants'
import db from '../../db'

const banddb = db.band
const state = {}

state.bandList = servers.reduce((sum, curr) => {
  sum[curr] = []
  return sum
}, {})
state.bandMap = servers.reduce((sum, curr) => {
  sum[curr] = {}
  return sum
}, {})

banddb.toArray().then(bands => {
  servers.forEach(server => {
    state.bandList[server] = bands.filter(band => band.server === server)
    state.bandList[server].sort((a, b) => a.bandId - b.bandId)

    state.bandMap[server] = state.bandList[server].reduce((obj, item) => {
      obj[item.bandId] = item
      return obj
    }, {})
  })
})

export default state
