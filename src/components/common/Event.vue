<template>
  <div>
    <q-card v-if="isEventReady">
      <q-card-media>
        <div v-if="currentEvent[server].eventType === 'challenge' || currentEvent[server].eventType === 'versus'" class="event-cover"
          :style="{ 'background-image': `url(/assets/event/${currentEvent[server].assetBundleName}/topscreen_trim_eventtop.png), url(/assets/event/${currentEvent[server].assetBundleName}/topscreen_bg_eventtop.png)` }"></div>
        <div v-else class="event-cover" :style="{ 'background-image': `url(/assets/event/${currentEvent[server].assetBundleName}/topscreen_bg_eventtop.png)` }"></div>
        <q-card-title slot="overlay">
          {{currentEvent[server].eventName}}
          <span slot="subtitle" class="text-white">{{$t(`event-${server}`)}} {{$t('event-type')}} {{currentEvent[server].eventType}}</span>
        </q-card-title>
      </q-card-media>
      <q-card-main class="column items-center">
        <img v-if="server === 'jp'" class="responsive" v-lazy="`/assets/homebanner_banner_event${currentEvent[server].eventId}.png`"/>
        <img v-if="server === 'tw'" class="responsive" v-lazy="`/assets-tw/homebanner_banner_event${padEventId(currentEvent[server].eventId)}_open.png`"/>
        <a-player :music="eventBGM" ref="player" mode="single" class="col-12"></a-player>
        <p v-if="Number(currentEvent[server].endAt) > Date.now()">{{$t('event-end-cd')}}</p>
        <count-down :target-time="Number(currentEvent[server].endAt)" v-if="Number(currentEvent[server].endAt) > Date.now()"></count-down>
        <p v-if="Number(currentEvent[server].endAt) < Date.now() && Number(currentEvent[server].distributionStartAt) > Date.now()">{{$t('event-dist-cd')}}</p>
        <count-down :target-time="Number(currentEvent[server].distributionStartAt)" v-if="Number(currentEvent[server].endAt) < Date.now() && Number(currentEvent[server].distributionStartAt) > Date.now()"></count-down>
        <p v-if="Number(currentEvent[server].distributionStartAt) < Date.now() && Number(currentEvent[server].publicEndAt) > Date.now()">{{$t('next-event-cd')}}</p>
        <count-down :target-time="Number(currentEvent[server].publicEndAt)" v-if="Number(currentEvent[server].distributionStartAt) < Date.now() && Number(currentEvent[server].publicEndAt) > Date.now()"></count-down>
        <p>{{$t('event-reward-card')}}</p>
        <div class="row">
          <div class="col-6"><card-thumb :cardId="Number(eventNormalCardId)" :server="server"></card-thumb></div>
          <div class="col-6"><card-thumb :cardId="Number(eventSpecialCardId)" :server="server"></card-thumb></div>
        </div>
        <p>{{$t('event-reward-stamp')}}</p>
        <img v-if="eventRewardStamp" v-lazy="`/assets-${server}/stamp/01_${eventRewardStamp.imageName}.png`"></img>
        <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
        <p>{{$t('event-bonus-attr-card')}}</p>
        <img class="responsive" style="max-width: 100%;" v-lazy="`/assets/event/${currentEvent[server].assetBundleName}/images_event_point_banner.png`">
        <p>{{$t('event-badge')}}</p>
        <img v-if="isBadgeReady" class="badge" v-lazy="`/assets/thumb/common_${eventBadgeMap[server][currentEvent[server].eventId].badgeAssetBundleName}.png`">
        <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
        <p>{{$t('event-degrees')}}</p>
        <div v-if="isDegreeReady && server === 'jp'" class="event-degree" :style="{ 'background-image': `url(/assets/thumb/degree_event_point_icon_1.png), url(/assets/thumb/degree_event_point_1.png), url(/assets/thumb/degree_${degreeMap[server][currentEvent[server].rankingRewards[0].rewardId].imageName}.png)` }" />
        <div v-else-if="isDegreeReady && server === 'tw'" class="event-degree" :style="{ 'background-image': `url(/assets/thumb/degree_${degreeMap[server][currentEvent[server].rankingRewards[0].rewardId].imageName}.png)` }" />
        <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
        <span class="row justify-center" v-if="currentEvent[server].eventType === 'challenge'">
          <div class="event-degree" v-for="eventMusic in currentEvent[server].detail.musics" :key="eventMusic.seq" v-if="degreeMap[server][eventMusic.musicRankingRewards[0].resourceId] && server === 'jp'"
          :style="{ 'background-image': `url(/assets/thumb/degree_opening_1_1.png), url(/assets/thumb/degree_score_ranking_1.png), url(/assets/thumb/degree_${degreeMap[server][eventMusic.musicRankingRewards[0].resourceId].imageName}.png)` }" />
          <div class="event-degree" v-for="eventMusic in currentEvent[server].detail.musics" :key="eventMusic.seq" v-else-if="degreeMap[server][eventMusic.musicRankingRewards[0].resourceId] && server === 'tw'"
          :style="{ 'background-image': `url(/assets/thumb/degree_${degreeMap[server][eventMusic.musicRankingRewards[0].resourceId].imageName}.png)` }" />
          <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
        </span>
        <span class="column items-center" v-if="currentEvent[server].eventType === 'challenge'">
          <p>{{$t('event-musics')}}</p>
          <div class="row">
            <img v-for="eventMusic in currentEvent[server].detail.musics" :key="eventMusic.seq" v-if="musicMap[server][eventMusic.musicId]" v-lazy="`/assets/musicjacket/${musicMap[server][eventMusic.musicId].jacketImage}_thumb.png`"
              style="margin: 0 4px; cursor: pointer; width: 90px; height: 90px;" @click="$router.push({ name: 'musicDetail', params: { musicId: eventMusic.musicId, server } })">
            <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
          </div>
        </span>
      </q-card-main>
    </q-card>
    <q-card v-else>
      <q-card-title class="bg-pink text-white">
        {{$t('fetch-event-data')}}
        <span slot="subtitle" class="text-white">{{$t('event-type')}} {{$t('fetch-event-data')}}</span>
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
    "event-type": "Event type:",
    "event-end-cd": "Event ending countdown",
    "event-dist-cd": "Event award distribution countdown",
    "next-event-cd": "Next event countdown",
    "event-reward-card": "Reward cards",
    "event-reward-stamp": "Reward stamp",
    "event-bonus-attr-card": "Bonus attribute and cards",
    "event-badge": "Event badge",
    "event-degrees": "Degrees preview",
    "event-musics": "Event musics",
    "fetch-event-data": "Fetching Event Data..."
  },
  "zh-cn": {
    "event-jp": "日服活动",
    "event-tw": "台服活动",
    "event-type": "活动类型：",
    "event-end-cd": "离活动结束还有",
    "event-dist-cd": "离活动结果发表还有",
    "next-event-cd": "离下次活动还有",
    "event-reward-card": "奖励卡片",
    "event-reward-stamp": "奖励表情",
    "event-bonus-attr-card": "加成属性和卡牌",
    "event-badge": "活动徽章",
    "event-degrees": "活动头衔",
    "event-musics": "活动曲",
    "fetch-event-data": "获取活动数据中"
  },
  "zh-tw": {
    "event-jp": "日服活動",
    "event-tw": "台服活動",
    "event-type": "活動類型：",
    "event-end-cd": "離活動結束還有",
    "event-dist-cd": "離活動結果發表還有",
    "next-event-cd": "離下次活動還有",
    "event-reward-card": "獎勵卡片",
    "event-reward-stamp": "獎勵表情",
    "event-bonus-attr-card": "加成屬性和加成卡牌",
    "event-badge": "活動徽章",
    "event-degrees": "活動頭銜",
    "event-musics": "活動曲",
    "fetch-event-data": "獲取活動數據中"
  },
  "ja": {
    "event-jp": "日本サーバー開催中のイベント",
    "event-tw": "台湾サーバー開催中のイベント",
    "event-type": "イベントタイプ：",
    "event-end-cd": "イベント終了まで残り",
    "event-dist-cd": "イベント結果発表まで残り",
    "next-event-cd": "次のイベントまで残り",
    "event-reward-card": "報酬カード",
    "event-reward-stamp": "報酬スタンプ",
    "event-bonus-attr-card": "ボーナスカード",
    "event-badge": "イベントメダル",
    "event-degrees": "限定称号",
    "event-musics": "イベント楽曲",
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
  QList,
  QListHeader,
  QItem,
  QItemSeparator,
  QSpinner,
  QSpinnerFacebook
} from 'quasar'
import { mapState, mapActions } from 'vuex'
import VueAplayer from 'vue-aplayer'
import CountDown from './Countdown'
import cardThumb from './CardThumb'

