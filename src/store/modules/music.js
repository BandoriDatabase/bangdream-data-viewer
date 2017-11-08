import apiDBInfo from 'api/dbinfo'

const initState = {
  musicList: [],
  musicMap: {}
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getMusicList ({commit, state}, params) {
    if ((!params && state.musicList.length) ||
      (state.musicList[params.limit * (params.page - 1)] && state.musicList[params.limit * params.page])) {
      return
    }
    const musics = await apiDBInfo.getMusic(params)
    commit('SET_MUSIC_LIST', { data: musics.data, params })
    return musics
  },
  async getMusicById ({commit, state}, musicId) {
    if (state.musicMap[musicId]) return state.musicMap[musicId]
    const music = await apiDBInfo.getMusicById(musicId)
    commit('ADD_MUSIC_MAP_ENTRY', {id: musicId, value: music})
    return music
  }
}

const mutations = {
  SET_MUSIC_LIST (state, { data, params }) {
    // check params and set data in correct position
    if (!params) state.musicList = data
    else {
      const startIndex = params.limit * (params.page - 1)
      state.musicList.splice(startIndex, params.limit, ...data)
    }
  },
  ADD_MUSIC_MAP_ENTRY (state, obj) {
    state.musicMap[obj.id] = obj.value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
