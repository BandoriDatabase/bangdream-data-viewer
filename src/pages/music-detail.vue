<template>
  <q-page padding>
    <div v-if="isReady" class="row sm-column gutter-sm">
      <div class="col-lg-6 col-xs-12">
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
        }" ref="player" mode="order"></a-player>
      </div>
      <div class="col-lg-6 col-xs-12">
        <h3>{{musicData.title}}</h3>
        <p>{{$t('music.composer')}}: {{musicData.composer}}</p>
        <p>{{$t('music.lyricist')}}: {{musicData.lyricist}}</p>
        <p>{{$t('music.arranger')}}: {{musicData.arranger}}</p>
        <p>{{$t('common.band')}}:
          <span v-if="Number(musicData.bandId) > 5">{{musicData.bandName}}</span>
          <img height="60px" width="100px" v-if="Number(musicData.bandId) <= 5" v-lazy="`/assets/band/logo/00${musicData.bandId}_rip/logoL.png`">
        </p>
        <!-- <p>{{$t('combo')}}: {{musicData.combo}}</p> -->
        <p>{{$t('music.howtoget')}}: {{musicData.howToGet}}</p>
        <p>{{$t('music.difficulty')}}:
          <span class="music-difficulty">
            <q-chip small color="indigo">{{musicData.difficulty[0].level}}</q-chip>
            <q-chip small color="green">{{musicData.difficulty[3].level}}</q-chip>
            <q-chip small color="amber">{{musicData.difficulty[2].level}}</q-chip>
            <q-chip small color="red">{{musicData.difficulty[1].level}}</q-chip>
            <q-chip v-if="musicData.difficulty[4]" small color="purple">{{musicData.difficulty[4].level}}</q-chip>
          </span>
        </p>
        <q-btn @click="$router.push(`/music/${server}/${musicData.musicId}/beatmap`)">{{$t('music.check-beatmap')}}</q-btn>
        <q-btn @click="$router.push({ name: 'musicList', params: { server } })">{{$t('common.back-to-list')}}</q-btn>
        <q-collapsible id="achievements" icon="move_to_inbox" :label="$t('music.achieve')">
          <div class="row">
            <div class="row items-center col-xl-6 col-12">
              <p class="col-12">Combo</p>
              <span class="row col-12">
                <span class="col-md-3 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('combo_easy'))}.png`">
                  <p>{{getAchievement('combo_easy').quantity}}</p>
                  <p>Easy</p>
                </span>
                <span class="col-md-3 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('combo_normal'))}.png`">
                  <p>{{getAchievement('combo_normal').quantity}}</p>
                  <p>Normal</p>
                </span>
                <span class="col-md-3 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('combo_hard'))}.png`">
                  <p>{{getAchievement('combo_hard').quantity}}</p>
                  <p>Hard</p>
                </span>
                <span class="col-md-3 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('combo_expert'))}.png`">
                  <p>{{getAchievement('combo_expert').quantity}}</p>
                  <p>Expert</p>
                </span>
              </span>
            </div>
            <div class="row items-center col-xl-6 col-12">
              <p class="col-12">Full combo</p>
              <span class="row col-12">
                <span class="col-md-3 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('full_combo_easy'))}.png`">
                  <p>{{getAchievement('full_combo_easy').quantity}}</p>
                  <p>Easy</p>
                </span>
                <span class="col-md-3 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('full_combo_normal'))}.png`">
                  <p>{{getAchievement('full_combo_normal').quantity}}</p>
                  <p>Normal</p>
                </span>
                <span class="col-md-3 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('full_combo_hard'))}.png`">
                  <p>{{getAchievement('full_combo_hard').quantity}}</p>
                  <p>Hard</p>
                </span>
                <span class="col-md-3 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('full_combo_expert'))}.png`">
                  <p>{{getAchievement('full_combo_expert').quantity}}</p>
                  <p>Expert</p>
                </span>
              </span>
            </div>
            <div class="row items-center col-12">
              <p class="col-12">Score rank</p>
              <span class="row col-12">
                <span class="col-md-2 col-xs-4 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('score_rank_c'))}.png`">
                  <p>{{getAchievement('score_rank_c').quantity}}</p>
                  <p>Rank C</p>
                </span>
                <span class="col-md-2 col-xs-4 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('score_rank_b'))}.png`">
                  <p>{{getAchievement('score_rank_b').quantity}}</p>
                  <p>Rank B</p>
                </span>
                <span class="col-md-2 col-xs-4 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('score_rank_a'))}.png`">
                  <p>{{getAchievement('score_rank_a').quantity}}</p>
                  <p>Rank A</p>
                </span>
                <span class="col-md-2 col-xs-4 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('score_rank_s'))}.png`">
                  <p>{{getAchievement('score_rank_s').quantity}}</p>
                  <p>Rank S</p>
                </span>
                <span class="col-md-2 col-xs-4 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_rip/${getRwardFileName(getAchievement('score_rank_s'))}.png`">
                  <p>{{getAchievement('score_rank_ss').quantity}}</p>
                  <p>Rank SS</p>
                </span>
              </span>
            </div>
          </div>
        </q-collapsible>
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

export default {
  // name: 'PageName',
  data () {
    return {
      isReady: false,
      isError: false
    }
  },
  components: {
    aPlayer: VueAplayer
  },
  mounted () {
    this.$nextTick(async () => {
      try {
        await this.getMusicById({musicId: this.musicId, server: this.server})
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
        await this.getMusicById({musicId: this.musicId, server: this.server})
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

span.music-difficulty span
    display inline-block
    font-size 85%
    font-weight bold
    width 30px
    height 18px
    border-radius 8px
    background red
    text-align center
    line-height 18px
    margin-right 5px
</style>
