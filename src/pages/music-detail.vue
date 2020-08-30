<template>
  <q-page padding>
    <div v-if="isReady" class="row q-col-gutter-sm">
      <div class="col-lg-6 col-12">
        <div
          class="jacket-img relative-position"
          style="cursor: pointer;"
        >
          <img class="absolute-center" :src="musicData.jacket" />
        </div>
        <a-player :music="{
          title: musicData.title,
          author: musicData.bandName,
          url: musicData.bgmFile,
          pic: musicData.thumb
        }" ref="player" mode="order" theme="#Cee"></a-player>
      </div>
      <div class="col-lg-6 col-12">
        <h3>{{musicData.title}}</h3>
        <p>{{$t('music.composer')}}: {{musicData.composer}}</p>
        <p>{{$t('music.lyricist')}}: {{musicData.lyricist}}</p>
        <p>{{$t('music.arranger')}}: {{musicData.arranger}}</p>
        <p>{{$t('common.band')}}:
          <span v-if="Number(musicData.bandId) > 5">{{musicData.bandName}}</span>
          <img height="60px" width="100px" v-if="Number(musicData.bandId) <= 5" v-lazy="`/assets/band/logo/00${musicData.bandId}_rip/logoL.webp`">
        </p>
        <!-- <p>{{$t('combo')}}: {{musicData.combo}}</p> -->
        <p>{{$t('music.howtoget')}}: {{musicData.howToGet}}</p>
        <p>{{$t('music.difficulty')}}:
          <span class="music-levels">
            <span class="music-level music-level-easy">{{musicData.difficulty[0].level}}</span>
            <span class="music-level music-level-normal">{{musicData.difficulty[3].level}}</span>
            <span class="music-level music-level-hard">{{musicData.difficulty[2].level}}</span>
            <span class="music-level music-level-expert">{{musicData.difficulty[1].level}}</span>
            <span v-if="musicData.difficulty[4]" class="music-level music-level-special">{{musicData.difficulty[4].level}}</span>
          </span>
        </p>
        <q-btn @click="$router.push(`/music/${server}/${musicData.musicId}/beatmap`)">{{$t('music.check-beatmap')}}</q-btn>
        <q-btn @click="$router.push({ name: 'musicList', params: { server } })">{{$t('common.back-to-list')}}</q-btn>
        <q-btn @click="isAchieveVisible = true">{{$t('music.achieve')}}</q-btn>
        <q-dialog v-model="isAchieveVisible">
          <q-card>
            <q-card-section class="row items-center">
              <p class="col-12">{{$t('music.combo-reward')}}</p>
              <span class="row justify-between col-12">
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('combo_easy')" type-name="rewardType" />
                  <p class="text-subtitle1">{{$t('music.difficulties[0]')}}</p>
                </span>
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('combo_normal')" type-name="rewardType" />
                  <p class="text-subtitle1">{{$t('music.difficulties[1]')}}</p>
                </span>
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('combo_hard')" type-name="rewardType" />
                  <p class="text-subtitle1">{{$t('music.difficulties[2]')}}</p>
                </span>
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('combo_expert')" type-name="rewardType" />
                  <p class="text-subtitle1">{{$t('music.difficulties[3]')}}</p>
                </span>
                <span v-if="musicData.difficulty[4]" class="column items-center">
                  <single-resource :server="server" :data="getAchievement('combo_special')" type-name="rewardType" />
                  <p class="text-subtitle1">{{$t('music.difficulties[4]')}}</p>
                </span>
              </span>
            </q-card-section>
            <q-card-section class="row items-center">
              <p class="col-12">{{$t('music.full-combo-reward')}}</p>
              <span class="row justify-between col-12">
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('full_combo_easy')" type-name="rewardType" />
                  <p class="text-subtitle1">{{$t('music.difficulties[0]')}}</p>
                </span>
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('full_combo_normal')" type-name="rewardType" />
                  <p class="text-subtitle1">{{$t('music.difficulties[1]')}}</p>
                </span>
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('full_combo_hard')" type-name="rewardType" />
                  <p class="text-subtitle1">{{$t('music.difficulties[2]')}}</p>
                </span>
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('full_combo_expert')" type-name="rewardType" />
                  <p class="text-subtitle1">{{$t('music.difficulties[3]')}}</p>
                </span>
                <span v-if="musicData.difficulty[4]" class="column items-center">
                  <single-resource :server="server" :data="getAchievement('full_combo_special')" type-name="rewardType" />
                  <p class="text-subtitle1">{{$t('music.difficulties[4]')}}</p>
                </span>
              </span>
            </q-card-section>
            <q-card-section class="row items-center">
              <p class="col-12">{{$t('music.score-rank-reward')}}</p>
              <span class="row justify-between col-12">
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('score_rank_c')" type-name="rewardType" id-name="rewardId" />
                  <p class="text-subtitle1">C</p>
                </span>
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('score_rank_b')" type-name="rewardType" id-name="rewardId" />
                  <p class="text-subtitle1">B</p>
                </span>
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('score_rank_a')" type-name="rewardType" id-name="rewardId" />
                  <p class="text-subtitle1">A</p>
                </span>
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('score_rank_s')" type-name="rewardType" id-name="rewardId" />
                  <p class="text-subtitle1">S</p>
                </span>
                <span class="column items-center">
                  <single-resource :server="server" :data="getAchievement('score_rank_ss')" type-name="rewardType" id-name="rewardId" />
                  <p class="text-subtitle1">SS</p>
                </span>
              </span>
            </q-card-section>
          </q-card>
        </q-dialog>
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
      return this.musicData.achievements.find(elem => elem.name === name)
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
