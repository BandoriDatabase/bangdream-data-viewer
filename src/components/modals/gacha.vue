<template>
  <q-dialog v-model="isOpen" @hide="stopMultiPickupSlideShow">
    <q-card class="q-ma-none" v-if="gacha" style="width: 100%; max-width: 700px;">
      <q-img v-if="!multiPickupImg"
        v-lazy:background-image="`/assets-${server}/gacha/screen/${gacha.resourceName}_rip/pickup${gacha.gachaId === 106 ? '_kasumi' : ''}.png`"
        alt="" class="gacha-banner">
        <div class="absolute-bottom text-subtitle2">
          <p class="text-h6">{{gacha.gachaName}}
            <q-btn class="float-right" flat small @click="isOpen = false"><q-icon name="close" /></q-btn>
          </p>
          <p slot="subtitle">{{$t('gacha.start-at')}} {{(new Date(Number(gacha.publishedAt))).toLocaleString()}}</p>
          <p slot="subtitle">{{$t('gacha.end-at')}} {{(new Date(Number(gacha.closedAt))).toLocaleString()}}</p>
        </div>
      </q-img>
      <div v-if="multiPickupImg" class="multiPickup">
        <q-img :class="{active: isActive}"
          v-lazy:background-image="`/assets-${server}/gacha/screen/${gacha.resourceName}_rip/pickup1.png`"
          class="gacha-banner">
          <div class="absolute-bottom text-subtitle2">
            <p class="text-h6">{{gacha.gachaName}}
              <q-btn class="float-right" flat small @click="isOpen = false"><q-icon name="close" /></q-btn>
            </p>
            <p slot="subtitle">{{$t('gacha.start-at')}} {{(new Date(Number(gacha.publishedAt))).toLocaleString()}}</p>
            <p slot="subtitle">{{$t('gacha.end-at')}} {{(new Date(Number(gacha.closedAt))).toLocaleString()}}</p>
          </div>
        </q-img>
        <q-img :class="{active: !isActive}"
          v-lazy:background-image="`/assets-${server}/gacha/screen/${gacha.resourceName}_rip/pickup2.png`"
          class="gacha-banner">
          <div class="absolute-bottom text-subtitle2">
            <p class="text-h6">{{gacha.gachaName}}
              <q-btn class="float-right" flat small @click="isOpen = false"><q-icon name="close" /></q-btn>
            </p>
            <p slot="subtitle">{{$t('gacha.start-at')}} {{(new Date(Number(gacha.publishedAt))).toLocaleString()}}</p>
            <p slot="subtitle">{{$t('gacha.end-at')}} {{(new Date(Number(gacha.closedAt))).toLocaleString()}}</p>
          </div>
        </q-img>
      </div>
      <q-card-section style="text-align: center">
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
        <q-btn class="center" color="pink-6" :label="$t('live2d.show') + ' ' + $t('gacha.normal')" @click="showNormalCards" v-show="!isShowNormalCards"></q-btn>
        <div v-if="isShowNormalCards">
          <div class="center" v-for="gc in gacha.details.filter(gc => !gc.pickup)" :key="gc.situationId" style="display: inline-block; margin: 3px 3px;" v-if="isNormalReady">
            <card-thumb :card="cardMap[server][gc.situationId]" :server="server" @click="isOpen = false"></card-thumb>
            <q-tooltip v-show="gc.weight != 1">Rate: {{Number(gc.weight)/10000}}%</q-tooltip>
          </div>
          <div v-if="!isNormalReady">
            <q-spinner color="pink" size="48px"></q-spinner>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
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
      isNormalReady: false,
      isShowNormalCards: false
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
      this.isShowNormalCards = false
      this.getBatchCards({
        server,
        cardIds: data.details.filter(gc => gc.pickup).map(gc => gc.situationId)
      }).then(() => {
        this.isPickupReady = true
      })
    },
    showNormalCards () {
      this.isShowNormalCards = true
      this.getBatchCards({
        server: this.server,
        cardIds: this.gacha.details.filter(gc => !gc.pickup).map(gc => gc.situationId)
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

.multiPickup .q-img
  position: absolute
  width: 100%
  top: 0
  right: 0
  transition: opacity 0.5s linear
  opacity: 0

.multiPickup .q-img.active
  opacity: 1
</style>