export default {
  name: 'event-component',
  props: ['server'],
  components: {
    CountDown,
    aPlayer: VueAplayer,
    QCard,
    QCardTitle,
    QCardMedia,
    QCardMain,
    QIcon,
    QBtn,
    QList,
    QListHeader,
    QItem,
    QItemSeparator,
    QSpinner,
    cardThumb,
    QSpinnerFacebook
  },
  data () {
    return {
      isEventReady: false,
      eventNormalCardId: null,
      eventSpecialCardId: null,
      eventRewardStamp: null,
      // isStampReady: false,
      isBadgeReady: false,
      isDegreeReady: false
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getCurrentEvent(this.server)
      const eventCards = this.currentEvent[this.server].pointRewards.filter(elem => elem.rewardType === 'situation')
      this.eventNormalCardId = eventCards[0].rewardId
      this.eventSpecialCardId = eventCards[1].rewardId
      this.isEventReady = true
      this.getStampById({
        id: this.currentEvent[this.server].pointRewards.find(reward => reward.rewardType === 'stamp').rewardId,
        server: this.server
      })
        .then(res => {
          this.eventRewardStamp = res
        })
      this.getEventBadgeById({
        eventId: this.currentEvent[this.server].eventId,
        server: this.server
      })
        .then(res => {
          this.isBadgeReady = true
        })
      if (this.currentEvent[this.server].eventType === 'challenge') {
        await this.getDegreeById({
          id: this.currentEvent[this.server].rankingRewards[0].rewardId,
          server: this.server
        })
        for (let eM of this.currentEvent[this.server].detail.musics) {
          await this.getDegreeById({
            id: eM.musicRankingRewards[0].resourceId,
            server: this.server
          })
          await this.getMusicById({
            musicId: eM.musicId,
            server: this.server
          })
        }
        this.isDegreeReady = true
      }
      else {
        this.getDegreeById({
          id: this.currentEvent[this.server].rankingRewards[0].rewardId,
          server: this.server
        })
          .then(res => {
            this.isDegreeReady = true
          })
      }
    })
  },
  computed: {
    ...mapState('event', [
      'currentEvent',
      'eventBadgeMap',
      'degreeMap'
    ]),
    ...mapState('music', [
      'musicMap'
    ]),
    eventBGM () {
      const arr = this.currentEvent[this.server].bgmAssetBundleName.split('/')
      return {
        title: this.currentEvent[this.server].eventName,
        author: 'Event BGM',
        url: `/assets/${arr.slice(0, arr.length - 1).join('/')}/${this.currentEvent[this.server].bgmFileName}.mp3`,
        pic: `/assets/event/${this.currentEvent[this.server].assetBundleName}/images_logo.png`
      }
    }
  },
  methods: {
    ...mapActions('card', [
      'getCardById',
      'getSkillById'
    ]),
    ...mapActions('event', [
      'getCurrentEvent',
      'getEventBadgeById',
      'getDegreeById'
    ]),
    ...mapActions('stamp', [
      'getStampById'
    ]),
    ...mapActions('chara', [
      'getCharaById'
    ]),
    ...mapActions('music', [
      'getMusicById'
    ]),
    padEventId (evtId) {
      return String(evtId).length === 1 ? `0${String(evtId)}` : String(evtId)
    }
  },
  beforeDestroy () {
    let aplayer = this.$refs.player.control
    if (aplayer) aplayer.destroy()
  }
}
</script>

<style lang="stylus" scoped>

</style>
