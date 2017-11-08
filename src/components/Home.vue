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

    <div class="row gutter">
      <div class="col-lg-4 col-xl-4 col-12 card">
        <q-card v-if="isEventReady">
          <q-card-title class="bg-pink text-white">
            {{currentEvent.eventName}}
            <span slot="subtitle" class="text-white">{{$t('event-type')}} {{currentEvent.eventType}}</span>
          </q-card-title>
          <q-card-media>
            <div v-lazy:background-image="`/assets/homebanner_banner_event${currentEvent.eventId}.png`" alt="" class="event-banner" />
          </q-card-media>
          <q-card-main>
            <div><a-player :music="eventMusic" ref="player" mode="single"></a-player></div>
            <div class="column items-center latest-event">
              <!-- <p>{{$t('event-end-cd')}}</p> -->
              <count-down :target-time="Number(currentEvent.endAt)" v-if="Number(currentEvent.endAt) > Date.now()"></count-down>
              <count-down :target-time="Number(currentEvent.distributionEndAt)" v-if="Number(currentEvent.distributionStartAt) < Date.now()"></count-down>
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
              <img v-if="eventRewardStamp" v-lazy="`/assets/stamp/01_${eventRewardStamp.imageName}_icon.png`"></img>
              <!-- <p>{{$t('event-bonus-card')}}</p>
              <img class="responsive" style="max-width: 100%;" v-lazy="`/assets/event/${currentEvent.assetBundleName}/images_event_point_banner.png`"> -->
            </div>
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

      <div class="col-lg-4 col-xl-4 col-12">
        <q-card v-if="isGcahaReady">
          <q-card-title class="bg-pink text-white">
            {{$t('gache-list')}}
            <span slot="subtitle" class="text-white">{{$t('gacha-list-count')}}: {{currentGachaList.length}}</span>
          </q-card-title>
          <q-card-main>
            <div v-for="gacha in currentGachaList" :key="gacha.gachaId" style="width: 100%; margin: 10px 0; text-align: center;">
              <img v-lazy="`/assets/gacha/screen/${gacha.resourceName}_logo.png`" alt="" class="gacha-banner" />
              <p>{{gacha.gachaName}}<q-btn flat round small class="text-pink" @click="$refs.gachaModal.open(gacha)"><q-icon name="launch" /></q-btn></p>
              <count-down :target-time="Number(gacha.closedAt)"></count-down>
            </div>
            <gacha-modal ref="gachaModal"></gacha-modal>
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
    ],
    "fetch-event-data": "Fetching Event Data...",
    "fetch-gacha-data": "Fetching Gacha Data..."
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
    ],
    "fetch-event-data": "获取活动数据中",
    "fetch-gacha-data": "获取扭蛋池数据中"
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
    ],
    "fetch-event-data": "獲取活動數據中",
    "fetch-gacha-data": "獲取扭蛋池數據中"
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
import cardThumb from './common/CardThumb'
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
      log: console.log,
      isEventReady: false,
      eventNormalCard: null,
      eventSpecialCard: null,
      eventRewardStamp: null,
      isGcahaReady: false
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
    gachaModal,
    QSpinner,
    cardThumb
  },
  beforeDestroy () {
    let aplayer = this.$refs.player.control
    if (aplayer) aplayer.destroy()
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
      this.isEventReady = true
    })
    this.$nextTick(async () => {
      await this.getGachaCurrent()
      this.isGcahaReady = true
    })
  },
  computed: {
    ...mapState('event', [
      'currentEvent'
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
    ...mapState('gacha', [
      'currentGachaList'
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
      'getCurrentEvent'
    ]),
    ...mapActions('stamp', [
      'getStampById'
    ]),
    ...mapActions('gacha', [
      'getGachaCurrent'
    ]),
    ...mapActions('chara', [
      'getCharaById'
    ])
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
  height 120px
  background-size contain
  background-repeat no-repeat
  background-position center
  margin 0 auto

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
