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
            <!-- <img class="event-cover preview-img" v-lazy:background-image="latestEvent.eventType === 'story' ? `/assets/event/${latestEvent.assetBundleName}/topscreen_bg_eventtop.png` : `/assets/event/${latestEvent.assetBundleName}/topscreen_trim_eventtop.png`" 
              @click="$preview.open(0, [{
                src: latestEvent.eventType === 'story' ? `/assets/event/${latestEvent.assetBundleName}/topscreen_bg_eventtop.png` : `/assets/event/${latestEvent.assetBundleName}/topscreen_trim_eventtop.png`,
                w: 1334,
                h: 1002
              }], {
                fullscreenEl: true,
                zoomEl: true,
                shareEl: true,
                history: false
              })"/> -->
            <img v-lazy="`/assets/homebanner_banner_event${latestEvent.eventId}.png`" alt="" class="event-banner" />
          </q-card-media>
          <q-card-main>
            <div><a-player :music="eventMusic" ref="player" mode="single"></a-player></div>
            <div class="column items-center latest-event">
              <!-- <p>{{$t('event-end-cd')}}</p> -->
              <count-down :target-time="Number(latestEvent.endAt)" v-if="Number(latestEvent.endAt) > Date.now()"></count-down>
              <count-down :target-time="Number(latestEvent.distributionEndAt)" v-if="Number(latestEvent.distributionStartAt) < Date.now()"></count-down>
              <p>{{$t('event-reward-card')}}</p>
              <div class="row justify-center items-center sm-column card-small"
                @click="$refs.cMnormal.open()">
                N id: {{getEventNormalCard(latestEvent.pointRewards).cardId}}
                <span class="row justify-center items-center">
                  <img class="thumb responsive" v-lazy="`/assets/thumb/chara/card0000${Math.trunc(getEventNormalCard(latestEvent.pointRewards).cardId / 50)}_${getEventNormalCard(latestEvent.pointRewards).cardRes}_normal.png`">
                  {{getCharacter(getEventNormalCard(latestEvent.pointRewards).characterId).characterName}} <q-btn flat round small class="text-pink"><q-icon name="launch" /></q-btn>
                </span>
              </div>
              <card-modal ref="cMnormal" :cardInfo="getEventNormalCard(latestEvent.pointRewards)"
                :characterInfo="getCharacter(getEventNormalCard(latestEvent.pointRewards).characterId)"
                :skillName="skillMap[getEventNormalCard(latestEvent.pointRewards).cardId].skillName"
                :skillId="Number(skillMap[getEventNormalCard(latestEvent.pointRewards).cardId].skillId)"></card-modal>
              <div class="row justify-center items-center sm-column card-small"
                @click="$refs.cMspecial.open()">
                SR id: {{getEventSpecialCard(latestEvent.pointRewards).cardId}}
                <span class="row justify-center items-center">
                  <img class="thumb responsive" v-lazy="`/assets/thumb/chara/card0000${Math.trunc(getEventSpecialCard(latestEvent.pointRewards).cardId / 50)}_${getEventSpecialCard(latestEvent.pointRewards).cardRes}_normal.png`">
                  {{getCharacter(getEventSpecialCard(latestEvent.pointRewards).characterId).characterName}} <q-btn flat round small class="text-pink"><q-icon name="launch" /></q-btn>
                </span>
              </div>
              <card-modal ref="cMspecial" :cardInfo="getEventSpecialCard(latestEvent.pointRewards)"
                :characterInfo="getCharacter(getEventSpecialCard(latestEvent.pointRewards).characterId)"
                :skillName="skillMap[getEventSpecialCard(latestEvent.pointRewards).cardId].skillName"
                :skillId="Number(skillMap[getEventSpecialCard(latestEvent.pointRewards).cardId].skillId)"></card-modal>
              <p>{{$t('event-reward-stamp')}}</p>
              <img v-if="eventRewardStamp" v-lazy="`/assets/stamp/01_${eventRewardStamp.imageName}_icon.png`"></img>
              <!-- <p>{{$t('event-bonus-card')}}</p>
              <img class="responsive" style="max-width: 100%;" v-lazy="`/assets/event/${latestEvent.assetBundleName}/images_event_point_banner.png`"> -->
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
            <div v-for="gacha in currentGachaList" :key="gacha.gachaId" style="width: 100%; margin: 10px 0; text-align: center;">
              <img v-lazy="`/assets/gacha/screen/${gacha.resourceName}_logo.png`" alt="" class="gacha-banner" />
              <p>{{gacha.gachaName}}<q-btn flat round small class="text-pink" @click="$refs.gachaModal.open(gacha.gachaId)"><q-icon name="launch" /></q-btn></p>
              <count-down :target-time="Number(gacha.closedAt)"></count-down>
            </div>
            <gacha-modal ref="gachaModal"></gacha-modal>
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
                <a href="http://home.bangdream.space/" target="_blank">
                <img src="https://bangdream.space/favicon.ico" style="height: 24px; width: 24px" />
                  炸帮裂梦乐团Mastodon
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
        <!-- <div class="col-lg-4 col-xl-4 col-12" v-for="gacha in currentGachaList" :key="gacha.gachaId">
          <q-card>
            <q-card-media>
              <div class="gacha-cover" v-lazy:background-image="`/assets/gacha/screen/${gacha.resourceName}_logo.png`" />
              <q-card-title slot="overlay">
                {{gacha.gachaName}}
              </q-card-title>
            </q-card-media>
            <div class="gacha-img" v-lazy:background-image="`/assets/gacha/screen/${gacha.resourceName}_pickup${gacha.gachaId === '121' ? '1' : ''}.png`" />
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
      "Band icons are added to all pages relevant to card",
      "Add gacha detail modal"
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
      "为所有卡面页面增加了乐队标识",
      "增加里卡片详情弹窗"
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
      "為所有卡面頁面增加了樂隊標識",
      "增加裏卡片詳情彈窗"
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
import gachaModal from './modals/Gacha'

