<template>
  <lazy-component @show="loadData">
    <div class="card-img-parent" v-if="isReady" @click="() => {
        $emit('close');
        $router.push(`/card/${server}/${(card || cardMap[server][cardId]).cardId}/${Number(trained)}`);
      }">
      <div class="thumb-table" v-lazy:background-image="`/assets-${server}/thumb/chara/card${cardGroup}_rip/${(card || cardMap[server][cardId]).cardRes}_${trained ? 'after_training' : 'normal'}.png`"></div>
      <div :class="`thumb-frame-${getThumbFrame(Number((card || cardMap[server][cardId]).rarity), (card || cardMap[server][cardId]).attr)}`"></div>
      <div :class="`thumb-attr-${(card || cardMap[server][cardId]).attr}`"></div>
      <div :class="`thumb-band-${bandCharaList[server][Number((card || cardMap[server][cardId]).characterId) - 1].bandId}`"></div>
      <div v-for="i in (card || cardMap[server][cardId]).rarity" :key="i" :class="`thumb-rarity-${Number(trained)}-${i}`"></div>
    </div>
    <div class="card-img-parent" v-else>
      <q-inner-loading :visible="!isReady">
        <q-spinner-facebook color="pink" size="48px"></q-spinner-facebook>
      </q-inner-loading>
    </div>
  </lazy-component>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'cardThumbDiv',
  props: {
    card: Object,
    cardId: Number,
    server: {
      type: String,
      required: true
    },
    trained: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isReady: false
    }
  },
  computed: {
    cardGroup () {
      const groupId = Math.trunc((this.cardId || this.card.cardId) / 50).toString()
      return `${'0'.repeat(5 - groupId.length)}${groupId}`
    },
    ...mapState('card', [
      'cardMap'
    ]),
    ...mapState('chara', [
      'bandCharaList'
    ])
  },
  methods: {
    ...mapActions('card', [
      'getCardById'
    ]),
    ...mapActions('chara', [
      'getBandCharaList'
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
      if (this.card) {
        this.isReady = true
        return
      }
      this.$nextTick(async () => {
        await this.getCardById({
          cardId: this.cardId,
          server: this.server
        })
        await this.getBandCharaList(this.server)
        this.isReady = true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.card-img-parent
  width 120px
  height 120px
  margin 4.5px 4.5px
  position relative
  cursor pointer

.thumb-table
  position absolute
  width 111px
  height 111px
  background-size cover
  left 5px
  top 5px

thumb-frame(uri)
  width 120px
  height 120px
  background url(uri) no-repeat
  background-size cover
  left 0
  top 0

.thumb-frame-normal-happy
  position: absolute
  thumb-frame('~assets/thumb_frame_happy.png')

.thumb-frame-normal-pure
  position: absolute
  thumb-frame('~assets/thumb_frame_pure.png')

.thumb-frame-normal-cool
  position: absolute
  thumb-frame('~assets/thumb_frame_cool.png')

.thumb-frame-normal-powerful
  position: absolute
  thumb-frame('~assets/thumb_frame_powerful.png')

.thumb-frame-rare
  position: absolute
  thumb-frame('~assets/thumb_frame_silver.png')

.thumb-frame-sr
  position: absolute
  thumb-frame('~assets/thumb_frame_gold.png')

.thumb-frame-ssr
  position: absolute
  thumb-frame('~assets/thumb_frame_rainbow.png')

thumd-attr(uri)
  top 2%
  right 1%
  width 30px
  height 30px
  background url(uri) no-repeat
  background-size cover

.thumb-attr-powerful
  position: absolute
  thumd-attr('~assets/icon_powerful.png')

.thumb-attr-cool
  position: absolute
  thumd-attr('~assets/icon_cool.png')

.thumb-attr-happy
  position: absolute
  thumd-attr('~assets/icon_happy.png')

.thumb-attr-pure
  position: absolute
  thumd-attr('~assets/icon_pure.png')

.thumb-rarity-0-1
  position absolute
  top 80%
  left 2.5%
  width 22.5px
  height 22.5px
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

.thumb-rarity-0-2
  position absolute
  top 65%
  left 2.5%
  width 22.5px
  height 22.5px
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

.thumb-rarity-0-3
  position absolute
  top 50%
  left 2.5%
  width 22.5px
  height 22.5px
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

.thumb-rarity-0-4
  position absolute
  top 35%
  left 2.5%
  width 22.5px
  height 22.5px
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

.thumb-rarity-1-1
  position absolute
  top 80%
  left 2.5%
  width 22.5px
  height 22.5px
  background url('~assets/star_after_training.png') no-repeat
  background-size 100% 100%

.thumb-rarity-1-2
  position absolute
  top 65%
  left 2.5%
  width 22.5px
  height 22.5px
  background url('~assets/star_after_training.png') no-repeat
  background-size 100% 100%

.thumb-rarity-1-3
  position absolute
  top 50%
  left 2.5%
  width 22.5px
  height 22.5px
  background url('~assets/star_after_training.png') no-repeat
  background-size 100% 100%

.thumb-rarity-1-4
  position absolute
  top 35%
  left 2.5%
  width 22.5px
  height 22.5px
  background url('~assets/star_after_training.png') no-repeat
  background-size 100% 100%

.thumb-band-1
  position absolute
  top 3%
  left 2%
  width 25px
  height 25px
  background url('~assets/band_icon_1.png') no-repeat center/cover

.thumb-band-2
  position absolute
  top 3%
  left 2%
  width 25px
  height 25px
  background url('~assets/band_icon_2.png') no-repeat center/cover

.thumb-band-3
  position absolute
  top 3%
  left 2%
  width 25px
  height 25px
  background url('~assets/band_icon_3.png') no-repeat center/cover

.thumb-band-4
  position absolute
  top 3%
  left 2%
  width 25px
  height 25px
  background url('~assets/band_icon_4.png') no-repeat center/cover

.thumb-band-5
  position absolute
  top 3%
  left 2%
  width 25px
  height 25px
  background url('~assets/band_icon_5.png') no-repeat center/cover
</style>
