import Vue from 'vue'

export default {
  // getMasterDB () {
  //   return Vue.http.get('static/MasterDB.json')
  // },
  // getLive2DDB () {
  //   return Vue.http.get('static/live2d.json')
  // },
  getEvent (server) {
    return Vue.http.get(`/api/v1/${server}/event`)
      .then(res => res.json())
  },
  getCardById (id, server) {
    return Vue.http.get(`/api/v1/${server}/card/${id}`)
      .then(res => res.json())
  },
  getSkillByCardId (id, server) {
    return Vue.http.get(`/api/v1/${server}/skill/cardId/${id}`)
      .then(res => res.json())
  },
  getCard (params, server) {
    return Vue.http.get(`/api/v1/${server}/card`, { params })
      .then(res => res.json())
  },
  getChara (params, server) {
    return Vue.http.get(`/api/v1/${server}/chara`, { params })
      .then(res => res.json())
  },
  getBandChara (server) {
    return Vue.http.get(`/api/v1/${server}/chara/band`)
      .then(res => res.json())
  },
  getCharaById (id, server) {
    return Vue.http.get(`/api/v1/${server}/chara/${id}`)
      .then(res => res.json())
  },
  getStamp (server) {
    return Vue.http.get(`/api/v1/${server}/stamp`)
      .then(res => res.json())
  },
  getStampById (id, server) {
    return Vue.http.get(`/api/v1/${server}/stamp/${id}`)
      .then(res => res.json())
  },
  getGacha (server) {
    return Vue.http.get(`/api/v1/${server}/gacha`)
      .then(res => res.json())
  },
  getGachaById (id, server) {
    return Vue.http.get(`/api/v1/${server}/gacha/${id}`)
      .then(res => res.json())
  },
  getGachaCurrent (server) {
    return Vue.http.get(`/api/v1/${server}/gacha/current`)
      .then(res => res.json())
  },
  getResVer (server) {
    return Vue.http.get(`/api/v1/${server}/version/res`)
  },
  getSkill (server) {
    return Vue.http.get(`/api/v1/${server}/skill`)
      .then(res => res.json())
  },
  getCardsBySkillId (id, server) {
    return Vue.http.get(`/api/v1/${server}/skill/${id}`)
      .then(res => res.json())
  },
  getSingleFrameCartoon (server) {
    return Vue.http.get(`/api/v1/${server}/sfc`)
      .then(res => res.json())
  },
  getEventBadgeById (id, server) {
    return Vue.http.get(`/api/v1/${server}/event/badge/${id}`)
      .then(res => res.json())
  },
  getDegreeById (id, server) {
    return Vue.http.get(`/api/v1/${server}/degree/${id}`)
      .then(res => res.json())
  },
  getMusic (params, server) {
    return Vue.http.get(`/api/v1/${server}/music`, { params })
      .then(res => res.json())
  },
  getMusicById (id, server) {
    return Vue.http.get(`/api/v1/${server}/music/${id}`)
      .then(res => res.json())
  }
}
