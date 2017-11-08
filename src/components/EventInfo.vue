<template>
  <div>
    <q-card v-if="isEventReady">
      <q-card-media>
        <div v-if="currentEvent.eventType === 'challenge' || currentEvent.eventType === 'versus'" class="event-cover"
          :style="{ 'background-image': `url(/assets/event/${currentEvent.assetBundleName}/topscreen_trim_eventtop.png), url(/assets/event/${currentEvent.assetBundleName}/topscreen_bg_eventtop.png)` }"></div>
        <div v-else class="event-cover" :style="{ 'background-image': `url(/assets/event/${currentEvent.assetBundleName}/topscreen_bg_eventtop.png)` }"></div>
        <q-card-title slot="overlay">
          {{currentEvent.eventName}}
          <span slot="subtitle" class="text-white">{{$t('event-type')}} {{currentEvent.eventType}}</span>
        </q-card-title>
      </q-card-media>
      <q-card-main style="text-align: center">
        <img class="responsive" v-lazy="`/assets/homebanner_banner_event${currentEvent.eventId}.png`"/>
        <div><a-player :music="eventMusic" ref="player" mode="single"></a-player></div>
        <p v-if="Number(currentEvent.endAt) > Date.now()">{{$t('event-end-cd')}}</p>
        <count-down :target-time="Number(currentEvent.endAt)" v-if="Number(currentEvent.endAt) > Date.now()"></count-down>
        <p v-if="Number(currentEvent.endAt) < Date.now() && Number(currentEvent.distributionStartAt) > Date.now()">{{$t('event-dist-cd')}}</p>
        <count-down :target-time="Number(currentEvent.distributionStartAt)" v-if="Number(currentEvent.endAt) < Date.now() && Number(currentEvent.distributionStartAt) > Date.now()"></count-down>
        <p v-if="Number(currentEvent.distributionStartAt) < Date.now() && Number(currentEvent.publicEndAt) > Date.now()">{{$t('next-event-cd')}}</p>
        <count-down :target-time="Number(currentEvent.publicEndAt)" v-if="Number(currentEvent.distributionStartAt) < Date.now() && Number(currentEvent.publicEndAt) > Date.now()"></count-down>
        <p>{{$t('event-reward-card')}}</p>
        <div class="card-small"
          @click="$refs.cMnormal.open()">
          <span class="row justify-center items-center">
            <card-thumb :cardId="Number(eventNormalCard.cardId)"></card-thumb>
            {{charaMap[eventNormalCard.characterId].characterName}} <q-btn flat round small class="text-pink"><q-icon name="launch" /></q-btn>
          </span>
        </div>
        <card-modal ref="cMnormal" :cardInfo="eventNormalCard"
          :characterInfo="charaMap[eventNormalCard.characterId]"
          :skillInfo="skillMap[eventNormalCard.cardId]"></card-modal>
        <div class="card-small"
          @click="$refs.cMspecial.open()">
          <span class="row justify-center items-center">
            <card-thumb :cardId="Number(eventSpecialCard.cardId)"></card-thumb>
            {{charaMap[eventSpecialCard.characterId].characterName}} <q-btn flat round small class="text-pink"><q-icon name="launch" /></q-btn>
          </span>
        </div>
        <card-modal ref="cMspecial" :cardInfo="eventSpecialCard"
          :characterInfo="charaMap[eventSpecialCard.characterId]"
          :skillInfo="skillMap[eventSpecialCard.cardId]"></card-modal>
        <p>{{$t('event-reward-stamp')}}</p>
        <img v-if="eventRewardStamp" v-lazy="`/assets/stamp/01_${eventRewardStamp.imageName}.png`"></img>
        <p>{{$t('event-bonus-attr-card')}}</p>
        <img class="responsive" style="max-width: 100%;" v-lazy="`/assets/event/${currentEvent.assetBundleName}/images_event_point_banner.png`">
        <p>{{$t('event-badge')}}</p>
        <img class="badge" v-lazy="`/assets/thumb/common_${eventBadgeMap[currentEvent.eventId].badgeAssetBundleName}.png`">
        <p>{{$t('event-degrees')}}</p>
        <img class="event-degree" :style="{ 'background-image': `url(/assets/thumb/degree_event_point_icon_1.png), url(/assets/thumb/degree_event_point_1.png), url(/assets/thumb/degree_${degreeMap[currentEvent.rankingRewards[0].rewardId].imageName}.png)` }">
        <span v-if="currentEvent.eventType === 'challenge'">
          <img class="event-degree" v-for="eventMusic in currentEvent.detail.eventMusic" :key="eventMusic.seq"
          :style="{ 'background-image': `url(/assets/thumb/degree_opening_1_1.png), url(/assets/thumb/degree_score_ranking_1.png), url(/assets/thumb/degree_${degreeMap[eventMusic.musicRankingRewards[0].rewardId].imageName}.png)` }">
        </span>
        <span v-if="currentEvent.eventType === 'challenge'">
          <p>{{$t('event-musics')}}</p>
          <img v-for="eventMusic in currentEvent.detail.eventMusic" :key="eventMusic.seq" v-lazy="`/assets/musicjacket/${musicList.find(elem => elem.id === eventMusic.musicId).jacketImage}_thumb.png`"
            style="margin: 0 5px; cursor: pointer;" @click="$router.push({ name: 'musicDetail', params: { musicId: eventMusic.musicId } })">
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
    "title": ["Welcome to", "Database!"],
    "event-type": "Event type:",
    "event-end-cd": "Event ending countdown",
    "event-dist-cd": "Event distribution countdown",
    "next-event-cd": "Next event countdown",
    "event-reward-card": "Reward cards",
    "event-reward-stamp": "Reward stamp",
    "event-bonus-attr-card": "Bonus attribute and cards",
    "event-badge": "Event badge",
    "event-degrees": "Degrees preview",
    "event-musics": "Event musics",
    "fetch-event-data": "Fetching Event Data..."
  },
  "zh-CN": {
    "title": ["欢迎访问", "数据库!"],
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
  "zh-TW": {
    "title": ["歡迎訪問", "數據庫!"],
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
  QSpinner
} from 'quasar'
import { mapState, mapActions } from 'vuex'
import VueAplayer from 'vue-aplayer'
import CountDown from './common/Countdown'
import cardModal from './modals/Card'
import cardThumb from './common/CardThumb'

export default {
  name: 'EventInfo',
  components: {
    CountDown,
    cardModal,
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
    cardThumb
  },
  data () {
    return {
      isEventReady: false,
      eventNormalCard: null,
      eventSpecialCard: null,
      eventRewardStamp: null
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getCurrentEvent()
      const eventCards = this.currentEvent.pointRewards.filter(elem => elem.rewardType === 'situation')
      this.eventNormalCard = await this.getCardById(eventCards[0].rewardId)
      this.eventSpecialCard = await this.getCardById(eventCards[1].rewardId)
      await this.getSkillById(this.eventNormalCard.cardId)
      await this.getSkillById(this.eventSpecialCard.cardId)
      await this.getCharaById(this.eventNormalCard.characterId)
      await this.getCharaById(this.eventSpecialCard.characterId)
      this.eventRewardStamp = await this.getStampById(this.currentEvent.pointRewards.find(reward => reward.rewardType === 'stamp').rewardId)
      await this.getEventBadgeById(this.currentEvent.eventId)
      await this.getDegreeById(this.currentEvent.rankingRewards[0].rewardId)
      this.isEventReady = true
    })
  },
  computed: {
    ...mapState('event', [
      'currentEvent',
      'eventBadgeMap',
      'degreeMap'
    ]),
    ...mapState('card', [
      'cardMap',
      'skillMap'
    ]),
    ...mapState('chara', [
      'charaMap'
    ]),
    ...mapState('stamp', [
      'stampMap'
    ]),
    eventMusic () {
      const arr = this.currentEvent.bgmAssetBundleName.split('/')
      return {
        title: this.currentEvent.eventName,
        author: 'Event BGM',
        url: `/assets/${arr.slice(0, arr.length - 1).join('/')}/${this.currentEvent.bgmFileName}.mp3`,
        pic: `/assets/event/${this.currentEvent.assetBundleName}/images_logo.png`
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
    ])
  },
  beforeDestroy () {
    let aplayer = this.$refs.player.control
    if (aplayer) aplayer.destroy()
  }
}
</script>

<style lang="stylus">
.event-cover
  width: 100%
  height: 501px
  background-size: auto 100%, 100% 100%
  background-repeat: no-repeat
  background-position: center, center

.thumb
  width 48px
  height 48px
  margin-right 10px

.badge
  width 96px
  height 96px

.card-small
  cursor pointer
  margin 10px 0

.event-degree
  width 230px
  height 50px
  background-repeat no-repeat

</style>