import discordIcon from 'icons/discord'
import redditIcon from 'icons/reddit'
import twitterIcon from 'icons/twitter'

export default {
  name: 'HomeView',
  data () {
    return {
      // latestCardid: 0
      log: console.log
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
    twitterIcon,
    gachaModal
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
      if (this.getMasterDBStatus !== 2) return {cardId: 0}
      const retKey = Object.keys(this.cardInfos).slice(-1)
      return this.cardInfos[retKey]
      // don't know why CloudFlare reject the image request
      // return `/assets/thumb/chara/card0000${latestCardGroup}_${latestCard.detail.cardRes}_normal.png`
    },
    latestEvent () {
      if (this.getMasterDBStatus !== 2) return {eventId: 0}
      const retKey = Object.keys(this.eventMap).slice(-1)
      // console.log(this.eventMap[retKey])
      return this.eventMap[retKey]
    },
    currentHomeBanner () {
      if (this.getMasterDBStatus !== 2) return []
      return this.homeBannerList
        .filter(elem => Number(elem.publishedAt) < Date.now() && Number(elem.closedAt) > Date.now())
        .filter(elem => elem.assetBundleName.indexOf('event') !== -1 || elem.assetBundleName.indexOf('gacha') !== -1)
        .map(elem => `/assets/homebanner_${elem.assetBundleName}.png`)
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
        url: `/assets/${arr.slice(0, arr.length - 1).join('/')}/${this.latestEvent.bgmFileName}.mp3`,
        pic: `/assets/event/${this.latestEvent.assetBundleName}/images_logo.png`
      }
    },
    eventRewardStamp () {
      if (this.getMasterDBStatus !== 2) {
        return null
      }
      return this.stampMap[this.latestEvent.pointRewards.find(reward => reward.rewardType === 'stamp').rewardId]
    }
  },
  methods: {
    getEventNormalCard (rewards) {
      const normalid = rewards.filter(elem => elem.rewardType === 'situation')[0].rewardId
      return this.cardInfos[normalid]
    },
    getEventSpecialCard (rewards) {
      const specialid = rewards.filter(elem => elem.rewardType === 'situation')[1].rewardId
      return this.cardInfos[specialid]
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
