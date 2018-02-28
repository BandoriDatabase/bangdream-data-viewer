<template>
  <div>
    <q-card v-if="isGcahaReady">
      <q-card-title class="bg-pink text-white">
        {{$t(`gache-list-${server}`)}}
        <span slot="subtitle" class="text-white">{{$t('gacha-list-count')}}: {{currentGachaList[server].length}}</span>
      </q-card-title>
      <q-card-main>
        <div v-for="gacha in currentGachaList[server]" :key="gacha.seq" style="width: 100%; margin: 10px 0; text-align: center;">
          <img v-lazy="`/assets-${server}/gacha/screen/${gacha.resourceName}_logo.png`" alt="" class="gacha-banner" />
          <p>{{gacha.gachaName}}<q-btn flat round small class="text-pink" @click="$refs.gachaModal.open(gacha)"><q-icon name="launch" /></q-btn></p>
          <p v-if="Number(gacha.publishedAt) > Date.now()">{{$t('gacha-not-started')}}</p>
          <h5 v-if="Number(gacha.publishedAt) > Date.now()">{{(new Date(Number(gacha.publishedAt))).toLocaleString()}}</h5>
          <count-down :target-time="Number(gacha.closedAt)" v-else></count-down>
        </div>
        <gacha-modal ref="gachaModal" :server="server"></gacha-modal>
      </q-card-main>
    </q-card>
    <q-card v-else>
      <q-card-title class="bg-pink text-white">
        {{$t('fetch-gacha-data')}}
        <span slot="subtitle" class="text-white">{{$t('gacha-list-count')}} {{$t('fetch-gacha-data')}}</span>
      </q-card-title>
      <q-card-main>
        <q-spinner color="pink" size="48px"></q-spinner>
      </q-card-main>
    </q-card>
  </div>
</template>

<i18n>
{
  "en": {
    "gacha-end-cd": "Gacha ending countdown",
    "gache-list-jp": "JP scouts list",
    "gache-list-tw": "TW scouts list",
    "gacha-list-count": "Counts",
    "fetch-gacha-data": "Fetching Gacha Data...",
    "gacha-not-started": "Gacha will start at"
  },
  "zh-cn": {
    "gacha-end-cd": "抽卡倒计时",
    "gache-list-jp": "日服当前开放扭蛋池",
    "gache-list-tw": "台服当前开放扭蛋池",
    "gacha-list-count": "数量",
    "fetch-gacha-data": "获取扭蛋池数据中",
    "gacha-not-started": "扭蛋将开始于"
  },
  "zh-tw": {
    "gacha-end-cd": "抽卡倒計時",
    "gache-list-jp": "日服當前開放扭蛋池",
    "gache-list-tw": "臺服當前開放扭蛋池",
    "gacha-list-count": "數量",
    "fetch-gacha-data": "獲取扭蛋池數據中",
    "gacha-not-started": "扭蛋將開始於"
  },
  "ja": {
    "gacha-end-cd": "ガチャカウントダウン",
    "gache-list-jp": "日本サーバー開催中のガチャ",
    "gache-list-tw": "台湾サーバー開催中のガチャ",
    "gacha-list-count": "総数",
    "fetch-gacha-data": "ガチャデータを取得中..."
  }
}
</i18n>

<script>
import {
  QCard,
  QCardTitle,
  QCardMedia,
  QCardMain,
  QIcon,
  QBtn,
  QSpinner
} from 'quasar'
import { mapState, mapActions } from 'vuex'
import gachaModal from '../modals/Gacha'
import CountDown from './Countdown'

export default {
  name: 'simple-gacha-card',
  props: ['server'],
  components: {
    gachaModal,
    QCard,
    QCardTitle,
    QCardMedia,
    QCardMain,
    QIcon,
    QBtn,
    CountDown,
    QSpinner
  },
  data () {
    return {
      isGcahaReady: false
    }
  },
  computed: {
    ...mapState('gacha', [
      'currentGachaList'
    ])
  },
  mounted () {
    this.loadData()
  },
  methods: {
    ...mapActions('gacha', [
      'getGachaCurrent'
    ]),
    loadData () {
      this.$nextTick(async () => {
        await this.getGachaCurrent(this.server)
        this.isGcahaReady = true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.gacha-banner
  width 280px
  height 120px
  margin 0 auto
  max-width 100%
  display block
  
.gacha-cover
  width: 100%
  height: 200px
  background-size: 100% 100%
  background-repeat: no-repeat
  background-position: center

.gacha-img
  width: 100%
  height: 500px
  background-size: auto 100%
  background-repeat: no-repeat
  background-position: center
</style>
