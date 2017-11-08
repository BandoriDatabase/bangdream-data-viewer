import apiDBInfo from 'api/dbinfo'

const initState = {
  cardList: [],
  cardMap: {},
  skillList: [],
  skillMap: {}
}

const state = Object.assign({}, initState)

const getters = {
}

const actions = {
  async getCardList ({commit, state}, params) {
    if ((!params && state.cardList.length) ||
      (state.cardList[params.limit * (params.page - 1)] && state.cardList[params.limit * params.page])) {
      return
    }
    const cards = await apiDBInfo.getCard(params)
    commit('SET_CARD_LIST', { data: cards.data, params })
    return cards
  },
  async getCardById ({commit, state}, cardId) {
    if (state.cardMap[cardId]) return state.cardMap[cardId]
    const card = await apiDBInfo.getCardById(cardId)
    commit('ADD_CARD_MAP_ENTRY', {id: cardId, value: card})
    return card
  },
  async getSkillList ({commit, state}) {
    if (state.skillList.length) return state.skillList
    const skills = await apiDBInfo.getSkill()
    commit('SET_SKILL_LIST', skills)
    return skills
  },
  async getSkillById ({commit, state}, cardId) {
    if (state.skillMap[cardId]) return state.skillMap[cardId]
    const skill = await apiDBInfo.getSkillByCardId(cardId)
    commit('ADD_SKILL_MAP_ENTRY', {id: cardId, value: skill})
  }
}

const mutations = {
  SET_CARD_LIST (state, { data, params }) {
    // check params and set data in correct position
    if (!params) state.cardList = data
    else {
      const startIndex = params.limit * (params.page - 1)
      state.cardList.splice(startIndex, params.limit, ...data)
    }
  },
  ADD_CARD_MAP_ENTRY (state, obj) {
    state.cardMap[obj.id] = obj.value
  },
  SET_SKILL_LIST (state, skills) {
    state.skillList = skills
  },
  ADD_SKILL_MAP_ENTRY (state, obj) {
    state.skillMap[obj.id] = obj.value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
