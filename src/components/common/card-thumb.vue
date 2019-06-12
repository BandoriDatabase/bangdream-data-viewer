<template>
  <lazy-component @show="loadData">
    <div class="card-img-parent" v-if="isReady && !mini" @click="() => {
        $emit('close');
        $router.push(`/card/${server}/${(card || cardMap[server][cardId]).cardId}/${Number(trained)}`);
      }">
      <div class="thumb-table" v-lazy:background-image="`/assets-${server}/thumb/chara/card${cardGroup}_rip/${(card || cardMap[server][cardId]).cardRes}_${trained ? 'after_training' : 'normal'}.png`"></div>
      <div :class="`thumb-frame-${getThumbFrame(Number((card || cardMap[server][cardId]).rarity), (card || cardMap[server][cardId]).attr)}`"></div>
      <div :class="`thumb-attr-${(card || cardMap[server][cardId]).attr}`"></div>
      <div :class="`thumb-band-${bandCharaList[server][Number((card || cardMap[server][cardId]).characterId) - 1].bandId}`"></div>
      <div v-for="i in (card || cardMap[server][cardId]).rarity" :key="i" :class="`thumb-rarity-${Number(trained)}-${i}`"></div>
    </div>
    <div class="card-img-mini-parent" v-else-if="isReady" @click="() => {
        $emit('close');
        $router.push(`/card/${server}/${(card || cardMap[server][cardId]).cardId}/${Number(trained)}`);
      }">
      <div class="thumb-mini-table" v-lazy:background-image="`/assets-${server}/thumb/chara/card${cardGroup}_rip/${(card || cardMap[server][cardId]).cardRes}_${trained ? 'after_training' : 'normal'}.png`"></div>
      <div :class="`thumb-mini-frame-${getThumbFrame(Number((card || cardMap[server][cardId]).rarity), (card || cardMap[server][cardId]).attr)}`"></div>
      <div :class="`thumb-mini-attr-${(card || cardMap[server][cardId]).attr}`"></div>
      <div :class="`thumb-mini-band-${bandCharaList[server][Number((card || cardMap[server][cardId]).characterId) - 1].bandId}`"></div>
      <div v-for="i in (card || cardMap[server][cardId]).rarity" :key="i" :class="`thumb-mini-rarity-${Number(trained)}-${i}`"></div>
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
    trained: Boolean,
    mini: Boolean
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
  margin 0 auto
  position relative
  cursor pointer

.card-img-mini-parent
  width 60px
  height 60px
  margin 0 auto
  position relative
  cursor pointer

.thumb-table
  position absolute
  width 111px
  height 111px
  background-size cover
  left 5px
  top 5px

.thumb-mini-table
  position absolute
  width 55.5px
  height 55.5px
  background-size cover
  left 2.5px
  top 2.5px

thumb-frame(uri)
  width 120px
  height 120px
  realUri = '~assets/thumb_frame_' + uri + '.png'
  background url(realUri) no-repeat
  background-size cover
  left 0
  top 0

thumd-attr(uri)
  top 2%
  right 1%
  width 30px
  height 30px
  realUri = '~assets/icon_' + uri + '.png'
  background url(realUri) no-repeat
  background-size cover

thumb-mini-frame(uri)
  width 60px
  height 60px
  realUri = '~assets/thumb_frame_' + uri + '.png'
  background url(realUri) no-repeat
  background-size cover
  left 0
  top 0

thumd-mini-attr(uri)
  top 2%
  right 1%
  width 15px
  height 15px
  realUri = '~assets/icon_' + uri + '.png'
  background url(realUri) no-repeat
  background-size cover

attrs = happy pure cool powerful

for attr in attrs
  .thumb-frame-normal-{attr}
    position: absolute
    thumb-frame(attr)

  .thumb-attr-{attr}
    position: absolute
    thumd-attr(attr)

  .thumb-mini-frame-normal-{attr}
    position: absolute
    thumb-mini-frame(attr)

  .thumb-mini-attr-{attr}
    position: absolute
    thumd-mini-attr(attr)

.thumb-frame-rare
  position: absolute
  thumb-frame('silver')

.thumb-frame-sr
  position: absolute
  thumb-frame('gold')

.thumb-frame-ssr
  position: absolute
  thumb-frame('rainbow')

.thumb-mini-frame-rare
  position: absolute
  thumb-mini-frame('silver')

.thumb-mini-frame-sr
  position: absolute
  thumb-mini-frame('gold')

.thumb-mini-frame-ssr
  position: absolute
  thumb-mini-frame('rainbow')

for num in 1 2 3 4
  .thumb-rarity-0-{num}
    position absolute
    top 80% - 15% * (num - 1)
    left 2.5%
    width 22.5px
    height 22.5px
    background url('~assets/star_untrained.png') no-repeat
    background-size 100% 100%

  .thumb-rarity-1-{num}
    position absolute
    top 80% - 15% * (num - 1)
    left 2.5%
    width 22.5px
    height 22.5px
    background url('~assets/star_after_training.png') no-repeat
    background-size 100% 100%

  .thumb-mini-rarity-0-{num}
    position absolute
    top 80% - 15% * (num - 1)
    left 2.5%
    width 11.25px
    height 11.25px
    background url('~assets/star_untrained.png') no-repeat
    background-size 100% 100%

  .thumb-mini-rarity-1-{num}
    position absolute
    top 80% - 15% * (num - 1)
    left 2.5%
    width 11.25px
    height 11.25px
    background url('~assets/star_after_training.png') no-repeat
    background-size 100% 100%

for num in 1 2 3 4 5
  .thumb-band-{num}
    position absolute
    top 3%
    left 2%
    width 25px
    height 25px
    realUri = '~assets/band_icon_' + num +'.png'
    background url(realUri) no-repeat center/cover

  .thumb-mini-band-{num}
    position absolute
    top 3%
    left 2%
    width 12.5px
    height 12.5px
    realUri = '~assets/band_icon_' + num +'.png'
    background url(realUri) no-repeat center/cover
</style>
