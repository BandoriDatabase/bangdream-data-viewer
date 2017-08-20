import apiDBInfo from 'api/dbinfo'

const initState = {
  getMasterDBStatus: 0,
  getLive2DDBStatus: 0,
  master: {},
  live2d: {}
}

const state = Object.assign({}, initState)

const getters = {
  cardInfos (state) {
    if (!state.master.cardInfos) return null
    return Object.keys(state.master.cardInfos.entries)
      .reduce((prev, elem) => {
        const detail = {...state.master.cardInfos.entries[elem]}
        detail.maxLevel = Object.keys(detail.parameterMap).slice(-1)
        detail.maxPerformance = Number(detail.parameterMap[detail.maxLevel].performance)
        detail.maxTechnique = detail.parameterMap[detail.maxLevel].technique
        detail.maxVisual = detail.parameterMap[detail.maxLevel].visual
        prev[elem] = detail
        return prev
      }, {})
  },
  cardInfoList (state) {
    if (!state.master.cardInfos) return null
    return Object.keys(state.master.cardInfos.entries)
      .map(elem => {
        const detail = {...state.master.cardInfos.entries[elem]}
        detail.maxLevel = Object.keys(detail.parameterMap).slice(-1)
        detail.maxPerformance = Number(detail.parameterMap[detail.maxLevel].performance)
        detail.maxTechnique = detail.parameterMap[detail.maxLevel].technique
        detail.maxVisual = detail.parameterMap[detail.maxLevel].visual
        return detail
      })
  },
  eventMap (state) {
    if (!state.master.eventMap) return null
    return state.master.eventMap.entries
  },
  characterInfos (state) {
    if (!state.master.characterInfoMap) return null
    return state.master.characterInfoMap.entries
  },
  skillInfos (state) {
    if (!state.master.skillInfos) return null
    return state.master.skillInfos.entries
  },
  skillMap (state) {
    if (!state.master.skillMap) return null
    return state.master.skillMap.entries
  },
  skillEffects (state) {
    if (!state.master.skillEffects) return null
    return state.master.skillEffects.entries
  },
  judgeLists (state) {
    if (!state.master.judgeLists) return null
    return state.master.judgeLists.entries
  },
  musicList (state) {
    if (!state.master.musicList) return null
    return state.master.musicList.entries
  },
  bandMap (state) {
    if (!state.master.bandMap) return null
    return state.master.bandMap.entries
  },
  musicDifficultyList (state) {
    if (!state.master.musicDifficultyList) return null
    return state.master.musicDifficultyList.entries
  },
  homeBannerList (state) {
    if (!state.master.homeBannerList) return null
    return state.master.homeBannerList.entries
  },
  gachaMap (state) {
    if (!state.master.gachaMap) return null
    return state.master.gachaMap.entries
  },
  gachaList (state) {
    if (!state.master.gachaMap) return null
    return Object.keys(state.master.gachaMap.entries)
      .map(key => state.master.gachaMap.entries[key])
  },
  singleFrameCartoons (state) {
    if (!state.master.singleFrameCartoonList) return null
    return state.master.singleFrameCartoonList.entries
  }
}

const actions = {
  getMasterDB ({ commit }) {
    commit('GET_MASTERDB_REQUEST')
    return apiDBInfo.getMasterDB()
      .then(
        res => res.json(),
        err => err.json())
      .then(res => commit('GET_MASTERDB_SUCCESS', res))
      .catch(res => commit('GET_MASTERDB_FAILED', res))
  },
  getLive2D ({ commit }) {
    commit('GET_LIVE2DDB_REQUEST')
    return apiDBInfo.getLive2DDB()
      .then(
        res => res.json(),
        err => err.json())
      .then(res => commit('GET_LIVE2DDB_SUCCESS', res))
      .catch(res => commit('GET_MASTERDB_FAILED', res))
  }
}

const mutations = {
  GET_MASTERDB_REQUEST (state) {
    state.getMasterDBStatus = 1
  },
  GET_MASTERDB_SUCCESS (state, data) {
    state.getMasterDBStatus = 2
    state.master = data
  },
  GET_MASTERDB_FAILED (state) {
    state.getMasterDBStatus = 3
  },
  GET_LIVE2DDB_REQUEST (state) {
    state.getLive2DDBStatus = 1
  },
  GET_LIVE2DDB_SUCCESS (state, data) {
    state.getLive2DDBStatus = 2
    state.live2d = data
  },
  GET_LIVE2DDB_FAILED (state) {
    state.getLive2DDBStatus = 3
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
