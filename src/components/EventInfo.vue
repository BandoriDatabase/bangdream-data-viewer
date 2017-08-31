<template>
  <div>
    <q-card v-if="latestEvent.enableFlag">
      <q-card-media>
        <div v-if="challengeEventDetailMap" class="event-cover" :style="{ 'background-image': `url(https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/topscreen_trim_eventtop.png), url(https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/topscreen_bg_eventtop.png)` }"></div>
        <div v-else class="event-cover" :style="{ 'background-image': `url(https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/topscreen_bg_eventtop.png)` }"></div>
        <q-card-title slot="overlay">
          {{latestEvent.eventName}}
          <span slot="subtitle" class="text-white">{{$t('event-type')}} {{latestEvent.eventType}}</span>
        </q-card-title>
      </q-card-media>
      <q-card-main style="text-align: center">
        <img class="responsive" v-lazy="`https://bangdream.ga/assets/homebanner_banner_event${latestEvent.eventID}.png`"/>
        <div><a-player :music="eventMusic" ref="player" mode="single"></a-player></div>
        <p v-if="Number(latestEvent.endAt) > Date.now()">{{$t('event-end-cd')}}</p>
        <count-down :target-time="Number(latestEvent.endAt)" v-if="Number(latestEvent.endAt) > Date.now()"></count-down>
        <p v-if="Number(latestEvent.endAt) < Date.now() && Number(latestEvent.distributionStartAt) > Date.now()">{{$t('event-dist-cd')}}</p>
        <count-down :target-time="Number(latestEvent.distributionStartAt)" v-if="Number(latestEvent.endAt) < Date.now() && Number(latestEvent.distributionStartAt) > Date.now()"></count-down>
        <p v-if="Number(latestEvent.distributionStartAt) < Date.now() && Number(latestEvent.publicEndAt) > Date.now()">{{$t('next-event-cd')}}</p>
        <count-down :target-time="Number(latestEvent.publicEndAt)" v-if="Number(latestEvent.distributionStartAt) < Date.now() && Number(latestEvent.publicEndAt) > Date.now()"></count-down>
        <p>{{$t('event-reward-card')}}</p>
        <div class="row justify-center items-center sm-column card-small"
          @click="$refs.cMnormal.$refs.cardModal.open()">
          N ID: {{getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).cardID, latestEvent.eventType}}
          <span class="row justify-center items-center">
            <img class="thumb responsive" v-lazy="`https://bangdream.ga/assets/thumb/chara/card0000${Math.trunc(getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).cardID / 50)}_${getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).cardRes}_normal.png`">
            {{getCharacter(getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).characterID).characterName}} <q-btn flat round small class="text-pink"><q-icon name="launch" /></q-btn>
          </span>
        </div>
        <card-modal ref="cMnormal" :cardInfo="getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType)"
          :characterInfo="getCharacter(getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).characterID, latestEvent.eventType)"
          :skillName="skillMap[getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).cardID].skillName"
          :skillID="Number(skillMap[getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).cardID].skillID)"></card-modal>
        <div class="row justify-center items-center sm-column card-small"
          @click="$refs.cMspecial.$refs.cardModal.open()">
          SR ID: {{getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).cardID}}
          <span class="row justify-center items-center">
            <img class="thumb responsive" v-lazy="`https://bangdream.ga/assets/thumb/chara/card0000${Math.trunc(getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).cardID / 50)}_${getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).cardRes}_normal.png`">
            {{getCharacter(getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).characterID).characterName}} <q-btn flat round small class="text-pink"><q-icon name="launch" /></q-btn>
          </span>
        </div>
        <card-modal ref="cMspecial" :cardInfo="getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType)"
          :characterInfo="getCharacter(getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).characterID)"
          :skillName="skillMap[getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).cardID].skillName"
          :skillID="Number(skillMap[getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).cardID].skillID)"></card-modal>
        <p>{{$t('event-reward-stamp')}}</p>
        <img v-if="eventRewardStamp" v-lazy="`https://bangdream.ga/assets/stamp/01_${eventRewardStamp.imageName}_icon.png`"></img>
        <p>{{$t('event-bonus-attr-card')}}</p>
        <img class="responsive" style="max-width: 100%;" v-lazy="`https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/images_event_point_banner.png`">
        <p>{{$t('event-badge')}}</p>
        <img class="badge" v-if="challengeEventDetailMap" v-lazy="`https://bangdream.ga/assets/thumb/common_${eventBadgeMap[challengeEventBadgeMap[latestEvent.eventID].details[0].badgeID].badgeAssetBundleName}.png`">
        <img class="badge" v-else v-lazy="`https://bangdream.ga/assets/thumb/common_${eventBadgeMap[Object.keys(eventBadgeMap).find(elem => eventBadgeMap[elem].eventID === latestEvent.eventID)].badgeAssetBundleName}.png`">
        <p>{{$t('event-degrees')}}</p>
        <img class="event-degree" :style="{ 'background-image': `url(https://bangdream.ga/assets/thumb/degree_event_point_icon_1.png), url(https://bangdream.ga/assets/thumb/degree_event_point_1.png), url(https://bangdream.ga/assets/thumb/degree_${degreeMap[latestEvent.rankingRewards[0].rewardID].imageName}.png)` }">
        <span v-if="challengeEventDetailMap">
          <img class="event-degree" v-for="eventMusic in challengeEventDetailMap[latestEvent.eventID].eventMusic" :key="eventMusic.seq"
          :style="{ 'background-image': `url(https://bangdream.ga/assets/thumb/degree_opening_1_1.png), url(https://bangdream.ga/assets/thumb/degree_score_ranking_1.png), url(https://bangdream.ga/assets/thumb/degree_${degreeMap[eventMusic.musicRankingRewards[0].rewardID].imageName}.png)` }">
        </span>
        <span v-if="challengeEventDetailMap">
          <p>{{$t('event-musics')}}</p>
          <img v-for="eventMusic in challengeEventDetailMap[latestEvent.eventID].eventMusic" :key="eventMusic.seq" v-lazy="`https://bangdream.ga/assets/musicjacket/${musicList.find(elem => elem.id === eventMusic.musicID).jacketImage}_thumb.png`"
            style="margin: 0 5px; cursor: pointer;" @click="$router.push({ name: 'musicDetail', params: { musicID: eventMusic.musicID } })">
        </span>
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
    "event-degrees": "Degress preview",
    "event-musics": "Event musics"
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
    "event-musics": "活动曲"
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
    "event-musics": "活動曲"
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
  QItemSeparator
} from 'quasar'
import { mapGetters, mapState } from 'vuex'
import VueAplayer from 'vue-aplayer'
import CountDown from './common/Countdown'
import cardModal from './modals/Card'

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
    QItemSeparator
  },
  computed: {
    ...mapGetters('DB', [
      'cardInfos',
      'characterInfos',
      'eventMap',
      'challengeEventBadgeMap',
      'challengeEventDetailMap',
      'skillInfos',
      'skillMap',
      'stampMap',
      'eventBadgeMap',
      'degreeMap',
      'musicList'
    ]),
    ...mapState('DB', [
      'getMasterDBStatus',
      'getLive2DDBStatus'
    ]),
    latestEvent () {
      if (this.getMasterDBStatus !== 2) return {eventID: 0}
      const retKey = Object.keys(this.eventMap).slice(-1)
      // console.log(this.eventMap[retKey])
      return this.eventMap[retKey]
    },
    eventMusic () {
      if (this.getMasterDBStatus !== 2) {
        return {
          title: 'Preparation',
          author: 'Hans Zimmer/Richard Harvey',
          url: 'http://devtest.qiniudn.com/Preparation.mp3',
          pic: 'http://devtest.qiniudn.com/Preparation.jpg',
          lrc: '[00:00.00]lrc here\n[00:01.00]aplayer'
        }
      }
      const arr = this.latestEvent.bgmAssetBundleName.split('/')
      return {
        title: this.latestEvent.eventName,
        author: 'Event BGM',
        url: `https://bangdream.ga/assets/${arr.slice(0, arr.length - 1).join('/')}/${this.latestEvent.bgmFileName}.mp3`,
        pic: `https://bangdream.ga/assets/event/${this.latestEvent.assetBundleName}/images_logo.png`
      }
    },
    eventRewardStamp () {
      if (this.getMasterDBStatus !== 2) {
        return null
      }
      return this.stampMap[this.latestEvent.pointRewards.find(reward => reward.rewardType === 'stamp').rewardID]
    }
  },
  methods: {
    getEventNormalCard (rewards, eventType) {
      let normalRewardPoint
      switch (eventType) {
        case 'story':
          normalRewardPoint = '30000'
          break
        case 'challenge':
          normalRewardPoint = '20000'
          break
      }
      const normalID = rewards.find(elem => elem.point === normalRewardPoint).rewardID
      return this.cardInfos[normalID]
    },
    getEventSpecialCard (rewards, eventType) {
      let specialRewardPoint
      switch (eventType) {
        case 'story':
          specialRewardPoint = '150000'
          break
        case 'challenge':
          specialRewardPoint = '100000'
          break
      }
      const specialID = rewards.find(elem => elem.point === specialRewardPoint).rewardID
      return this.cardInfos[specialID]
    },
    getCharacter (characterID) {
      return this.characterInfos[characterID]
    }
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

.card-img-attr-powerful
  width: 50px
  height: 50px
  background: url('~assets/MenuAtlas.png') no-repeat -1448px -211px

.card-img-attr-cool
  width: 50px
  height: 50px
  background: url('~assets/MenuAtlas.png') no-repeat -1448px -55px

.card-img-attr-happy
  width: 50px
  height: 50px
  background: url('~assets/MenuAtlas.png') no-repeat -1448px -263px

.card-img-attr-pure
  width: 50px
  height: 50px
  background: url('~assets/MenuAtlas.png') no-repeat -1448px -159px

.event-degree
  width 230px
  height 50px
  background-repeat no-repeat

</style>
