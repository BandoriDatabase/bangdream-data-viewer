import Vue from 'vue'

export default {
  getMasterDB () {
    return Vue.http.get('static/MasterDB.json')
  },
  getLive2DDB () {
    return Vue.http.get('static/live2d.json')
  },
  getEvent () {
    return Vue.http.get('/api/v1/event')
      .then(res => res.json())
  },
  getCardById (id) {
    return Vue.http.get(`/api/v1/card/${id}`)
      .then(res => res.json())
  },
  getSkillByCardId (id) {
    return Vue.http.get(`/api/v1/skill/cardId/${id}`)
      .then(res => res.json())
  },
  getCard (params) {
    return Vue.http.get('/api/v1/card', { params })
      .then(res => res.json())
  },
  getChara (params) {
    return Vue.http.get('/api/v1/chara', { params })
      .then(res => res.json())
  },
  getBandChara () {
    return Vue.http.get('/api/v1/chara/band')
      .then(res => res.json())
  },
  getCharaById (id) {
    return Vue.http.get(`/api/v1/chara/${id}`)
      .then(res => res.json())
  },
  getStamp () {
    return Vue.http.get(`/api/v1/stamp`)
      .then(res => res.json())
  },
  getStampById (id) {
    return Vue.http.get(`/api/v1/stamp/${id}`)
      .then(res => res.json())
  },
  getGacha () {
    return Vue.http.get(`/api/v1/gacha`)
      .then(res => res.json())
  },
  getGachaById (id) {
    return Vue.http.get(`/api/v1/gacha/${id}`)
      .then(res => res.json())
  },
  getGachaCurrent () {
    return Vue.http.get(`/api/v1/gacha/current`)
      .then(res => res.json())
  },
  getResVer () {
    return Vue.http.get(`/api/v1/version/res`)
  },
  getSkill () {
    return Vue.http.get(`/api/v1/skill`)
      .then(res => res.json())
  },
  getCardsBySkillId (id) {
    return Vue.http.get(`/api/v1/skill/${id}`)
      .then(res => res.json())
  },
  getSingleFrameCartoon () {
    return Vue.http.get(`/api/v1/sfc`)
      .then(res => res.json())
  },
  getEventBadgeById (id) {
    return Vue.http.get(`/api/v1/event/badge/${id}`)
      .then(res => res.json())
  },
  getDegreeById (id) {
    return Vue.http.get(`/api/v1/degree/${id}`)
      .then(res => res.json())
  },
  getMusic (params) {
    return Vue.http.get('/api/v1/music', { params })
      .then(res => res.json())
  },
  getMusicById (id) {
    return Vue.http.get(`/api/v1/music/${id}`)
      .then(res => res.json())
  }
}
