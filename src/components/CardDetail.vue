<template>
  <div v-if="skillMap && cardInfos && characterInfos">
    <p>Hint: <span class="desktop-only">Click</span><span class="mobile-only">Touch</span> card image to show full screen image.</p>
    <card :cardInfo="cardInfo" :characterInfo="characterInfo" :skillId="Number(skillMap[cardInfo.cardId].skillId)" :skillName="skillMap[cardInfo.cardId].skillName"></card>
    <!-- <div class="comments">
      <vue-disqus shortname="bandori-database" :identifier="`card_${$route.params.cardId}`" :title="`card_${$route.params.cardId}`"></vue-disqus>
    </div> -->
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
      // console.log(this.$route)
      return this.cardInfos[this.$route.params.cardId]
    },
    characterInfo () {
      if (!this.characterInfos || !this.cardInfo) return {}
      return this.characterInfos[this.cardInfo.characterId]
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
