<template>
  <div>
    <div class="row justify-center items-center" style="text-align: center;">
      <h4 class="col-lg-3 col-xl-3 col-12">{{$t('title[0]')}}</h4>
      <img src="~assets/h1.png" class="col-lg-3 col-xl-3 col-12 responsive">
      <h4 class="col-lg-3 col-xl-3 col-12">{{$t('title[1]')}}</h4>
    </div>

    <!-- <div class="column items-center">
      <router-link to="/donate" tag="h5"><a>If you love this site, you can support me to make it better!</a></router-link>
    </div> -->

    <div class="row gutter" v-if="getMasterDBStatus === 2">
      <div class="col-lg-4 col-xl-4 col-12 card">
        <q-card v-if="latestEvent.enableFlag">
          <q-card-title class="bg-pink text-white">
            {{latestEvent.eventName}}
            <span slot="subtitle" class="text-white">{{$t('event-type')}} {{latestEvent.eventType}}</span>
          </q-card-title>
          <q-card-media>
            <!-- <img class="event-cover preview-img" v-lazy:background-image="latestEvent.eventType === 'story' ? `https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/topscreen_bg_eventtop.png` : `https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/topscreen_trim_eventtop.png`" 
              @click="$preview.open(0, [{
                src: latestEvent.eventType === 'story' ? `https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/topscreen_bg_eventtop.png` : `https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/topscreen_trim_eventtop.png`,
                w: 1334,
                h: 1002
              }], {
                fullscreenEl: true,
                zoomEl: true,
                shareEl: true,
                history: false
              })"/> -->
            <img v-lazy="`https://bangdream.ga/assets/homebanner_banner_event${latestEvent.eventID}.png`" alt="" class="event-banner" />
          </q-card-media>
          <q-card-main>
            <div><a-player :music="eventMusic" ref="player" mode="single"></a-player></div>
            <div class="column items-center latest-event">
              <!-- <p>{{$t('event-end-cd')}}</p> -->
              <count-down :target-time="Number(latestEvent.endAt)" v-if="Number(latestEvent.endAt) > Date.now()"></count-down>
              <count-down :target-time="Number(latestEvent.distributionEndAt)" v-if="Number(latestEvent.distributionStartAt) < Date.now()"></count-down>
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
              <!-- <p>{{$t('event-bonus-card')}}</p>
              <img class="responsive" style="max-width: 100%;" v-lazy="`https://bangdream.ga/assets/event/${latestEvent.assetBundleName}/images_event_point_banner.png`"> -->
            </div>
          </q-card-main>
        </q-card>
      </div>

      <div class="col-lg-4 col-xl-4 col-12">
        <q-card>
          <q-card-title class="bg-pink text-white">
            {{$t('gache-list')}}
            <span slot="subtitle" class="text-white">{{$t('gacha-list-count')}}: {{currentGachaList.length}}</span>
          </q-card-title>
          <q-card-main>
            <div v-for="gacha in currentGachaList" :key="gacha.gachaID" style="width: 100%; margin: 10px 0;">
              <img v-lazy="`https://bangdream.ga/assets/gacha/screen/${gacha.resourceName}_logo.png`" alt="" class="gacha-banner" />
              <count-down :target-time="Number(gacha.closedAt)"></count-down>
            </div>
          </q-card-main>
        </q-card>
      </div>

      <div class="col-lg-4 col-xl-4 col-12">
        <q-card>
          <q-card-title class="bg-pink text-white">
            {{$t('info-list')}}
          </q-card-title>
          <!-- <q-card-main> -->
            <q-list :highlight="false">
              <q-list-header>{{$t('info-update')}}</q-list-header>
              <q-item>
                <span v-html="$t('update[0]')"></span>
              </q-item>
              <q-item>
                <span v-html="$t('update[1]')"></span>
              </q-item>
              <q-item-separator />
              <q-list-header>{{$t('info-links')}}</q-list-header>
              <q-list-header>EN</q-list-header>
              <q-item>
                <a href="https://discord.gg/vGb3eHH" target="_blank">
                  <discord-icon style="display: inline-block;" />
                  <span>Discord</span>
                </a>
              </q-item>
              <q-item>
                <a href="https://www.reddit.com/r/BanGDream/" target="_blank">
                  <reddit-icon style="display: inline-block;" />
                  <span>Reddit</span>
                </a>
              </q-item>
              <q-item>
                <a href="https://twitter.com/BandoriD" target="_blank">
                  <twitter-icon style="display: inline-block;" />
                  <span>@BandoriD</span>
                </a>
              </q-item>
              <q-item>
                <a href="https://twitter.com/bandori_updates" target="_blank">
                  <twitter-icon style="display: inline-block;" />
                  <span>@bandori_updates</span>
                </a>
              </q-item>
              <q-list-header>CN</q-list-header>
              <q-item>
                <a href="https://www.bangdream.moe/" target="_blank">
                <img src="https://www.bangdream.moe/favicon.ico" style="height: 24px; width: 24px" />
                  BanG Dream!导航站
                </a>
              </q-item>
              <q-item>
                <a href="https://www.bangdreamwiki.com/" target="_blank">
                <img src="https://www.bangdreamwiki.com/favicon.ico" style="height: 24px; width: 24px" />
                  BanG Dream! WiKi!
                </a>
              </q-item>
              <q-item>
                <a href="https://forum.gamer.com.tw/A.php?bsn=31877" target="_blank">
                <img src="https://forum.gamer.com.tw/favicon.ico" style="height: 24px; width: 24px" />
                  BanG Dream！少女樂團派對 哈啦板 - 巴哈姆特
                </a>
              </q-item>
              <q-item>
                <a href="https://kekeke.cc/bang_dream_gbp" target="_blank">
                <img src="https://kekeke.cc/favicon.ico" style="height: 24px; width: 24px" />
                  bang_dream_gbp/kekeke.cc
                </a>
              </q-item>
              <q-list-header>JP</q-list-header>
              <q-item>
                <a href="https://bang-dream.bushimo.jp/" target="_blank">
                  <img src="https://bang-dream.bushimo.jp/wp-content/themes/bandre2017/assets/images/favicon.ico" style="height: 24px; width: 24px" />
                  Game offcial site
                </a>
              </q-item>
              <q-item>
                <a href="https://twitter.com/bang_dream_gbp" target="_blank">
                  <twitter-icon style="display: inline-block;" />
                  <span>@bang_dream_gbp</span>
                </a>
              </q-item>
              <q-item>
                <a href="https://bang-dream.com/" target="_blank">
                  <img src="https://bang-dream.com/wp/wp-content/themes/bang-dream-1701-2/icon/favicon.ico" style="height: 24px; width: 24px" />
                  Project site
                </a>
              </q-item>
              <q-item>
                <a href="https://twitter.com/bang_dream_info" target="_blank">
                  <twitter-icon style="display: inline-block;" />
                  <span>@bang_dream_info</span>
                </a>
              </q-item>
            </q-list>
          <!-- </q-card-main> -->
        </q-card>
      </div>
      
      <!-- <div class="row sm-column md-column gutter"> -->
        <!-- <div class="col-lg-4 col-xl-4 col-12" v-for="gacha in currentGachaList" :key="gacha.gachaID">
          <q-card>
            <q-card-media>
              <div class="gacha-cover" v-lazy:background-image="`https://bangdream.ga/assets/gacha/screen/${gacha.resourceName}_logo.png`" />
              <q-card-title slot="overlay">
                {{gacha.gachaName}}
              </q-card-title>
            </q-card-media>
            <div class="gacha-img" v-lazy:background-image="`https://bangdream.ga/assets/gacha/screen/${gacha.resourceName}_pickup${gacha.gachaID === '121' ? '1' : ''}.png`" />
            <div class="card-content column items-center" style="margin: 15px 0">
              <p>{{$t('gacha-end-cd')}}</p>
              <count-down :target-time="Number(gacha.closedAt)" small></count-down>
            </div>
          </q-card>
        </div> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "title": ["Welcome to", "Database!"],
    "event-type": "Event type:",
    "event-end-cd": "Event ending countdown",
    "event-reward-card": "Reward cards",
    "event-reward-stamp": "Reward stamp",
    "event-bonus-card": "Bonus cards",
    "gacha-end-cd": "Gacha ending countdown",
    "gache-list": "Current scouts list",
    "gacha-list-count": "Counts",
    "info-list": "Infos and links",
    "info-update": "Recent update",
    "info-links": "External links",
    "update": [
      "We have our Discord server and official twitter now! Click the links below!",
      "Pages added: card gallery and detailed current event info"
    ]
  },
  "zh-CN": {
    "title": ["欢迎访问", "数据库!"],
    "event-type": "活动类型：",
    "event-end-cd": "离活动结束还有",
    "event-reward-card": "奖励卡片",
    "event-reward-stamp": "奖励表情",
    "event-bonus-card": "加成卡牌",
    "gacha-end-cd": "抽卡倒计时",
    "gache-list": "当前开放卡池",
    "gacha-list-count": "数量",
    "info-list": "公告及友链",
    "info-update": "最近更新",
    "info-links": "友情链接",
    "update": [
      "我们有Discord服务器和官方Twitter了！点击下面的链接查看！",
      "新增了卡牌大图浏览模式和当前进行中活动详细信息页"
    ]
  },
  "zh-TW": {
    "title": ["歡迎訪問", "數據庫!"],
    "event-type": "活動類型：",
    "event-end-cd": "離活動結束還有",
    "event-reward-card": "獎勵卡片",
    "event-reward-stamp": "獎勵表情",
    "event-bonus-card": "加成卡牌",
    "gacha-end-cd": "抽卡倒計時",
    "gache-list": "當前開放卡池",
    "gacha-list-count": "數量",
    "info-list": "公告及友鏈",
    "info-update": "最近更新",
    "info-links": "友情鏈接",
    "update": [
      "我們有Discord服務器和官方Twitter了！點擊下面的鏈接查看！",
      "新增了卡牌大圖瀏覽模式和當前進行中活動詳細信息頁"
    ]
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

import discordIcon from 'icons/discord'
import redditIcon from 'icons/reddit'
import twitterIcon from 'icons/twitter'

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
    QBtn,
    discordIcon,
    QList,
    QListHeader,
    QItem,
    QItemSeparator,
    redditIcon,
    twitterIcon
  },
  beforeDestroy () {
    let aplayer = this.$refs.player.control
    aplayer.destroy()
  },
  computed: {
    ...mapGetters('DB', [
      'cardInfos',
      'characterInfos',
      'eventMap',
      'homeBannerList',
      'gachaList',
      'skillInfos',
      'skillMap',
      'stampMap'
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
      // return `https://bangdream.ga/assets/thumb/chara/card0000${latestCardGroup}_${latestCard.detail.cardRes}_normal.png`
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
        case 'versus':
          normalRewardPoint = '50000'
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
        case 'versus':
          specialRewardPoint = '150000'
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

<style lang="stylus" scoped>
.thumb
  width 48px
  height 48px
  margin-right 10px

.card-small
  cursor pointer
  margin 10px 0

.event-banner
  width 420px
  height 120px
  // background-size: cover
  // background-repeat: no-repeat
  // background-position: center
  margin 0 auto
  max-width 100%

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
