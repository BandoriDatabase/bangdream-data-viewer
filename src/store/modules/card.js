import apiDBInfo from 'api/dbinfo'

const initState = {
  cardList: {
    jp: [],
    tw: []
  },
  cardMap: {
    jp: {},
    tw: {}
  },
  skillList: {
    jp: [],
    tw: []
  },
  skillMap: {
    jp: {},
    tw: {}
  }
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getCardList ({commit, state}, {params, server}) {
    if ((!params && state.cardList[server].length) ||
      (state.cardList[server][params.limit * (params.page - 1)] && state.cardList[server][params.limit * params.page])) {
      return
    }
    const cards = await apiDBInfo.getCard(params, server)
    commit('SET_CARD_LIST', { data: cards.data, params, server })
    return cards
  },
  async getCardById ({commit, state}, {cardId, server}) {
    if (state.cardMap[server][cardId]) return state.cardMap[server][cardId]
    const card = await apiDBInfo.getCardById(cardId, server)
    commit('ADD_CARD_MAP_ENTRY', {id: cardId, value: card, server})
    return card
  },
  async getSkillList ({commit, state}, server) {
    if (state.skillList[server].length) return state.skillList[server]
    const skills = await apiDBInfo.getSkill(server)
    commit('SET_SKILL_LIST', {data: skills, server})
    return skills
  },
  async getSkillById ({commit, state}, {cardId, server}) {
    if (state.skillMap[server][cardId]) return state.skillMap[server][cardId]
    const skill = await apiDBInfo.getSkillByCardId(cardId, server)
    commit('ADD_SKILL_MAP_ENTRY', {id: cardId, value: skill, server})
  }
}

const mutations = {
  SET_CARD_LIST (state, { data, params, server }) {
    // check params and set data in correct position
    if (!params) state.cardList[server] = data
    else {
      const startIndex = params.limit * (params.page - 1)
      state.cardList[server].splice(startIndex, params.limit, ...data)
    }
  },
  ADD_CARD_MAP_ENTRY (state, obj) {
    state.cardMap[obj.server][obj.id] = obj.value
  },
  SET_SKILL_LIST (state, {data, server}) {
    state.skillList[server] = data
  },
  ADD_SKILL_MAP_ENTRY (state, obj) {
    state.skillMap[obj.server][obj.id] = obj.value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
