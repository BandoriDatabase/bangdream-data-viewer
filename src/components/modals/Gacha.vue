<template>
  <q-modal ref="gModal">
    <q-card class="no-margin" v-if="gachaMap[gachaId]">
      <q-card-media>
        <img v-lazy:background-image="`/assets/gacha/screen/${gachaMap[gachaId].resourceName}_pickup.png`" alt="" class="gacha-banner" />
        <q-card-title slot="overlay">
          <p>{{gachaMap[gachaId].gachaName}}
            <q-btn class="float-right" flat small @click="$refs.gModal.close()"><q-icon name="close" /></q-btn>
          </p>
          <p>Start at: {{(new Date(Number(gachaMap[gachaId].publishedAt))).toLocaleString()}}</p>
          <p>Close at: {{(new Date(Number(gachaMap[gachaId].closedAt))).toLocaleString()}}</p>
        </q-card-title>
      </q-card-media>
      <q-card-main style="text-align: center">
        <p>Description</p>
        <p>{{gachaMap[gachaId].description}}</p>
        <p>{{gachaMap[gachaId].annotation}}</p>
        <p>Gacha rates</p>
        <p v-for="rate in gachaMap[gachaId].rates" :key="rate.rarityIndex" v-if="rate.rate">
          {{'\u2605'.repeat(Number(rate.rarityIndex))}} {{rate.rate}}%
        </p>
        <p>Pickup gacha cards</p>
        <div class="center" v-for="gc in gachaMap[gachaId].details" :key="gc.situationId" style="display: inline-block; margin: 3px 3px;" v-if="gc.pickup">
          <card-thumb :cardInfo="cardInfos[gc.situationId]"></card-thumb>
          <q-tooltip v-show="gc.weight != 1">Rate: {{Number(gc.weight)/10000}}%</q-tooltip>
        </div>
        <p>Other gacha cards</p>
        <div class="center" v-for="gc in gachaMap[gachaId].details" :key="gc.situationId" style="display: inline-block; margin: 3px 3px;" v-if="!gc.pickup">
          <card-thumb :cardInfo="cardInfos[gc.situationId]"></card-thumb>
          <q-tooltip v-show="gc.weight != 1">Rate: {{Number(gc.weight)/10000}}%</q-tooltip>
        </div>
      </q-card-main>
    </q-card>
  </q-modal>
</template>

<i18n>
{
  "en": {},
  "zh-CN": {},
  "zh-TW": {}
}
</i18n>

<script>
import {
  QModal,
  QBtn,
  QIcon,
  QCard,
  QCardTitle,
  QCardMain,
  QCardMedia,
  QToggle,
  QCollapsible,
  QTooltip
} from 'quasar'
import { mapGetters } from 'vuex'
import cardThumb from '../common/CardThumb'

export default {
  name: 'gachaModal',
  data () {
    return {
      gachaId: 0
    }
  },
  components: {
    QModal,
    QBtn,
    QIcon,
    QCard,
    QCardTitle,
    QCardMain,
    QCardMedia,
    QToggle,
    QCollapsible,
    QTooltip,
    cardThumb
  },
  computed: {
    ...mapGetters('DB', [
      'cardInfos',
      'characterInfos',
      'gachaMap'
    ])
  },
  methods: {
    open (id) {
      this.gachaId = Number(id)
      // console.log(this.gachaMap[this.gachaId])
      this.$refs.gModal.open()
    }
  }
}
</script>

<style lang="stylus" scoped>
.gacha-banner
  height 600px
  background-size: auto 100%
  background-repeat: no-repeat
  background-position: center
// .gacha-banner
//   width 420px
//   height 180px
//   margin 0 auto
//   max-width 100%
//   display block
</style>
