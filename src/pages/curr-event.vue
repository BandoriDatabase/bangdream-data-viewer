<template>
  <q-page padding>
    <div class="row q-col-gutter-sm" v-if="isEventReady">
      <viewer class="col-12" ref="eventtop">
        <img :src="`/assets/jp/event/${currentEvent[server].assetBundleName}/topscreen_rip/trim_eventtop.webp`" alt="Event Character Trim" v-show="false">
        <img :src="`/assets/jp/event/${currentEvent[server].assetBundleName}/topscreen_rip/bg_eventtop.webp`" alt="Event Background" v-show="false">
        <img :src="`/assets/jp/event/${currentEvent[server].assetBundleName}/images_rip/logo.webp`" alt="Event Logo" v-show="false">
        <my-q-img class="cursor-pointer" style="min-height: 450px;" @click="$refs.eventtop.$viewer.show()">
          <div v-if="currentEvent[server].eventType === 'challenge' || currentEvent[server].eventType === 'versus' || currentEvent[server].eventType === 'live_try' || currentEvent[server].eventType === 'mission_live'" class="event-cover"
            :style="{
              'background-image': `url(/assets/jp/event/${currentEvent[server].assetBundleName}/topscreen_rip/trim_eventtop.webp), url(/assets/jp/event/${currentEvent[server].assetBundleName}/images_rip/logo.webp), url(/assets/jp/event/${currentEvent[server].assetBundleName}/topscreen_rip/bg_eventtop.webp)`
            }"></div>
          <div v-else class="event-cover" :style="{ 'background-image': `url(/assets/jp/event/${currentEvent[server].assetBundleName}/topscreen_rip/bg_eventtop.webp)` }"></div>
          <div class="absolute-bottom text-subtitle1 text-center q-pa-xs">
            {{currentEvent[server].eventName}}
            <br>
            {{$t('event.title', { srv: $t(`common.${server}`) })}}
            <br>
            {{$t('event.type')}} {{currentEvent[server].eventType}}
          </div>
        </my-q-img>
      </viewer>
      <div class="col-12">
        <q-card>
          <q-card-section class="bg-pink text-white">
            {{$t('common.basic-info')}}
          </q-card-section>
          <q-card-section class="column items-center">
            <my-q-img contain class="event-banner" v-if="server != 'en'"
              :src="`/assets/${server}/homebanner_rip/banner_event${padEventId(currentEvent[server].eventId)}${currentEvent[server].eventId > 13 ? '' : '_open'}.webp`" />
            <my-q-img contain class="event-banner" v-else-if="server === 'en' && currentEvent[server].eventId >= 3"
              :src="`/assets/${server}/homebanner_rip/banner_event${padEventId(currentEvent[server].eventId)}${currentEvent[server].eventId > 13 ? '' : '_open'}.webp`" />
            <my-q-img contain class="event-banner" v-else-if="server === 'en'"
              :src="`/assets/${server}/homebanner_rip/banner-0${14 + currentEvent[server].eventId * 2}.webp`" />
            <a-player :music="eventBGM" ref="player" mode="order" class="col-12 full-width" repeat="music"></a-player>
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
            <div class="row full-width justify-around">
              <div class="col-6 text-center">
                <p class="q-mt-md text-h5">{{$t('event.bonus-attr')}}</p>
              </div>
              <div class="col-6">
                <p class="q-mt-md text-h5 text-center">{{$t('event.bonus-chara')}}</p>
              </div>
            </div>
            <div class="row full-width justify-around items-center">
              <div class="col-6 text-center">
                <my-q-img src="~assets/icon_cool.png" style="width: 64px; height: 64px;"
                  v-if="currentEvent[server].detail.attributes[0].attribute === 'cool'"
                />
                <my-q-img src="~assets/icon_happy.png" style="width: 64px; height: 64px;"
                  v-if="currentEvent[server].detail.attributes[0].attribute === 'happy'"
                />
                <my-q-img src="~assets/icon_powerful.png" style="width: 64px; height: 64px;"
                  v-if="currentEvent[server].detail.attributes[0].attribute === 'powerful'"
                />
                <my-q-img src="~assets/icon_pure.png" style="width: 64px; height: 64px;"
                  v-if="currentEvent[server].detail.attributes[0].attribute === 'pure'"
                />
                <p :class="`text-${paletteMap[currentEvent[server].detail.attributes[0].attribute]} text-h6`">
                  +{{currentEvent[server].detail.attributes[0].percent}}%
                </p>
              </div>
              <div class="col-6">
                <div class="row items-center justify-center q-my-sm">
                  <my-q-img :src="`chara/chara_icon_${item.characterId}.png`" style="width: 64px; height: 64px;"
                    v-for="item in currentEvent[server].detail.characters" :key="item.characterId"
                  />
                </div>
                <p class="text-h6 text-center"> +{{currentEvent[server].detail.characters[0].percent}}%</p>
              </div>
            </div>
            <p class="text-center text-h6" v-if="currentEvent[server].detail.eventCharacterParameterBonus">
              <span>{{$t('event.both-match')}}</span>
              <span v-if="currentEvent[server].detail.eventCharacterParameterBonus.performance" class="text-pink-6">{{$t('common.perform')}} +{{currentEvent[server].detail.eventCharacterParameterBonus.performance}}%</span>
              <span v-if="currentEvent[server].detail.eventCharacterParameterBonus.technique" class="text-indigo-6">{{$t('common.technic')}} +{{currentEvent[server].detail.eventCharacterParameterBonus.technique}}%</span>
              <span v-if="currentEvent[server].detail.eventCharacterParameterBonus.visual" class="text-orange-8">{{$t('common.visual')}} +{{currentEvent[server].detail.eventCharacterParameterBonus.visual}}%</span>
            </p>
            <div class="row justify-around full-width gt-sm">
              <div class="col-12 col-md-6 column items-center">
                <p class="q-mt-md text-h5">{{$t('event.badge')}}</p>
              </div>
              <div class="col-12 col-md-6 column justify-center items-center">
                <p class="q-mt-md text-h5">{{$t('event.degrees')}}</p>
              </div>
            </div>
            <div class="row justify-around full-width">
              <div class="col-12 col-md-6 column items-center">
                <p class="q-mt-md text-h5 lt-md">{{$t('event.badge')}}</p>
                <my-q-img v-if="isBadgeReady" class="badge" :src="`/assets/jp/thumb/common_rip/${eventItemMap[server][currentEvent[server].eventId].resourceName}.webp`">
                  <q-tooltip>{{eventItemMap[server][currentEvent[server].eventId].itemName}}</q-tooltip>
                </my-q-img>
                <q-spinner-facebook v-else size="48px"></q-spinner-facebook>
              </div>
              <div class="col-12 col-md-6 column justify-center items-center">
                <p class="q-mt-md text-h5 lt-md">{{$t('event.degrees')}}</p>
                <div v-if="isDegreeReady && (currentEvent[server].eventId >= 13 || server === 'cn')" class="event-degree relative-position">
                  <my-q-img :src="`/assets/${server}/thumb/degree_rip/${degreeMap[server][currentEvent[server].rankingRewards[0].rewardId].baseImageName}.webp`" class="absolute-left" />
                  <my-q-img :src="`/assets/${server}/thumb/degree_rip/event_point_1.webp`" class="absolute-left" />
                  <my-q-img style="height: 50px; width: 50px" :src="`/assets/${server}/thumb/degree_rip/event_point_icon_1.webp`" class="absolute-left" />
                  <q-tooltip>{{degreeMap[server][currentEvent[server].rankingRewards[0].rewardId].description}}</q-tooltip>
                </div>
                <div v-else-if="isDegreeReady" class="event-degree" :style="{ 'background-image': `url(/assets/${server}/thumb/degree_rip/${degreeMap[server][currentEvent[server].rankingRewards[0].rewardId].baseImageName}.webp)` }"></div>
                <q-spinner-facebook v-else size="48px"></q-spinner-facebook>
              </div>
            </div>
            <span v-if="currentEvent[server].eventType === 'challenge'">
              <div class="row justify-center" v-if="isDegreeReady">
                <div class="event-degree relative-position" v-for="eventMusic in currentEvent[server].detail.musics" :key="eventMusic.seq">
                  <my-q-img :src="`/assets/${server}/thumb/degree_rip/${degreeMap[server][eventMusic.musicRankingRewards[0].resourceId].baseImageName}.webp`" class="absolute-left" />
                  <my-q-img :src="`/assets/${server}/thumb/degree_rip/score_ranking_1.webp`" class="absolute-left" />
                </div>
              </div>
              <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
            </span>
            <span v-if="currentEvent[server].eventType === 'live_try'">
              <div class="row justify-center" v-if="isDegreeReady">
                <div class="event-degree relative-position">
                  <my-q-img :src="`/assets/${server}/thumb/degree_rip/${degreeMap[server][Object.values(this.currentEvent[server].detail.liveTryLevelRewardDifficultyMap.entries.normal.entries).find(e => e.resourceType === 'degree').resourceId].baseImageName}.webp`" class="absolute-left" />
                  <my-q-img :src="`/assets/${server}/thumb/degree_rip/try_clear_normal.webp`" class="absolute-left" />
                </div>
                <div class="event-degree" :style="{ 'background-image': `url(/assets/${server}/thumb/degree_rip/try_clear_extra.webp), url(/assets/${server}/thumb/degree_rip/${degreeMap[server][Object.values(this.currentEvent[server].detail.liveTryLevelRewardDifficultyMap.entries.normal.entries).find(e => e.resourceType === 'degree').resourceId].baseImageName}.webp)` }" />
              </div>
              <q-spinner-facebook v-else color="pink" size="48px"></q-spinner-facebook>
            </span>
            <span class="column items-center q-mt-md" v-if="currentEvent[server].eventType === 'challenge'">
              <p class="text-h5">{{$t('event.musics')}}</p>
              <div class="row justify-center">
                <div v-for="eventMusic in currentEvent[server].detail.musics" :key="eventMusic.seq">
                <my-q-img :src="`/assets/jp/musicjacket/${musicMap[server][eventMusic.musicId].jacketImage}_rip/thumb.webp`"
                  style="margin: 4px; cursor: pointer; width: 150px; height: 150px;"
                  @click="$router.push(`/music/${server}/${eventMusic.musicId}`)">
                  <q-spinner-facebook color="pink" size="48px" slot="loading"></q-spinner-facebook>
                </my-q-img>
                </div>
              </div>
            </span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12">
        <q-card>
          <q-card-section class="bg-pink text-white">
            {{$t('event.rewards-and-stories')}}
          </q-card-section>
          <q-card-section>
            <p class="text-h5 text-center">{{$t('event.point-rewards')}}</p>
            <q-toggle v-model="pointRewardShowLess">
              {{$t('common.show-less')}}
            </q-toggle>
            <div class="row">
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
            <!-- <div style="max-height: 450px; width: 100%; overflow: auto;"> -->
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
            <!-- </div> -->
          </q-card-section>
          <q-card-section>
            <p class="text-h5 text-center">{{$t('event.stories')}}</p>
            <!-- <div style="max-height: 800px; width: 100%; overflow: auto;"> -->
            <q-tabs v-model="storyTab" inline-label mobile-arrows>
              <q-tab :name="`tab-${item.scenarioId}`" :label="item.caption" v-for="item in currentEvent[server].detail.stories" :key="`tab-${item.scenarioId}`"></q-tab>
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="storyTab" animated>
              <q-tab-panel :name="`tab-${item.scenarioId}`" v-for="item in currentEvent[server].detail.stories" :key="`tabpanel-${item.scenarioId}`">
                <my-q-img :src="`/assets/jp/story/bg/event/eventstory${item.coverImage}_rip/eventstoryscreenimage${item.coverImage}.webp`" :img-style="{ 'background-size': '100% calc(100% / 16 * 9)' }" />
                <div class="text-center">
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
              </q-tab-panel>
            </q-tab-panels>
            <!-- </div> -->
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
      },
      storyTab: 'tab-0'
    }
  },
  mounted () {
    this.updateData(this.server)
  },
  computed: {
    ...mapState('event', [
      'currentEvent',
      'eventItemMap',
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
        artist: this.$t('event.bgm'),
        src: `/assets/jp/musicscore/${bgmAssetBundleName.replace('/', '')}_rip/${bgmAssetBundleName.replace('musicscore/', '')}/${bgmFileName}.mp3`,
        pic: `/assets/jp/event/${assetBundleName}/images_rip/logo.webp`
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
      document.title = `${this.currentEvent[this.server].eventName} | ${this.$t('event.title', { srv: this.$t(`common.${this.server}`) })} | Bandori Top`
      const eventCards = this.currentEvent[server].pointRewards.filter(elem => elem.rewardType === 'situation')
      this.eventNormalCardId = eventCards[0].rewardId
      this.eventSpecialCardId = eventCards[1].rewardId
      this.storyTab = 'tab-' + this.currentEvent[server].detail.stories[0].scenarioId
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
          id: Object.values(this.currentEvent[server].detail.masterLiveTryLevelRewardDifficultyMap.entries.normal.entries).find(e => e.resourceType === 'degree').resourceId,
          server: server
        })
        await this.getDegreeById({
          id: Object.values(this.currentEvent[server].detail.masterLiveTryLevelRewardDifficultyMap.entries.extra.entries).find(e => e.resourceType === 'degree').resourceId,
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
  background-size: auto 100%, 140px, cover
  background-repeat: no-repeat
  background-position: 50% calc(50% - 50px), 5% 5%, center

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
  height: 140px;
</style>
