<template>
  <q-page padding>
    <div class="row q-col-gutter-sm" v-if="isEventReady">
      <!-- <q-img>
        <div v-if="currentEvent[server].eventType === 'challenge' || currentEvent[server].eventType === 'versus' || currentEvent[server].eventType === 'live_try' || currentEvent[server].eventType === 'mission_live'" class="event-cover"
          :style="{ 'background-image': `url(/assets/event/${currentEvent[server].assetBundleName}/topscreen_rip/trim_eventtop.png), url(/assets/event/${currentEvent[server].assetBundleName}/topscreen_rip/bg_eventtop.png)` }"></div>
        <div v-else class="event-cover" :style="{ 'background-image': `url(/assets/event/${currentEvent[server].assetBundleName}/topscreen_rip/bg_eventtop.png)` }"></div>
        <div class="absolute-bottom text-subtitle1 text-center q-pa-xs">
          {{currentEvent[server].eventName}}
          <span>
            {{$t('event.title', { srv: $t(`common.${server}`) })}}<br>
            {{$t('event.type')}} {{currentEvent[server].eventType}}
          </span>
        </div>
      </q-img> -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section class="bg-pink text-white">
            {{$t('event.basic-info')}}
          </q-card-section>
          <q-card-section class="column items-center">
            <q-img contain class="event-banner" v-if="server != 'en'" :src="`/assets-${server}/homebanner_rip/banner_event${padEventId(currentEvent[server].eventId)}${currentEvent[server].eventId > 13 ? '' : '_open'}.png`"/>
            <q-img contain class="event-banner" v-else-if="server === 'en' && currentEvent[server].eventId >= 3" :src="`/assets-${server}/homebanner_rip/banner_event${padEventId(currentEvent[server].eventId)}${currentEvent[server].eventId > 13 ? '' : '_open'}.png`" />
            <q-img contain class="event-banner" v-else-if="server === 'en'" :src="`/assets-${server}/homebanner_rip/banner-0${14 + currentEvent[server].eventId * 2}.png`" />
            <p class="text-h5 text-center">{{currentEvent[server].eventName}}</p>
            <p class="text-subtitle1">{{$t('event.title', { srv: $t(`common.${server}`) })}} - {{currentEvent[server].eventType}}</p>
            <a-player :music="eventBGM" ref="player" mode="order" class="col-12 full-width"></a-player>
            <div class="full-width column items-center q-mt-md" v-if="Number(currentEvent[server].startAt) > Date.now()">
              <p class="text-h5">{{$t('event.start-cd')}}</p>
              <count-down :target-time="Number(currentEvent[server].startAt)"></count-down>
            </div>
            <div class="full-width column items-center q-mt-md" v-else-if="Number(currentEvent[server].endAt) > Date.now()">
              <p class="text-h5">{{$t('event.end-cd')}}</p>
              <count-down :target-time="Number(currentEvent[server].endAt)"></count-down>
            </div>
            <div class="full-width column items-center q-mt-md" v-else-if="Number(currentEvent[server].endAt) < Date.now() && Number(currentEvent[server].distributionStartAt) > Date.now()">
              <p class="text-h5">{{$t('event.dist-cd')}}</p>
              <count-down :target-time="Number(currentEvent[server].distributionStartAt)"></count-down>
            </div>
            <div class="full-width column items-center q-mt-md" v-else-if="Number(currentEvent[server].distributionStartAt) < Date.now() && Number(currentEvent[server].publicEndAt) > Date.now()">
              <p class="text-h5">{{$t('event.next-cd')}}</p>
              <count-down :target-time="Number(currentEvent[server].publicEndAt)"></count-down>
            </div>
            <!-- <p class="q-mt-md text-h5">{{$t('event.reward-card')}}</p>
            <div class="row q-col-gutter-sm">
              <div class="col-6"><card-thumb :cardId="Number(eventNormalCardId)" :server="server"></card-thumb></div>
              <div class="col-6"><card-thumb :cardId="Number(eventSpecialCardId)" :server="server"></card-thumb></div>
            </div>
            <p class="q-mt-md text-h5">{{$t('event.reward-stamp')}}</p>
            <q-img v-if="eventRewardStamp" style="max-width: 220px;" :src="`/assets-${server}/stamp/01_rip/${eventRewardStamp.imageName}.png`" />
            <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook> -->
            <p class="q-mt-md text-h5">{{$t('event.bonus-attr-card')}}</p>
            <!-- <img v-if="isDegreeReady" class="responsive" style="max-width: 100%;" v-lazy="`/assets-${server}/event/${currentEvent[server].assetBundleName}/images_rip/event_point_banner.png`"> -->
            <div v-if="isDegreeReady">
              <div class="row items-center justify-center q-my-sm">
                <img src="~assets/icon_cool.png" class="responsive" style="width: 64px; height: 64px;"
                  v-if="currentEvent[server].detail.attributes[0].attribute === 'cool'"
                >
                <img src="~assets/icon_happy.png" class="responsive" style="width: 64px; height: 64px;"
                  v-if="currentEvent[server].detail.attributes[0].attribute === 'happy'"
                >
                <img src="~assets/icon_powerful.png" class="responsive" style="width: 64px; height: 64px;"
                  v-if="currentEvent[server].detail.attributes[0].attribute === 'powerful'"
                >
                <img src="~assets/icon_pure.png" class="responsive" style="width: 64px; height: 64px;"
                  v-if="currentEvent[server].detail.attributes[0].attribute === 'pure'"
                >
                <span :class="`text-${paletteMap[currentEvent[server].detail.attributes[0].attribute]} text-h6`"> +{{currentEvent[server].detail.attributes[0].percent}}%</span>
              </div>
              <div v-for="item in currentEvent[server].detail.characters" :key="item.characterId" class="row items-center justify-center q-my-sm">
                <img :src="`statics/chara_icon_${item.characterId}.png`" style="width: 64px; height: 64px;" class="responsive">
                <span class="text-h6"> +{{item.percent}}%</span>
              </div>
              <div class="row items-center justify-center text-h6" v-if="currentEvent[server].detail.paramBonus">
                <span>{{$t('event.both-match')}}</span>
                <span v-if="currentEvent[server].detail.paramBonus[0].performance" class="text-pink-6">{{$t('common.perform')}} +{{currentEvent[server].detail.paramBonus[0].performance}}%</span>
                <span v-if="currentEvent[server].detail.paramBonus[0].technique" class="text-indigo-6">{{$t('common.technic')}} +{{currentEvent[server].detail.paramBonus[0].technique}}%</span>
                <span v-if="currentEvent[server].detail.paramBonus[0].visual" class="text-orange-8">{{$t('common.visual')}} +{{currentEvent[server].detail.paramBonus[0].visual}}%</span>
              </div>
            </div>
            <p class="q-mt-md text-h5">{{$t('event.badge')}}</p>
            <q-img v-if="isBadgeReady" class="badge" :src="`/assets/thumb/common_rip/${eventBadgeMap[server][currentEvent[server].eventId].badgeAssetBundleName}.png`" />
            <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
            <p class="q-mt-md text-h5">{{$t('event.degrees')}}</p>
            <div v-if="isDegreeReady && (currentEvent[server].eventId >= 13 || server === 'cn')" class="event-degree relative-position">
              <q-img :src="`/assets-${server}/thumb/degree_rip/${degreeMap[server][currentEvent[server].rankingRewards[0].rewardId].imageName}.png`" class="absolute-left"></q-img>
              <q-img :src="`/assets-${server}/thumb/degree_rip/event_point_1.png`" class="absolute-left"></q-img>
              <q-img style="height: 50px; width: 50px" :src="`/assets-${server}/thumb/degree_rip/event_point_icon_1.png`" class="absolute-left"></q-img>
            </div>
            <div v-else-if="isDegreeReady" class="event-degree" :style="{ 'background-image': `url(/assets-${server}/thumb/degree_rip/${degreeMap[server][currentEvent[server].rankingRewards[0].rewardId].imageName}.png)` }"></div>
            <!-- <div v-else-if="isDegreeReady && server === 'tw'" class="event-degree" :style="{ 'background-image': `url(/assets-tw/thumb/degree_event_point_icon_1.png), url(/assets-tw/thumb/degree_event_point_1.png), url(/assets-tw/thumb/degree_${degreeMap[server][currentEvent[server].rankingRewards[0].rewardId].imageName}.png)` }" /> -->
            <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
            <span v-if="currentEvent[server].eventType === 'challenge'">
              <div class="row justify-center" v-if="isDegreeReady">
                <div class="event-degree relative-position" v-for="eventMusic in currentEvent[server].detail.musics" :key="eventMusic.seq">
                  <q-img :src="`/assets-${server}/thumb/degree_rip/${degreeMap[server][eventMusic.musicRankingRewards[0].resourceId].imageName}.png`" class="absolute-left"></q-img>
                  <q-img :src="`/assets-${server}/thumb/degree_rip/score_ranking_1.png`" class="absolute-left"></q-img>
                </div>
              </div>
              <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
            </span>
            <span v-if="currentEvent[server].eventType === 'live_try'">
              <div class="row justify-center" v-if="isDegreeReady">
                <div class="event-degree relative-position">
                  <q-img :src="`/assets-${server}/thumb/degree_rip/${degreeMap[server][currentEvent[server].detail.liveTryLevelRewardDifficultyMap.entries.normal.entries[10].resourceId].imageName}.png`" class="absolute-left"></q-img>
                  <q-img :src="`/assets-${server}/thumb/degree_rip/try_clear_normal.png`" class="absolute-left"></q-img>
                </div>
                <div class="event-degree" :style="{ 'background-image': `url(/assets-${server}/thumb/degree_rip/try_clear_extra.png), url(/assets-${server}/thumb/degree_rip/${degreeMap[server][currentEvent[server].detail.liveTryLevelRewardDifficultyMap.entries.extra.entries[5].resourceId].imageName}.png)` }" />
              </div>
              <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
            </span>
            <span class="column items-center q-mt-md" v-if="currentEvent[server].eventType === 'challenge'">
              <p class="text-h5">{{$t('event.musics')}}</p>
              <div class="row justify-center">
                <div v-for="eventMusic in currentEvent[server].detail.musics" :key="eventMusic.seq">
                <q-img :src="`/assets/musicjacket/${musicMap[server][eventMusic.musicId].jacketImage}_rip/thumb.png`"
                  style="margin: 4px; cursor: pointer; width: 150px; height: 150px;"
                  @click="$router.push(`/music/${server}/${eventMusic.musicId}`)">
                  <q-spinner-facebook color="pink" size="48px" slot="loading"></q-spinner-facebook>
                </q-img>
                </div>
              </div>
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section class="bg-pink text-white">
            {{$t('event.rewards-and-stories')}}
          </q-card-section>
          <q-card-section>
            <p class="text-h5 text-center">{{$t('event.point-rewards')}}</p>
            <q-toggle v-model="pointRewardShowLess">
              {{$t('common.show-less')}}
            </q-toggle>
            <div class="row" style="max-height: 450px; width: 100%; overflow: auto;">
              <div v-for="item in pointRewards" :key="item.id"
                class="column items-center col-3 col-lg-2">
                <single-resource :data="item" :server="server" type-name="rewardType" id-name="rewardId" quantity-name="rewardQuantity"/>
                <p class="text-h6 q-mb-none">{{item.point}}</p>
                <p>{{$t('common.points')}}</p>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <p class="text-h5 text-center">{{$t('event.ranking-rewards')}}</p>
            <q-toggle v-model="rankingRewardShowLess">
              {{$t('common.show-less')}}
            </q-toggle>
            <div style="max-height: 450px; width: 100%; overflow: auto;">
              <div v-for="rankingItem in rankingRewards" :key="rankingItem.fromRank" class="row">
                <p class="col-3 text-h6">
                  {{rankingItem.fromRank}}
                  <span v-if="rankingItem.fromRank !== rankingItem.toRank"> - {{rankingItem.toRank}}</span>
                </p>
                <div class="col-9 row">
                  <div v-for="item in rankingItem.rewards" :key="item.id"
                    class="column items-center col-4 col-lg-2">
                    <single-resource :data="item" :server="server" type-name="rewardType" id-name="rewardId" quantity-name="rewardQuantity"/>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <p class="text-h5 text-center">{{$t('event.stories')}}</p>
            <div style="max-height: 800px; width: 100%; overflow: auto;">
              <div v-for="item in currentEvent[server].detail.stories" :key="item.scenarioId"
              class="row items-center">
                <q-img :src="`/assets/story/bg/event/eventstory${item.coverImage}_rip/EventStoryScreenImage${item.coverImage}.png`"
                class="col-12 col-lg-6"></q-img>
                <div class="col-12 col-lg-6 text-center">
                  <p class="text-h6">{{item.caption}}</p>
                  <p>{{item.synopsis}}</p>
                  <p>{{item.releaseConditions}}</p>
                  <div class="row justify-center">
                    <div v-for="reward in item.rewards" :key="reward.id"
                      class="column items-center col-4 col-lg-3">
                      <single-resource :data="reward" :server="server" type-name="rewardType" id-name="rewardId" quantity-name="rewardQuantity"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-card v-else>
      <q-card-section class="bg-pink text-white">
        <p class="text-h5">{{$t('fetch-data', { type: $t('common.event') })}}</p>
        <p class="text-subtitle1">{{$t('event.type')}} {{$t('fetch-data', { type: $t('common.event') })}}</p>
      </q-card-section>
      <q-card-section>
        <q-spinner color="pink" size="48px"></q-spinner>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VueAplayer from 'vue-aplayer'
