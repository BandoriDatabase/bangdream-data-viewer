import Vue from 'vue'

export const getCardList = async ({ commit, state }, { params, server }) => {
  if ((!params && state.cardList[server].length) ||
    (state.cardList[server][params.limit * (params.page - 1)] && state.cardList[server][params.limit * params.page])) {
    return
  }
  const cards = await Vue.apiClient.getCard(params, server)
  commit('SET_CARD_LIST', { data: cards.data, params, server })
  return cards
}

export const getCardById = async ({ commit, state }, { situationId, server }) => {
  if (state.cardMap[server][situationId]) return state.cardMap[server][situationId]
  const card = await Vue.apiClient.getCardById(situationId, server)
  commit('ADD_CARD_MAP_ENTRY', { id: situationId, value: card, server })
  return card
}

export const getSkillList = async ({ commit, state }, server) => {
  if (state.skillList[server].length) return state.skillList[server]
  const skills = await Vue.apiClient.getSkill(server)
  commit('SET_SKILL_LIST', { data: skills, server })
  return skills
}

export const getSkillById = async ({ commit, state }, { situationId, server }) => {
  if (state.skillMap[server][situationId]) return state.skillMap[server][situationId]
  const skill = await Vue.apiClient.getSkillByCardId(situationId, server)
  commit('ADD_SKILL_MAP_ENTRY', { id: situationId, value: skill, server })
}

export const getBatchCards = async ({ commit, state }, { situationIds, server }) => {
  const reqCardIds = situationIds.filter(id => !state.cardMap[server][id])
  const resCards = await Vue.apiClient.getCards(server, reqCardIds)
  commit('ADD_MULTI_CARD_MAP', { cardMap: resCards, server })
}
