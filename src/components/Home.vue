<template>
  <div>
    
    <div class="row justify-center items-center sm-column">
      <h4 class="width-1of4">Welcome to</h4>
      <img src="~assets/h1.png" class="width-1of4 responsive">
      <h4 class="width-1of4">Data Viewer!</h4>
    </div>

    <div class="column items-center">
      <router-link to="/donate" tag="h5"><a>If you love this site, you can support me to make it better!</a></router-link>
    </div>

    <div class="column gutter" v-if="getMasterDBStatus === 2">
      <q-card v-if="latestEvent.enableFlag">
        <!-- <div class="item two-lines bg-pink">
          <img class="item-primary responsive" v-lazy="`https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/images_logo.png`">
        </div> -->
        <q-card-media>
          <div class="event-cover" v-lazy:background-image="latestEvent.eventType === 'story' ? `https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/topscreen_bg_eventtop.png` : `https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/topscreen_trim_eventtop.png`" />
          <!-- Notice the slot="overlay" -->
          <q-card-title slot="overlay">
            {{latestEvent.eventName}}
            <span slot="subtitle">Event type: {{latestEvent.eventType}}</span>
          </q-card-title>
        </q-card-media>
        <q-card-main>
          <div><a-player :music="eventMusic"></a-player></div>
          <div class="column items-center latest-event">
            <p>Event ending countdown</p>
            <count-down :target-time="Number(latestEvent.endAt)"></count-down>
            <p>Reward cards</p>
            <div class="row justify-center items-center sm-column card-small"
              @click="$refs.cMnormal.$refs.cardModal.open()">
              N ID: {{getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).cardID, latestEvent.eventType}}
              <span class="row justify-center items-center">
                <img class="thumb responsive" v-lazy="`https://bangdream.ga/assets/thumb/chara/card0000${Math.trunc(getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).cardID / 50)}_${getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).cardRes}_normal.png`">
                {{getCharacter(getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).characterId).characterName}} <q-btn flat round small class="text-pink"><q-icon name="launch" /></q-btn>
              </span>
            </div>
            <card-modal ref="cMnormal" :cardInfo="getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType)"
              :characterInfo="getCharacter(getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).characterId, latestEvent.eventType)"
              :skillName="skillMap[getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).cardID].skillName"
              :skillId="Number(skillMap[getEventNormalCard(latestEvent.pointRewards, latestEvent.eventType).cardID].skillID)"></card-modal>
            <div class="row justify-center items-center sm-column card-small"
              @click="$refs.cMspecial.$refs.cardModal.open()">
              SR ID: {{getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).cardID}}
              <span class="row justify-center items-center">
                <img class="thumb responsive" v-lazy="`https://bangdream.ga/assets/thumb/chara/card0000${Math.trunc(getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).cardID / 50)}_${getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).cardRes}_normal.png`">
                {{getCharacter(getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).characterId).characterName}} <q-btn flat round small class="text-pink"><q-icon name="launch" /></q-btn>
              </span>
            </div>
            <card-modal ref="cMspecial" :cardInfo="getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType)"
              :characterInfo="getCharacter(getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).characterId)"
              :skillName="skillMap[getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).cardID].skillName"
              :skillId="Number(skillMap[getEventSpecialCard(latestEvent.pointRewards, latestEvent.eventType).cardID].skillID)"></card-modal> 
            <p>Bonus cards</p>
            <img class="responsive" style="max-width: 100%;" v-lazy="`https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/images_event_point_banner.png`">
          </div>
        </q-card-main>
      </q-card>
      <div class="row sm-column md-column gutter">
        <div class="col-lg-4 col-xl-4 col-12" v-for="gacha in currentGachaList" :key="gacha.gachaId">
          <q-card class="card">
            <q-card-media>
              <div class="gacha-cover" v-lazy:background-image="`https://bangdream.ga/assets/gacha/screen/${gacha.resourceName}_logo.png`" />
              <!-- Notice the slot="overlay" -->
              <q-card-title slot="overlay">
                {{gacha.gachaName}}
              </q-card-title>
            </q-card-media>
            <div class="gacha-img" v-lazy:background-image="`https://bangdream.ga/assets/gacha/screen/${gacha.resourceName}_pickup${gacha.gachaId === '121' ? '1' : ''}.png`" />
            <div class="card-content column items-center" style="margin: 15px 0">
              <p>Gacha ending countdown</p>
              <count-down :target-time="Number(gacha.closedAt)" small></count-down>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <!--<div class="column items-center latest-event" v-if="getMasterDBStatus === 2 && latestEvent.enableFlag">
      
      <p>Current event:</p>
      <h5>{{latestEvent.eventName}} <button class="circular clear pink small"><i>launch</i></button></h5>

    </div>-->

    <!--<div class="column items-center" v-if="latestCard.cardRes">
      Current gachas-->
      <!--<div class="row justify-center items-center sm-column card-small"
        @click="$router.push({ name: 'cardDetail', params: { cardID: latestCard.cardID } })">
        ID: {{latestCard.cardID}}
        <span class="row justify-center items-center">
          <img class="thumb" v-lazy="`https://bangdream.ga//assets/thumb/chara/card0000${Math.trunc(latestCard.cardID / 50)}_${latestCard.cardRes}_normal.png`">
          {{getCharacter(latestCard.characterId).characterName}}
        </span>
      </div>-->
      
    <!--</div>-->
    <!--<card :cardInfo="latestCard" :characterInfo="latestCharacter"></card>-->
  </div>
