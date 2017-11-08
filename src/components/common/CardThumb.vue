<template>
  <div class="shadow-1 shadow-transition hoverable-3 card-img-parent" v-if="readyToShow" @click="$router.push({ name: 'cardDetail', params: { cardId: cardMap[cardId].cardId } })">
    <div class="thumb-table" v-lazy:background-image="`/assets/thumb/chara/card0000${Math.trunc(Number(cardMap[cardId].cardId) / 50)}_${cardMap[cardId].cardRes}_normal.png`"></div>
    <div :class="`thumb-frame-${getThumbFrame(Number(cardMap[cardId].rarity), cardMap[cardId].attr)}`"></div>
    <div :class="`thumb-attr-${cardMap[cardId].attr}`"></div>
  </div>
  <div v-else>
    <q-spinner color="pink" size="48px"></q-spinner>
  </div>
</template>

<script>
import {
  QSpinner
} from 'quasar'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'cardThumbDiv',
  props: {
    cardId: {
      type: Number
    }
  },
  data () {
    return {
      readyToShow: false
    }
  },
  components: {
    QSpinner
  },
  computed: {
    ...mapState('card', [
      'cardMap'
    ])
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getCardById(this.cardId)
      this.readyToShow = true
    })
  },
  methods: {
    ...mapActions('card', [
      'getCardById'
    ]),
    getThumbFrame (rarity, attr) {
      switch (rarity) {
        case 1:
          return `normal-${attr}`
        case 2:
          return 'rare'
        case 3:
          return 'sr'
        case 4:
          return 'ssr'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.card-img-parent
  width 80px
  height 80px
  margin 3px 3px
  position relative
  cursor pointer

.thumb-table
  position absolute
  width 72px
  height 72px
  background-size cover
  left 4px
  top 4px

.thumb-frame-normal-happy
  position: absolute
  width 80px
  height 80px
  background url('/statics/thumb_frame_happy.png') no-repeat
  background-size cover
  left 0
  top 0

.thumb-frame-normal-pure
  position: absolute
  width 80px
  height 80px
  background url('/statics/thumb_frame_pure.png') no-repeat
  background-size cover
  left 0
  top 0

.thumb-frame-normal-cool
  position: absolute
  width 80px
  height 80px
  background url('/statics/thumb_frame_cool.png') no-repeat
  background-size cover
  left 0
  top 0

.thumb-frame-normal-powerful
  position: absolute
  width 80px
  height 80px
  background url('/statics/thumb_frame_powerful.png') no-repeat
  background-size cover
  left 0
  top 0

.thumb-frame-rare
  position: absolute
  width 80px
  height 80px
  background url('/statics/thumb_frame_silver.png') no-repeat
  background-size cover
  left 0
  top 0

.thumb-frame-sr
  position: absolute
  width 80px
  height 80px
  background url('/statics/thumb_frame_gold.png') no-repeat
  background-size cover
  left 0
  top 0

.thumb-frame-ssr
  position: absolute
  width 80px
  height 80px
  background url('/statics/thumb_frame_rainbow.png') no-repeat
  background-size cover
  left 0
  top 0

.thumb-attr-powerful
  position: absolute
  top 1%
  right 1%
  width 20px
  height 20px
  background url('/statics/icon_powerful.png') no-repeat
  background-size cover

.thumb-attr-cool
  position: absolute
  top 1%
  right 1%
  width 20px
  height 20px
  background url('/statics/icon_cool.png') no-repeat
  background-size cover

.thumb-attr-happy
  position: absolute
  top 1%
  right 1%
  width 20px
  height 20px
  background url('/statics/icon_happy.png') no-repeat
  background-size cover

.thumb-attr-pure
  position: absolute
  top 1%
  right 1%
  width 20px
  height 20px
  background url('/statics/icon_pure.png') no-repeat
  background-size cover
</style>
