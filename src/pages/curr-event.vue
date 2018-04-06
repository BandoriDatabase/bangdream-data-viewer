<template>
  <q-page padding>
    <q-card v-if="isEventReady">
      <q-card-media>
        <div v-if="currentEvent[server].eventType === 'challenge' || currentEvent[server].eventType === 'versus' || currentEvent[server].eventType === 'live_try'" class="event-cover"
          :style="{ 'background-image': `url(/assets/event/${currentEvent[server].assetBundleName}/topscreen_trim_eventtop.png), url(/assets/event/${currentEvent[server].assetBundleName}/topscreen_bg_eventtop.png)` }"></div>
        <div v-else class="event-cover" :style="{ 'background-image': `url(/assets/event/${currentEvent[server].assetBundleName}/topscreen_bg_eventtop.png)` }"></div>
        <q-card-title slot="overlay">
          {{currentEvent[server].eventName}}
          <span slot="subtitle" class="text-white">
            {{$t('event.title', { srv: $t(`common.${server}`) })}}<br>
            {{$t('event.type')}} {{currentEvent[server].eventType}}
          </span>
        </q-card-title>
      </q-card-media>
      <q-card-main class="column items-center">
        <a-player :music="eventBGM" ref="player" mode="order" class="col-12 full-width"></a-player>
        <img v-if="server != 'en'" v-lazy="`/assets-${server}/homebanner_banner_event${padEventId(currentEvent[server].eventId)}${currentEvent[server].eventId > 13 ? '' : '_open'}.png`"/>
        <img v-else-if="server === 'en' && currentEvent[server].eventId >= 3" v-lazy="`/assets-${server}/homebanner_banner_event${padEventId(currentEvent[server].eventId)}${currentEvent[server].eventId > 13 ? '' : '_open'}.png`">
        <img v-else-if="server === 'en'" v-lazy="`/assets-${server}/homebanner_banner-0${14 + currentEvent[server].eventId * 2}.png`">
        <div class="full-width column items-center" v-if="Number(currentEvent[server].startAt) > Date.now()">
          <p>{{$t('event.start-cd')}}</p>
          <count-down :target-time="Number(currentEvent[server].startAt)"></count-down>
        </div>
        <div class="full-width column items-center" v-else-if="Number(currentEvent[server].endAt) > Date.now()">
          <p>{{$t('event.end-cd')}}</p>
          <count-down :target-time="Number(currentEvent[server].endAt)"></count-down>
        </div>
        <div class="full-width column items-center" v-else-if="Number(currentEvent[server].endAt) < Date.now() && Number(currentEvent[server].distributionStartAt) > Date.now()">
          <p>{{$t('event.dist-cd')}}</p>
          <count-down :target-time="Number(currentEvent[server].distributionStartAt)"></count-down>
        </div>
        <div class="full-width column items-center" v-else-if="Number(currentEvent[server].distributionStartAt) < Date.now() && Number(currentEvent[server].publicEndAt) > Date.now()">
          <p>{{$t('event.next-cd')}}</p>
          <count-down :target-time="Number(currentEvent[server].publicEndAt)"></count-down>
        </div>
        <p>{{$t('event.reward-card')}}</p>
        <div class="row">
          <div class="col-6"><card-thumb :cardId="Number(eventNormalCardId)" :server="server"></card-thumb></div>
          <div class="col-6"><card-thumb :cardId="Number(eventSpecialCardId)" :server="server"></card-thumb></div>
        </div>
        <p>{{$t('event.reward-stamp')}}</p>
        <img v-if="eventRewardStamp" v-lazy="`/assets-${server}/stamp/01_${eventRewardStamp.imageName}.png`" />
        <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
        <p>{{$t('event.bonus-attr-card')}}</p>
        <img v-if="isDegreeReady" class="responsive" style="max-width: 100%;" v-lazy="`/assets-${server}/event/${currentEvent[server].assetBundleName}/images_event_point_banner.png`">
        <p>{{$t('event.badge')}}</p>
        <img v-if="isBadgeReady" class="badge" v-lazy="`/assets/thumb/common_${eventBadgeMap[server][currentEvent[server].eventId].badgeAssetBundleName}.png`">
        <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
        <p>{{$t('event.degrees')}}</p>
        <div v-if="isDegreeReady && currentEvent[server].eventId >= 13" class="event-degree" :style="{ 'background-image': `url(/assets-${server}/thumb/degree_event_point_icon_1.png), url(/assets-${server}/thumb/degree_event_point_1.png), url(/assets-${server}/thumb/degree_${degreeMap[server][currentEvent[server].rankingRewards[0].rewardId].imageName}.png)` }" />
        <div v-else-if="isDegreeReady" class="event-degree" :style="{ 'background-image': `url(/assets-${server}/thumb/degree_${degreeMap[server][currentEvent[server].rankingRewards[0].rewardId].imageName}.png)` }"></div>
        <!-- <div v-else-if="isDegreeReady && server === 'tw'" class="event-degree" :style="{ 'background-image': `url(/assets-tw/thumb/degree_event_point_icon_1.png), url(/assets-tw/thumb/degree_event_point_1.png), url(/assets-tw/thumb/degree_${degreeMap[server][currentEvent[server].rankingRewards[0].rewardId].imageName}.png)` }" /> -->
        <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
        <span v-if="currentEvent[server].eventType === 'challenge'">
          <div class="row justify-center" v-if="isDegreeReady">
            <div class="event-degree" v-for="eventMusic in currentEvent[server].detail.musics" :key="eventMusic.seq"
            :style="{ 'background-image': `url(/assets-${server}/thumb/degree_score_ranking_1.png), url(/assets-${server}/thumb/degree_${degreeMap[server][eventMusic.musicRankingRewards[0].resourceId].imageName}.png)` }" />
          </div>
          <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
        </span>
        <span v-if="currentEvent[server].eventType === 'live_try'">
          <div class="row justify-center" v-if="isDegreeReady && server === 'jp'">
            <div class="event-degree" :style="{ 'background-image': `url(/assets/thumb/degree_try_clear_normal.png), url(/assets/thumb/degree_${degreeMap[server][currentEvent[server].detail.liveTryLevelRewardDifficultyMap.entries.normal.entries[10].resourceId].imageName}.png)` }" />
            <div class="event-degree" :style="{ 'background-image': `url(/assets/thumb/degree_try_clear_extra.png), url(/assets/thumb/degree_${degreeMap[server][currentEvent[server].detail.liveTryLevelRewardDifficultyMap.entries.extra.entries[5].resourceId].imageName}.png)` }" />
          </div>
          <div class="row justify-center" v-else-if="isDegreeReady && server === 'tw'">
            <div class="event-degree" :style="{ 'background-image': `url(/assets-tw/thumb/degree_try_clear_normal.png), url(/assets-tw/thumb/degree_${degreeMap[server][currentEvent[server].detail.liveTryLevelRewardDifficultyMap.entries.normal.entries[10].resourceId].imageName}.png)` }" />
            <div class="event-degree" :style="{ 'background-image': `url(/assets-tw/thumb/degree_try_clear_extra.png), url(/assets-tw/thumb/degree_${degreeMap[server][currentEvent[server].detail.liveTryLevelRewardDifficultyMap.entries.extra.entries[5].resourceId].imageName}.png)` }" />
          </div>
          <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
        </span>
        <span class="column items-center" v-if="currentEvent[server].eventType === 'challenge'">
          <p>{{$t('event.musics')}}</p>
          <div class="row justify-center">
            <img v-for="eventMusic in currentEvent[server].detail.musics" :key="eventMusic.seq" v-if="musicMap[server][eventMusic.musicId]" v-lazy="`/assets/musicjacket/${musicMap[server][eventMusic.musicId].jacketImage}_thumb.png`"
              style="margin: 4px; cursor: pointer; width: 150px; height: 150px;" @click="$router.push(`/music/${server}/${eventMusic.musicId}`)">
            <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
          </div>
        </span>
      </q-card-main>
    </q-card>
    <q-card v-else>
      <q-card-title class="bg-pink text-white">
        {{$t('fetch-data', { type: $t('common.event') })}}
        <span slot="subtitle" class="text-white">{{$t('event.type')}} {{$t('fetch-data', { type: $t('common.event') })}}</span>
      </q-card-title>
      <q-card-main>
        <q-spinner color="pink" size="48px"></q-spinner>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VueAplayer from 'vue-aplayer'
