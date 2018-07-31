<template>
  <q-modal v-model="isOpen" @close="stopMultiPickupSlideShow">
    <q-card class="q-ma-none" v-if="gacha" style="max-width: 600px;">
      <q-card-media>
        <img v-if="!multiPickupImg" v-lazy:background-image="`/assets-${server}/gacha/screen/${gacha.resourceName}_pickup${gacha.gachaId === 106 ? '_kasumi' : ''}.png`" alt="" class="gacha-banner" />
        <div v-if="multiPickupImg" class="multiPickup">
          <img :class="{active: isActive}" v-lazy:background-image="`/assets-${server}/gacha/screen/${gacha.resourceName}_pickup1.png`" class="gacha-banner" />
          <img :class="{active: !isActive}" v-lazy:background-image="`/assets-${server}/gacha/screen/${gacha.resourceName}_pickup2.png`" class="gacha-banner" />
        </div>
        <q-card-title slot="overlay">
          <p>{{gacha.gachaName}}
            <q-btn class="float-right" flat small @click="isOpen = false"><q-icon name="close" /></q-btn>
          </p>
          <p slot="subtitle">{{$t('gacha.start-at')}} {{(new Date(Number(gacha.publishedAt))).toLocaleString()}}</p>
          <p slot="subtitle">{{$t('gacha.end-at')}} {{(new Date(Number(gacha.closedAt))).toLocaleString()}}</p>
        </q-card-title>
      </q-card-media>
      <q-card-main style="text-align: center">
        <h6>{{$t('gacha.desc')}}</h6>
        <p>{{gacha.description}}</p>
        <p v-if="gacha.information && gacha.information.description" v-html="gacha.information.description.replace(/\n/g, '<br>')"></p>
        <h6 v-if="gacha.information && gacha.information.newMemberInfo">{{$t('gacha.new-members')}}</h6>
        <p v-if="gacha.information && gacha.information.newMemberInfo" v-html="gacha.information.newMemberInfo.replace(/\n/g, '<br>')"></p>
        <h6>{{$t('gacha.rates')}}</h6>
        <p v-for="(rate, idx) in gacha.rates" :key="idx * 10000" v-if="rate.rate">
          {{'\u2605'.repeat(Number(rate.rarityIndex))}} {{rate.rate}}%
        </p>
        <h6>{{$t('gacha.pickup')}}</h6>
        <div class="center" v-for="gc in gacha.details.filter(gc => gc.pickup)" :key="gc.situationId" style="display: inline-block; margin: 3px 3px;" v-if="isPickupReady">
          <card-thumb :cardId="Number(gc.situationId)" :server="server" @click="isOpen = false"></card-thumb>
          <q-tooltip v-show="gc.weight != 1">Rate: {{Number(gc.weight)/10000}}%</q-tooltip>
        </div>
        <div v-if="!isPickupReady">
          <q-spinner color="pink" size="48px"></q-spinner>
        </div>
        <h6>{{$t('gacha.normal')}}</h6>
        <div class="center" v-for="gc in gacha.details.filter(gc => !gc.pickup)" :key="gc.situationId" style="display: inline-block; margin: 3px 3px;" v-if="isNormalReady">
          <card-thumb :card="cardMap[server][gc.situationId]" :server="server" @click="isOpen = false"></card-thumb>
          <q-tooltip v-show="gc.weight != 1">Rate: {{Number(gc.weight)/10000}}%</q-tooltip>
        </div>
        <div v-if="!isNormalReady">
          <q-spinner color="pink" size="48px"></q-spinner>
        </div>
      </q-card-main>
    </q-card>
  </q-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CardThumb from 'components/common/card-thumb'

export default {
  name: 'gachaModal',
  data () {
    return {
      server: '',
      gacha: null,
      multiPickupImg: false,
      multiPickupImgInterval: null,
      isActive: true,
      isOpen: false,
      isPickupReady: false,
      isNormalReady: false
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
    CardThumb
  },
  computed: {
    ...mapState('card', [
      'cardMap'
    ])
  },
  methods: {
    ...mapActions('card', [
      'getBatchCards'
    ]),
    open (data, server) {
      this.gacha = data
      this.server = server
      this.isOpen = true
      this.isPickupReady = false
      this.isNormalReady = false
      this.getBatchCards({
        server,
        cardIds: data.details.filter(gc => gc.pickup).map(gc => gc.situationId)
      }).then(() => {
        this.isPickupReady = true
      })
      this.getBatchCards({
        server,
        cardIds: data.details.filter(gc => !gc.pickup).map(gc => gc.situationId)
      }).then(() => {
        this.isNormalReady = true
      })
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
