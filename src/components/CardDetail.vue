<template>
  <div v-if="isReady">
    <p>Hint: <span class="desktop-only">Click</span><span class="mobile-only">Touch</span> card image to show full screen image.</p>
    <card :cardInfo="cardMap[$route.params.cardId]" :characterInfo="charaInfo"
      :skillInfo="skillMap[$route.params.cardId]"></card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Card from './common/Card'

export default {
  name: 'CardDetailComponent',
  components: {
    Card
  },
  data () {
    return {
      isReady: false,
      charaInfo: null
    }
  },
  mounted () {
    this.$nextTick(async () => {
      const card = await this.getCardById(this.$route.params.cardId)
      await this.getSkillById(card.cardId)
      this.charaInfo = await this.getCharaById(card.characterId)
      this.isReady = true
    })
  },
  computed: {
    ...mapState('card', [
      'cardMap',
      'skillMap'
    ]),
    ...mapState('chara', [
      'charaMap'
    ])
  },
  methods: {
    ...mapActions('card', [
      'getCardById',
      'getSkillById'
    ]),
    ...mapActions('chara', [
      'getCharaById'
    ])
  }
}
</script>

<style lang="stylus" scoped>

</style>
