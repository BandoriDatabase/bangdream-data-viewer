import apiDBInfo from 'api/dbinfo'

const initState = {
  musicList: {
    jp: [],
    tw: []
  },
  musicMap: {
    jp: {},
    tw: {}
  }
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getMusicList ({commit, state}, {params, server}) {
    if ((!params && state.musicList[server].length) ||
      (state.musicList[server][params.limit * (params.page - 1)] && state.musicList[params.limit * params.page])) {
      return state.musicList[server]
    }
    const musics = await apiDBInfo.getMusic(params, server)
    commit('SET_MUSIC_LIST', { data: musics.data, params, server })
    return musics
  },
  async getMusicById ({commit, state}, {musicId, server}) {
    if (state.musicMap[server][musicId]) return state.musicMap[server][musicId]
    const music = await apiDBInfo.getMusicById(musicId, server)
    commit('ADD_MUSIC_MAP_ENTRY', {id: musicId, value: music, server})
    return music
  }
}

const mutations = {
  SET_MUSIC_LIST (state, { data, params, server }) {
    // check params and set data in correct position
    if (!params) state.musicList[server] = data
    else {
      const startIndex = params.limit * (params.page - 1)
      state.musicList[server].splice(startIndex, params.limit, ...data)
    }
  },
  ADD_MUSIC_MAP_ENTRY (state, obj) {
    state.musicMap[obj.server][obj.id] = obj.value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
