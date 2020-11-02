import db from '../../db'

const charadb = db.chara
const bandcharadb = db.bandchara

export const SET_CHARA_LIST = async (state, { data, server }) => {
  state.charaList[server] = data
}

export const SET_BAND_CHARA_LIST = async (state, { data, server }) => {
  state.bandCharaList[server] = data

  data.forEach(bandchara => {
    bandcharadb.get({ characterId: bandchara.characterId, server }).then((_bandchara) => {
      if (!_bandchara) bandcharadb.put(Object.assign({}, bandchara, { server }))
    })
  })
}

export const ADD_CHARA_MAP_ENTRY = async (state, obj) => {
  state.charaMap[obj.server][obj.id] = obj.value

  charadb.put(Object.assign({}, obj.value, { server: obj.server }))
}
