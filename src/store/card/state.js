import { servers } from '../../constants'
import db from '../../db'

const carddb = db.card
const skilldb = db.skill
const state = {}

state.cardList = servers.reduce((sum, curr) => {
  sum[curr] = []
  return sum
}, {})
state.cardMap = servers.reduce((sum, curr) => {
  sum[curr] = {}
  return sum
}, {})
state.skillList = servers.reduce((sum, curr) => {
  sum[curr] = []
  return sum
}, {})
state.skillMap = servers.reduce((sum, curr) => {
  sum[curr] = {}
  return sum
}, {})

carddb.toArray().then(cards => {
  servers.forEach(server => {
    state.cardList[server] = cards.filter(card => card.server === server)
    state.cardList[server].sort((a, b) => a.situationId - b.situationId)

    state.cardMap[server] = state.cardList[server].reduce((obj, item) => {
      obj[item.situationId] = item
      return obj
    }, {})
  })
})

skilldb.toArray().then(skills => {
  servers.forEach(server => {
    state.skillList = skills.filter(skill => skill.server === server)
    state.skillList.sort((a, b) => a.skillId - b.skillId)

    state.skillMap[server] = state.skillList.reduce((obj, item) => {
      obj[item.skillId] = item
      return obj
    }, {})
  })
})

export default state