import CountDown from '../components/common/countdown'
import SingleResource from '../components/common/single-resource'

export default {
  // name: 'PageName',
  components: {
    aPlayer: VueAplayer,
    CountDown,
    SingleResource
  },
  data () {
    return {
      isEventReady: false,
      eventNormalCardId: null,
      eventSpecialCardId: null,
      eventRewardStamp: null,
      isBadgeReady: false,
      isDegreeReady: false,
      pointRewardShowLess: true,
      rankingRewardShowLess: true,
      paletteMap: {
        happy: 'orange-8',
        cool: 'indigo-6',
        pure: 'green-8',
        powerful: 'pink-6'
      }
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
      const { assetBundleName, bgmAssetBundleName, bgmFileName } = this.currentEvent[this.server]
      return {
        title: this.currentEvent[this.server].eventName,
        author: 'Event BGM',
        url: `/assets/${bgmAssetBundleName}_rip/${bgmFileName}.mp3`,
        pic: `/assets/event/${assetBundleName}/images_rip/logo.png`
      }
    },
    pointRewards () {
      if (this.pointRewardShowLess) {
        return this.currentEvent[this.server].pointRewards.filter(elem => ['stamp', 'situation'].indexOf(elem.rewardType) !== -1)
      } else {
        return this.currentEvent[this.server].pointRewards
      }
    },
    rankingRewards () {
      // group ranking rewards
      if (this.rankingRewardShowLess) {
        return this.currentEvent[this.server].rankingRewards.reduce((sum, elem) => {
          if (elem.fromRank > 10) return sum
          const found = sum.find(_elem => _elem.fromRank === elem.fromRank && _elem.toRank === elem.toRank)
          if (found) {
            found.rewards.push(elem)
          } else {
            sum.push({
              fromRank: elem.fromRank,
              toRank: elem.toRank,
              rewards: [elem]
            })
          }
          return sum
        }, [])
      } else {
        return this.currentEvent[this.server].rankingRewards.reduce((sum, elem) => {
          const found = sum.find(_elem => _elem.fromRank === elem.fromRank && _elem.toRank === elem.toRank)
          if (found) {
            found.rewards.push(elem)
          } else {
            sum.push({
              fromRank: elem.fromRank,
              toRank: elem.toRank,
              rewards: [elem]
            })
          }
          return sum
        }, [])
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
      // this.getStampById({
      //   id: this.currentEvent[server].pointRewards.find(reward => reward.rewardType === 'stamp').rewardId,
      //   server: server
      // }).then(res => {
      //   this.eventRewardStamp = res
      // })
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
      this.isEventReady = true
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

.event-banner
  max-height: 140px;
</style>
