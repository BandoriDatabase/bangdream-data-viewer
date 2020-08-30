import { servers } from '../../constants'
import db from '../../db'

const charadb = db.chara
const bandcharadb = db.bandchara
const state = {}

state.bandCharaList = servers.reduce((sum, curr) => {
  sum[curr] = []
  return sum
}, {})
state.charaList = servers.reduce((sum, curr) => {
  sum[curr] = []
  return sum
}, {})
state.charaMap = servers.reduce((sum, curr) => {
  sum[curr] = {}
  return sum
}, {})

charadb.toArray().then(charas => {
  servers.forEach(server => {
    state.charaList[server] = charas.filter(chara => chara.server === server)
    state.charaList[server].sort((a, b) => a.characterId - b.characterId)

    state.charaMap[server] = charas.reduce((obj, item) => {
      obj[item.characterId] = item
      return obj
    }, {})
  })
})

bandcharadb.toArray().then(bandcharas => {
  servers.forEach(server => {
    state.bandCharaList[server] = bandcharas.filter(bandchara => bandchara.server === server)
    state.bandCharaList[server].sort((a, b) => a.characterId - b.characterId)
  })
})

export default state
