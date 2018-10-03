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

export const getCardById = async ({ commit, state }, { cardId, server }) => {
  if (state.cardMap[server][cardId]) return state.cardMap[server][cardId]
  const card = await Vue.apiClient.getCardById(cardId, server)
  commit('ADD_CARD_MAP_ENTRY', { id: cardId, value: card, server })
  return card
}

export const getSkillList = async ({ commit, state }, server) => {
  if (state.skillList[server].length) return state.skillList[server]
  const skills = await Vue.apiClient.getSkill(server)
  commit('SET_SKILL_LIST', { data: skills, server })
  return skills
}

export const getSkillById = async ({ commit, state }, { cardId, server }) => {
  if (state.skillMap[server][cardId]) return state.skillMap[server][cardId]
  const skill = await Vue.apiClient.getSkillByCardId(cardId, server)
  commit('ADD_SKILL_MAP_ENTRY', { id: cardId, value: skill, server })
}

export const getBatchCards = async ({ commit, state }, { cardIds, server }) => {
  const reqCardIds = cardIds.filter(id => !state.cardMap[server][id])
  const resCards = await Vue.apiClient.getCards(server, reqCardIds)
  commit('ADD_MULTI_CARD_MAP', { cardMap: resCards, server })
}
