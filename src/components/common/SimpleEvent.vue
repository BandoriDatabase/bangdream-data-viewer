<template>
  <div>
    <q-card v-if="isReady">
      <q-card-title class="bg-pink text-white">
        {{currentEvent[server].eventName}}
        <span slot="subtitle" class="text-white">{{$t('event-' + server)}} {{currentEvent[server].eventType}}</span>
      </q-card-title>
      <q-card-media style="cursor: pointer;" @click="$router.push({ name: 'currEvent' }), $ga.event('event-detail', 'jump', server)">
        <img v-if="server === 'jp'" class="responsive" v-lazy="`/assets-jp/homebanner_banner_event${currentEvent[server].eventId}.png`"/>
        <img v-if="server === 'tw'" class="responsive" v-lazy="`/assets-tw/homebanner_banner_event${padEventId(currentEvent[server].eventId)}${currentEvent[server].eventId > 13 ? '' : '_open'}.png`"/>
      </q-card-media>
      <q-card-main>
        <div class="row items-center justify-center">
          <div class="col-3" @click="$ga.event('event-card', 'jump', `normal-${server}`)"><card-thumb :cardId="Number(eventNormalCardId)" :server="server"></card-thumb></div>
          <div class="col-3" @click="$ga.event('event-card', 'jump', `sr-${server}`)"><card-thumb :cardId="Number(eventSpecialCardId)" :server="server"></card-thumb></div>
          <count-down class="col-6" :target-time="Number(currentEvent[server].endAt)" v-if="Number(currentEvent[server].endAt) > Date.now()" small></count-down>
        </div>
      </q-card-main>
    </q-card>
    <q-card v-else>
      <q-card-title class="bg-pink text-white">
        {{$t('fetch-event-data')}}
        <span slot="subtitle" class="text-white">{{$t('fetch-event-data')}}</span>
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
    "event-jp": "Event JP",
    "event-tw": "Event TW",
    "fetch-event-data": "Fetching Event Data..."
  },
  "zh-cn": {
    "event-jp": "日服活动",
    "event-tw": "台服活动",
    "fetch-event-data": "获取活动数据中"
  },
  "zh-tw": {
    "event-jp": "日服活動",
    "event-tw": "台服活動",
    "fetch-event-data": "獲取活動數據中"
  },
  "ja": {
    "event-jp": "日本サーバー開催中のイベント",
    "event-tw": "台湾サーバー開催中のイベント",
    "fetch-event-data": "イベントデータを取得中..."
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
import CountDown from './Countdown'
import cardThumb from './CardThumb'

export default {
  name: 'simple-event-card',
  props: ['server'],
  data () {
    return {
      isReady: false,
      eventNormalCardId: null,
      eventSpecialCardId: null
    }
  },
  components: {
    QCard,
    QCardTitle,
    QCardMedia,
    QCardMain,
    QIcon,
    QBtn,
    QSpinner,
    CountDown,
    cardThumb
  },
  computed: {
    ...mapState('event', [
      'currentEvent'
    ])
  },
  mounted () {
    this.loadData()
  },
  methods: {
    ...mapActions('event', [
      'getCurrentEvent'
    ]),
    padEventId (evtId) {
      return String(evtId).length === 1 ? `0${String(evtId)}` : String(evtId)
    },
    loadData () {
      this.$nextTick(async () => {
        await this.getCurrentEvent(this.server)
        const eventCards = this.currentEvent[this.server].pointRewards.filter(elem => elem.rewardType === 'situation')
        this.eventNormalCardId = eventCards[0].rewardId
        this.eventSpecialCardId = eventCards[1].rewardId
        this.isReady = true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