import CountDown from '../components/common/countdown'
import CardThumb from '../components/common/card-thumb'

export default {
  // name: 'PageName',
  components: {
    aPlayer: VueAplayer,
    CountDown,
    CardThumb
  },
  data () {
    return {
      isEventReady: false,
      eventNormalCardId: null,
      eventSpecialCardId: null,
      eventRewardStamp: null,
      isBadgeReady: false,
      isDegreeReady: false
    }
  },
  mounted () {
    this.updateData(this.server)
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
    server () {
      return this.$route.params.server
    },
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
    },
    async updateData (server) {
      this.isEventReady = false
      this.isBadgeReady = false
      this.isDegreeReady = false
      await this.getCurrentEvent(server)
      const eventCards = this.currentEvent[server].pointRewards.filter(elem => elem.rewardType === 'situation')
      this.eventNormalCardId = eventCards[0].rewardId
      this.eventSpecialCardId = eventCards[1].rewardId
      this.isEventReady = true
      this.getStampById({
        id: this.currentEvent[server].pointRewards.find(reward => reward.rewardType === 'stamp').rewardId,
        server: server
      }).then(res => {
        this.eventRewardStamp = res
      })
      this.getEventBadgeById({
        eventId: this.currentEvent[server].eventId,
        server: server
      }).then(res => {
        this.isBadgeReady = true
      })
      if (this.currentEvent[server].eventType === 'challenge') {
        for (let eM of this.currentEvent[server].detail.musics) {
          await this.getDegreeById({
            id: eM.musicRankingRewards[0].resourceId,
            server: server
          })
          await this.getMusicById({
            musicId: eM.musicId,
            server: server
          })
        }
      } else if (this.currentEvent[server].eventType === 'live_try') {
        await this.getDegreeById({
          id: this.currentEvent[server].detail.liveTryLevelRewardDifficultyMap.entries.normal.entries[10].resourceId,
          server: server
        })
        await this.getDegreeById({
          id: this.currentEvent[server].detail.liveTryLevelRewardDifficultyMap.entries.extra.entries[5].resourceId,
          server: server
        })
      }
      this.getDegreeById({
        id: this.currentEvent[server].rankingRewards[0].rewardId,
        server: server
      }).then(res => {
        this.isDegreeReady = true
      })
    }
  },
  beforeDestroy () {
    let aplayer = this.$refs.player.control
    if (aplayer) aplayer.destroy()
  },
  beforeRouteUpdate (to, from, next) {
    this.updateData(to.params.server)
    next()
  }
}
</script>

<style lang="stylus" scoped>
.event-cover
  width: 100%
  height: 501px
  background-size: auto 100%, auto
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
