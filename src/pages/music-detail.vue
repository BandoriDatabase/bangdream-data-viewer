<template>
  <q-page padding>
    <div v-if="isReady" class="row q-col-gutter-sm">
      <div class="col-12">
        <div v-if="!musicData.mv" ref="jacket"
          class="jacket-img relative-position" v-viewer
        >
          <img class="absolute-center cursor-pointer" :src="musicData.jacket" @click="$refs.jacket.$viewer.show()" />
          <!-- <video v-else class="absolute-center" :src="`/assets/jp/movie/mv/${musicData.mv[0].assetBundleName}_hq_rip/${musicData.mv[0].title}.mp4`" controls :poster="musicData.jacket"></video> -->
        </div>
        <vue-plyr v-else>
          <video :poster="musicData.jacket">
            <source :src="`/assets/jp/movie/mv/${musicData.mv[0].assetBundleName}_hq_rip/${musicData.mv[0].title}.mp4`" type="video/mp4" size="480">
            <source :src="`/assets/jp/movie/mv/${musicData.mv[0].assetBundleName}_rip/${musicData.mv[0].title}.mp4`" type="video/mp4" size="240">
            <!-- <track kind="captions" label="English" srclang="en" src="captions-en.vtt" default> -->
          </video>
          </vue-plyr>
        <a-player :music="{
          title: musicData.musicTitle,
          artist: musicData.bandName,
          src: musicData.bgmFile,
          pic: musicData.thumb
        }" ref="player" mode="order" theme="#Cee"></a-player>
      </div>
      <div class="col-12">
        <q-btn @click="$router.push(`/music/${server}/${musicData.musicId}/beatmap`)">{{$t('music.check-beatmap')}}</q-btn>
        <q-btn @click="$router.push({ name: 'musicList', params: { server } })">{{$t('common.back-to-list')}}</q-btn>
        <q-btn @click="isAchieveVisible = true">{{$t('music.achieve')}}</q-btn>
        <!-- <h4>{{musicData.musicTitle}}</h4> -->
        <q-card class="q-mt-md">
          <q-card-section>
            <span>{{$t('common.basic-info')}}</span>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div><q-badge>{{$t('music.type.name')}}</q-badge></div>
              <p>{{$t(`music.type.${musicData.musicDataType}`)}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div><q-badge>{{$t('music.composer')}}</q-badge></div>
              <p>{{musicData.composer}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div><q-badge>{{$t('music.lyricist')}}</q-badge></div>
              <p>{{musicData.lyricist}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div><q-badge>{{$t('music.arranger')}}</q-badge></div>
              <p>{{musicData.arranger}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between items-center">
              <div><q-badge>{{$t('common.band')}}</q-badge></div>
              <p>
                <span v-if="Number(musicData.bandId) > 5 && Number(musicData.bandId) !== 18 && Number(musicData.bandId) !== 21">{{musicData.bandName}}</span>
                <my-q-img width="50px" v-if="Number(musicData.bandId) <= 5 || Number(musicData.bandId) === 18 || Number(musicData.bandId) === 21"
                :src="`/band/band_icon_${musicData.bandId}.png`" />
                <my-q-img width="150px" v-if="Number(musicData.bandId) <= 5 || Number(musicData.bandId) === 18 || Number(musicData.bandId) === 21"
                :src="`/assets/jp/band/logo/${musicData.bandId.toString().padStart(3, '0')}_rip/logol.webp`" />
              </p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div><q-badge>{{$t('music.howtoget')}}</q-badge></div>
              <p>{{musicData.howToGet}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div><q-badge>{{$t('music.startat')}}</q-badge></div>
              <p>{{(new Date(Number(musicData.publishedAt))).toLocaleString()}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div><q-badge>{{$t('music.difficulty')}}</q-badge></div>
              <p><span>
                <span class="music-level music-level-easy">{{musicData.difficulty[0].playLevel}}</span>
                <span class="music-level music-level-normal">{{musicData.difficulty[3].playLevel}}</span>
                <span class="music-level music-level-hard">{{musicData.difficulty[2].playLevel}}</span>
                <span class="music-level music-level-expert">{{musicData.difficulty[1].playLevel}}</span>
                <span v-if="musicData.difficulty[4]" class="music-level music-level-special">{{musicData.difficulty[4].playLevel}}</span>
              </span></p>
            </div>
          </q-card-section>
        </q-card>
        <!-- <q-dialog v-model="isAchieveVisible"> -->
          <q-card class="q-mt-md">
            <q-card-section class="row items-center">
              <div><q-badge class="col-12">{{$t('music.combo-reward')}}</q-badge></div>
              <span class="row justify-between col-12">
                <span class="column items-center">
                  <p class="text-subtitle1">{{$t('music.difficulties[0]')}}</p>
                  <single-resource :server="server" :data="getAchievement('combo_easy')" type-name="rewardType" />
                </span>
                <span class="column items-center">
                  <p class="text-subtitle1">{{$t('music.difficulties[1]')}}</p>
                  <single-resource :server="server" :data="getAchievement('combo_normal')" type-name="rewardType" />
                </span>
                <span class="column items-center">
                  <p class="text-subtitle1">{{$t('music.difficulties[2]')}}</p>
                  <single-resource :server="server" :data="getAchievement('combo_hard')" type-name="rewardType" />
                </span>
                <span class="column items-center">
                  <p class="text-subtitle1">{{$t('music.difficulties[3]')}}</p>
                  <single-resource :server="server" :data="getAchievement('combo_expert')" type-name="rewardType" />
                </span>
                <span v-if="musicData.difficulty[4]" class="column items-center">
                  <p class="text-subtitle1">{{$t('music.difficulties[4]')}}</p>
                  <single-resource :server="server" :data="getAchievement('combo_special')" type-name="rewardType" />
                </span>
              </span>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section class="row items-center">
              <div><q-badge class="col-12">{{$t('music.full-combo-reward')}}</q-badge></div>
              <span class="row justify-between col-12">
                <span class="column items-center">
                  <p class="text-subtitle1">{{$t('music.difficulties[0]')}}</p>
                  <single-resource :server="server" :data="getAchievement('full_combo_easy')" type-name="rewardType" />
                </span>
                <span class="column items-center">
                  <p class="text-subtitle1">{{$t('music.difficulties[1]')}}</p>
                  <single-resource :server="server" :data="getAchievement('full_combo_normal')" type-name="rewardType" />
                </span>
                <span class="column items-center">
                  <p class="text-subtitle1">{{$t('music.difficulties[2]')}}</p>
                  <single-resource :server="server" :data="getAchievement('full_combo_hard')" type-name="rewardType" />
                </span>
                <span class="column items-center">
                  <p class="text-subtitle1">{{$t('music.difficulties[3]')}}</p>
                  <single-resource :server="server" :data="getAchievement('full_combo_expert')" type-name="rewardType" />
                </span>
                <span v-if="musicData.difficulty[4]" class="column items-center">
                  <p class="text-subtitle1">{{$t('music.difficulties[4]')}}</p>
                  <single-resource :server="server" :data="getAchievement('full_combo_special')" type-name="rewardType" />
                </span>
              </span>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section class="row items-center">
              <div><q-badge class="col-12">{{$t('music.score-rank-reward')}}</q-badge></div>
              <span class="row justify-between col-12">
                <span class="column items-center">
                  <p class="text-subtitle1">C</p>
                  <single-resource :server="server" :data="getAchievement('score_rank_c')" type-name="rewardType" id-name="rewardId" />
                </span>
                <span class="column items-center">
                  <p class="text-subtitle1">B</p>
                  <single-resource :server="server" :data="getAchievement('score_rank_b')" type-name="rewardType" id-name="rewardId" />
                </span>
                <span class="column items-center">
                  <p class="text-subtitle1">A</p>
                  <single-resource :server="server" :data="getAchievement('score_rank_a')" type-name="rewardType" id-name="rewardId" />
                </span>
                <span class="column items-center">
                  <p class="text-subtitle1">S</p>
                  <single-resource :server="server" :data="getAchievement('score_rank_s')" type-name="rewardType" id-name="rewardId" />
                </span>
                <span class="column items-center">
                  <p class="text-subtitle1">SS</p>
                  <single-resource :server="server" :data="getAchievement('score_rank_ss')" type-name="rewardType" id-name="rewardId" />
                </span>
              </span>
            </q-card-section>
          </q-card>
        <!-- </q-dialog> -->
      </div>
    </div>
    <div v-else-if="isError">
      {{$t('music.not-exist', { server: $t(`common.${server}`), musicId })}}
    </div>
    <div v-else>
      {{$t('music.fetch-music-data')}}
      <q-spinner color="pink-6" size="48px"></q-spinner>
    </div>
  </q-page>
</template>

<script>
import VueAplayer from 'vue-aplayer'
import { mapState, mapActions } from 'vuex'

import singleResource from '../components/common/single-resource'

export default {
  // name: 'PageName',
  data () {
    return {
      isReady: false,
      isError: false,
      isAchieveVisible: false
    }
  },
  components: {
    aPlayer: VueAplayer,
    singleResource
  },
  mounted () {
    this.$nextTick(async () => {
      try {
        await this.getMusicById({ musicId: this.musicId, server: this.server })
        this.isReady = true
      } catch (error) {
        this.isError = true
      }
    })
  },
  beforeDestroy () {
    let aplayer = this.$refs.player.control
    if (aplayer) aplayer.destroy()
  },
  computed: {
    ...mapState('music', [
      'musicMap'
    ]),
    server () {
      return this.$route.params.server
    },
    musicId () {
      return this.$route.params.musicId
    },
    musicData () {
      return this.musicMap[this.server][this.musicId]
    }
  },
  methods: {
    ...mapActions('music', [
      'getMusicById'
    ]),
    getAchievement (name) {
      return this.musicData.achievements.find(elem => elem.achievementType === name)
    },
    getRwardFileName (achievement) {
      if (achievement.rewardId) {
        const splitName = achievement.rewardType.split('_')
        splitName[1] = splitName[1].charAt(0).toUpperCase() + splitName[1].slice(1)
        return splitName.join('').concat(achievement.rewardId)
      } else {
        return achievement.rewardType
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.isReady = false
    this.isError = false
    this.$nextTick(async () => {
      try {
        await this.getMusicById({ musicId: this.musicId, server: this.server })
        this.isReady = true
      } catch (error) {
        this.isError = true
      }
    })
    next()
  }
}
</script>

<style lang="stylus" scoped>
.jacket-img
  width: 100%
  height: 500px
  background-size: contain
  background-repeat: no-repeat
  background-position: center

.thumb-item
  width 72px
  height 72px

.music-levels
  font-family -apple-system, PingFang, Helvetica
  margin-left 15px
  padding-right 15px

span.music-level
  display inline-block
  color white
  font-size 85%
  font-weight semi-bold
  width 32px
  height 20px
  border-radius 10px
  background red
  text-align center
  line-height 20px
  margin-right 4px
  margin-bottom 4px

span.music-level-easy
  background RGB(68, 79, 173)

span.music-level-normal
  background RGB(86, 175, 95)

span.music-level-hard
  background RGB(251, 195, 79)

span.music-level-expert
  background RGB(236, 69, 68)

span.music-level-special
  background RGB(152, 35, 168)
</style>
