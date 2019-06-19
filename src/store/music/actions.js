import Vue from 'vue'

export const getMusicList = async ({ commit, state }, { params, server }) => {
  if ((!params && state.musicList[server].length) ||
    (state.musicList[server][params.limit * (params.page - 1)] && state.musicList[params.limit * params.page])) {
    return state.musicList[server]
  }
  const musics = await Vue.apiClient.getMusic(params, server)
  commit('SET_MUSIC_LIST', { data: musics.data, params, server })
  return musics
}

export const getMusicById = async ({ commit, state }, { musicId, server }) => {
  if (state.musicMap[server][musicId]) return state.musicMap[server][musicId]
  const music = await Vue.apiClient.getMusicById(musicId, server)
  commit('ADD_MUSIC_MAP_ENTRY', { id: musicId, value: music, server })
  return music
}

export const initState = {
  root: true,
  handler ({ commit }, servers) {
    commit('INIT_STATE_DATA', servers)
  }
}
