<template>
  <q-modal ref="gModal" @close="stopMultiPickupSlideShow">
    <q-card class="no-margin" v-if="gacha" style="max-width: 600px;">
      <q-card-media>
        <img v-if="!multiPickupImg" v-lazy:background-image="`/assets-${server}/gacha/screen/${gacha.resourceName}_pickup${gacha.gachaId === 106 ? '_kasumi' : ''}.png`" alt="" class="gacha-banner" />
        <div v-if="multiPickupImg" class="multiPickup">
          <img :class="{active: isActive}" v-lazy:background-image="`/assets-${server}/gacha/screen/${gacha.resourceName}_pickup1.png`" class="gacha-banner" />
          <img :class="{active: !isActive}" v-lazy:background-image="`/assets-${server}/gacha/screen/${gacha.resourceName}_pickup2.png`" class="gacha-banner" />
        </div>
        <q-card-title slot="overlay">
          <p>{{gacha.gachaName}}
            <q-btn class="float-right" flat small @click="$refs.gModal.close()"><q-icon name="close" /></q-btn>
          </p>
          <p>{{$t('gacha-start-at')}} {{(new Date(Number(gacha.publishedAt))).toLocaleString()}}</p>
          <p>{{$t('gacha-end-at')}} {{(new Date(Number(gacha.closedAt))).toLocaleString()}}</p>
        </q-card-title>
      </q-card-media>
      <q-card-main style="text-align: center">
        <h6>{{$t('gacha-desc')}}</h6>
        <p>{{gacha.description}}</p>
        <p v-if="gacha.information && gacha.information.description" v-html="gacha.information.description.replace(/\n/g, '<br>')"></p>
        <p v-else>{{gacha.description}}</p>
        <h6 v-if="gacha.information && gacha.information.newMemberInfo">{{$t('gacha-new-members')}}</h6>
        <p v-if="gacha.information && gacha.information.newMemberInfo" v-html="gacha.information.newMemberInfo.replace(/\n/g, '<br>')"></p>
        <h6>{{$t('gacha-rates')}}</h6>
        <p v-for="(rate, idx) in gacha.rates" :key="idx" v-if="rate.rate">
          {{'\u2605'.repeat(Number(rate.rarityIndex))}} {{rate.rate}}%
        </p>
        <h6>{{$t('gacha-pickup')}}</h6>
        <div class="center" v-for="gc in gacha.details" :key="gc.situationId" style="display: inline-block; margin: 3px 3px;" v-if="gc.pickup">
          <card-thumb :cardId="Number(gc.situationId)" :server="server" @close="$refs.gModal.close()"></card-thumb>
          <q-tooltip v-show="gc.weight != 1">Rate: {{Number(gc.weight)/10000}}%</q-tooltip>
        </div>
        <h6>{{$t('gacha-normal')}}</h6>
        <div class="center" v-for="gc in gacha.details" :key="gc.situationId" style="display: inline-block; margin: 3px 3px;" v-if="!gc.pickup">
          <card-thumb :cardId="Number(gc.situationId)" :server="server" @close="$refs.gModal.close()"></card-thumb>
          <q-tooltip v-show="gc.weight != 1">Rate: {{Number(gc.weight)/10000}}%</q-tooltip>
        </div>
      </q-card-main>
    </q-card>
  </q-modal>
</template>

<i18n>
{
  "en": {
    "gacha-start-at": "Start at:",
    "gacha-end-at": "Close at:",
    "gacha-desc": "Description",
    "gacha-new-members": "New members",
    "gacha-rates": "Gacha rates",
    "gacha-pickup": "Pickup gacha cards",
    "gacha-normal": "Other gacha cards"
  },
  "zh-cn": {
    "gacha-start-at": "开始于:",
    "gacha-end-at": "结束于:",
    "gacha-desc": "扭蛋详情",
    "gacha-new-members": "新加卡片",
    "gacha-rates": "扭蛋池概率",
    "gacha-pickup": "概率提升卡片",
    "gacha-normal": "其他扭蛋池卡片"
  },
  "zh-tw": {
    "gacha-start-at": "開始於:",
    "gacha-end-at": "結束於:",
    "gacha-desc": "扭蛋詳情",
    "gacha-new-members": "新加卡片",
    "gacha-rates": "扭蛋池概率",
    "gacha-pickup": "概率提升卡片",
    "gacha-normal": "其他扭蛋池卡片"
  }
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
import cardThumb from '../common/CardThumb'

export default {
  name: 'gachaModal',
  props: ['server'],
  data () {
    return {
      gacha: null,
      multiPickupImg: false,
      multiPickupImgInterval: null,
      isActive: true
    }
  },
  mounted () {
    this.$Lazyload.$on('error', (el) => {
      this.multiPickupImg = !this.multiPickupImg
      if (el.src.indexOf('pickup') !== -1 && this.multiPickupImg) {
        this.startMultiPickupSlideShow()
      }
    })
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
  methods: {
    open (data) {
      this.gacha = data
      this.$refs.gModal.open()
    },
    startMultiPickupSlideShow () {
      this.multiPickupImgInterval = setInterval(() => {
        this.isActive = !this.isActive
      }, 3500)
    },
    stopMultiPickupSlideShow () {
      if (this.multiPickupImgInterval) {
        this.multiPickupImg = false
        clearInterval(this.multiPickupImgInterval)
      }
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

.multiPickup
  height: 600px
  width: auto
  position: relative

.multiPickup img
  position: absolute
  width: 100%
  top: 0
  right: 0
  transition: opacity 0.5s linear
  opacity: 0

.multiPickup img.active
  opacity: 1
</style>
