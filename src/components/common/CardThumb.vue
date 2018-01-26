<template>
  <lazy-component @show="loadData">
    <div class="card-img-parent" v-if="isReady" @click="() => {
        $emit('close');
        $router.push({ name: 'cardDetail', params: { cardId: cardMap[server][cardId].cardId, server, isTrained: 0 } });
      }">
      <div class="thumb-table" v-lazy:background-image="`/assets/thumb/chara/card0000${Math.trunc(Number(cardMap[server][cardId].cardId) / 50)}_${cardMap[server][cardId].cardRes}_normal.png`"></div>
      <div :class="`thumb-frame-${getThumbFrame(Number(cardMap[server][cardId].rarity), cardMap[server][cardId].attr)}`"></div>
      <div :class="`thumb-attr-${cardMap[server][cardId].attr}`"></div>
    </div>
    <div class="card-img-parent" v-else>
      <q-inner-loading :visible="!isReady">
        <q-spinner-facebook color="pink" size="48px"></q-spinner-facebook>
      </q-inner-loading>
    </div>
  </lazy-component>
</template>

<script>
import {
  QSpinnerFacebook,
  QInnerLoading
} from 'quasar'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'cardThumbDiv',
  props: {
    cardId: {
      type: Number
    },
    server: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isReady: false
    }
  },
  components: {
    QSpinnerFacebook,
    QInnerLoading
  },
  computed: {
    ...mapState('card', [
      'cardMap'
    ])
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
    },
    loadData () {
      this.$nextTick(async () => {
        await this.getCardById({
          cardId: this.cardId,
          server: this.server
        })
        this.isReady = true
      })
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

thumb-frame(uri)
  width 80px
  height 80px
  background url(uri) no-repeat
  background-size cover
  left 0
  top 0

.thumb-frame-normal-happy
  position: absolute
  thumb-frame('/statics/thumb_frame_happy.png')

.thumb-frame-normal-pure
  position: absolute
  thumb-frame('/statics/thumb_frame_pure.png')

.thumb-frame-normal-cool
  position: absolute
  thumb-frame('/statics/thumb_frame_cool.png')

.thumb-frame-normal-powerful
  position: absolute
  thumb-frame('/statics/thumb_frame_powerful.png')

.thumb-frame-rare
  position: absolute
  thumb-frame('/statics/thumb_frame_silver.png')

.thumb-frame-sr
  position: absolute
  thumb-frame('/statics/thumb_frame_gold.png')

.thumb-frame-ssr
  position: absolute
  thumb-frame('/statics/thumb_frame_rainbow.png')

thumd-attr(uri)
  top 1%
  right 1%
  width 20px
  height 20px
  background url(uri) no-repeat
  background-size cover

.thumb-attr-powerful
  position: absolute
  thumd-attr('/statics/icon_powerful.png')

.thumb-attr-cool
  position: absolute
  thumd-attr('/statics/icon_cool.png')

.thumb-attr-happy
  position: absolute
  thumd-attr('/statics/icon_happy.png')

.thumb-attr-pure
  position: absolute
  thumd-attr('/statics/icon_pure.png')
</style>
