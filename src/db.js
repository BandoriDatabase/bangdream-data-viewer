import Dexie from 'dexie'

const db = new Dexie('api-data-cache')

db.version(1).stores({
  card: '[situationId+server]',
  music: '[musicId+server]',
  band: '[bandId+server]',
  chara: '[characterId+server]',
  bandchara: '[characterId+server]',
  degree: '[degreeId+server]',
  gacha: '[gachaId+server]',
  currevent: 'server',
  event: '[eventId+server]',
  eventitem: '[eventItemId+server]',
  sfc: '[sfcId+server]',
  skill: '[skillId+server]',
  cardSkill: '[situationSkillId+server]',
  stamp: '[stampId+server]',
  birthday: 'server'
})

export default db
