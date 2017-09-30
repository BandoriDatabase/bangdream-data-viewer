<template>
  <div v-if="skillMap && cardInfos && characterInfos">
    <p>Hint: <span class="desktop-only">Click</span><span class="mobile-only">Touch</span> card image to show full screen image.</p>
    <card :cardInfo="cardInfo" :characterInfo="characterInfo" :skillID="Number(skillMap[cardInfo.cardID].skillID)" :skillName="skillMap[cardInfo.cardID].skillName"></card>
    <div class="comments">
      <vue-disqus shortname="bandori-database" :identifier="`card_${$route.params.cardID}`" :title="`card_${$route.params.cardID}`"></vue-disqus>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueDisqus from 'vue-disqus/VueDisqus.vue'
import Card from './common/Card'

export default {
  name: 'CardDetailComponent',
  components: {
    Card,
    VueDisqus
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
      return this.cardInfos[this.$route.params.cardID]
    },
    characterInfo () {
      if (!this.characterInfos || !this.cardInfo) return {}
      return this.characterInfos[this.cardInfo.characterID]
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
