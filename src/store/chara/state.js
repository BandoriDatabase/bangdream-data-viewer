import Vue from 'vue'

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

    state.charaMap[server] = charas.filter(chara => chara.server === server).reduce((obj, item) => {
      obj[item.characterId] = item
      return obj
    }, {})
  })
})

bandcharadb.toArray().then(bandcharas => {
  servers.forEach(server => {
    // validate with remote
    state.bandCharaList[server] = bandcharas.filter(bandchara => bandchara.server === server)
    state.bandCharaList[server].sort((a, b) => a.characterId - b.characterId)
    if (state.bandCharaList[server].length) {
      Vue.apiClient.getBandChara(server).then(charas => {
        if (charas.length !== state.bandCharaList[server].length) {
          state.bandCharaList[server] = charas
          state.bandCharaList[server].sort((a, b) => a.characterId - b.characterId)
          charas.forEach(bandchara => {
            bandcharadb.get({ characterId: bandchara.characterId, server }).then((_bandchara) => {
              if (!_bandchara) bandcharadb.put(Object.assign({}, bandchara, { server }))
            })
          })
        }
      })
    }
  })
})

export default state
