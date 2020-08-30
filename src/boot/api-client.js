// import something here

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  Vue.apiClient = Vue.prototype.$api = {
    getEvent (server) {
      return Vue.http.get(`/api/v1/${server}/event`)
        .then(res => res.json())
    },
    getEventId (server) {
      return Vue.http.get(`/api/v2/${server}/event/currid`)
        .then(res => res.json())
    },
    getCardById (id, server) {
      return Vue.http.get(`/api/v1/${server}/card/${id}`)
        .then(res => res.json())
    },
    getSkillByCardId (id, server) {
      return Vue.http.get(`/api/v2/${server}/skill/bycard/${id}`)
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
      return Vue.http.get(`/api/v2/${server}/skill`)
        .then(res => res.json())
    },
    getSkillDetail (id, server) {
      return Vue.http.get(`/api/v2/${server}/skill/${id}`)
        .then(res => res.json())
    },
    getCardsBySkillId (id, server) {
      return Vue.http.get(`/api/v2/${server}/skill/${id}/cards`)
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
    },
    getBand (server) {
      return Vue.http.get(`/api/v1/${server}/band`)
        .then(res => res.json())
    },
    getCharaLive2d (server, charaId) {
      return Vue.http.get(`/api/v1/${server}/live2d/chara/${charaId}`)
        .then(res => res.json())
    },
    getLive2dModel (server, id) {
      return Vue.http.get(`/api/v1/${server}/live2d/model/${id}`)
        .then(res => res.json())
    },
    getScenarioInfo (server, type, name) {
      return Vue.http.get(`/api/v1/${server}/scenario/${type}/${name}`)
        .then(res => res.json())
    },
    getBirthday (server) {
      return Vue.http.get(`/api/v1/${server}/chara/birthday`)
        .then(res => res.json())
    },
    getCards (server, cardIds) {
      return Vue.http.post(`/api/v1/${server}/card/batch`, cardIds)
        .then(res => res.json())
    },
    getCostumeById (server, costumeId) {
      return Vue.http.get(`/api/v1/${server}/live2d/costume/${costumeId}`)
        .then(res => res.json())
    },
    getTitles (server) {
      return Vue.http.get(`/assets/${server}/title/`).then(res => res.json())
    }
  }
}