</template>

<script>
import {
  QCard,
  QCardTitle,
  QCardMedia,
  QCardMain,
  QIcon,
  QBtn
} from 'quasar'
import { mapGetters, mapState } from 'vuex'
import VueAplayer from 'vue-aplayer'
import CountDown from './common/Countdown'
import cardModal from './modals/Card'

export default {
  name: 'HomeView',
  data () {
    return {
      // latestCardID: 0
    }
  },
  components: {
    CountDown,
    cardModal,
    aPlayer: VueAplayer,
    QCard,
    QCardTitle,
    QCardMedia,
    QCardMain,
    QIcon,
    QBtn
  },
  computed: {
    ...mapGetters('DB', [
      'cardInfos',
      'characterInfos',
      'eventMap',
      'homeBannerList',
      'gachaList',
      'skillInfos',
      'skillMap'
    ]),
    ...mapState('DB', [
      'getMasterDBStatus',
      'getLive2DDBStatus'
    ]),
    latestCard () {
      if (this.getMasterDBStatus !== 2) return {cardID: 0}
      const retKey = Object.keys(this.cardInfos).slice(-1)
      return this.cardInfos[retKey]
      // don't know why CloudFlare reject the image request
      // return `https://bangdream.ga//assets/thumb/chara/card0000${latestCardGroup}_${latestCard.detail.cardRes}_normal.png`
    },
    latestEvent () {
      if (this.getMasterDBStatus !== 2) return {eventID: 0}
      const retKey = Object.keys(this.eventMap).slice(-1)
      // console.log(this.eventMap[retKey])
      return this.eventMap[retKey]
    },
    currentHomeBanner () {
      if (this.getMasterDBStatus !== 2) return []
      return this.homeBannerList
        .filter(elem => Number(elem.publishedAt) < Date.now() && Number(elem.closedAt) > Date.now())
        .filter(elem => elem.assetBundleName.indexOf('event') !== -1 || elem.assetBundleName.indexOf('gacha') !== -1)
        .map(elem => `https://bangdream.ga/assets/homebanner_${elem.assetBundleName}.png`)
    },
    currentGachaList () {
      if (this.getMasterDBStatus !== 2) return []
      return this.gachaList.filter(elem => Number(elem.publishedAt) < Date.now() && Number(elem.closedAt) > Date.now() && elem.closedAt.substring(0, 1) !== '4')
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
    getCharacter (characterId) {
      return this.characterInfos[characterId]
    }
  }
}
</script>

<style lang="stylus" scoped>
.thumb
  width 48px
  height 48px
  margin-right 10px

.card-small
  cursor pointer
  margin 10px 0

.event-cover
  width: 100%
  height: 400px
  background-size: cover
  background-repeat: no-repeat
  background-position: center
  
.gacha-cover
  width: 100%
  height: 200px
  background-size: cover
  background-repeat: no-repeat
  background-position: center

.gacha-img
  width: 100%
  height: 500px
  background-size: cover
  background-repeat: no-repeat
  background-position: center
</style>
