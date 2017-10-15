<template>
  <div class="shadow-1 shadow-transition hoverable-3" :class="`thumb-${getCardThumbFrame(cardInfo)}`">
    <img class="thumb-table" v-lazy:background-image="`/assets/thumb/chara/card0000${Math.trunc(Number(cardInfo.cardId) / 50)}_${cardInfo.cardRes}_normal.png`"
    @click="$router.push({ name: 'cardDetail', params: { cardId: cardInfo.cardId } })">
  </div>
</template>

<script>
export default {
  name: 'cardThumbDiv',
  props: {
    cardInfo: {
      type: Object
    }
  },
  methods: {
    getCardThumbFrame (cardInfo) {
      switch (Number(cardInfo.rarity)) {
        case 1:
          return `normal-${cardInfo.attr}`
        case 2:
          return 'rare'
        case 3:
          return 'super-rare'
        case 4:
          return 'ss-rare'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.thumb-table
  width 54px
  height 54px
  cursor pointer
  background-size cover
  margin 3px 3px
</style>
