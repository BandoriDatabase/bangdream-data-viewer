<template>
  <div>
    <p>Hint: <span class="desktop-only">Click</span><span class="mobile-only">Touch</span> card image to show full screen image.</p>
    <card :cardInfo="cardInfo" :characterInfo="characterInfo" :skillId="Number(skillMap[cardInfo.cardID].skillID)" :skillName="skillMap[cardInfo.cardID].skillName"></card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from './common/Card'

export default {
  name: 'CardDetailComponent',
  components: {
    Card
  },
  computed: {
    ...mapGetters('DB', [
      'cardInfos',
      'characterInfos',
      'skillMap'
    ]),
    cardInfo () {
      if (!this.cardInfos) return {}
      return this.cardInfos[this.$route.params.cardID]
    },
    characterInfo () {
      if (!this.characterInfos) return {}
      return this.characterInfos[this.cardInfo.characterId]
    }
  }
}
</script>

<style lang="stylus">

</style>
