<template>
  <q-page padding>
    <div v-if="isReady" class="row sm-column gutter-sm">
      <div class="col-lg-6 col-xs-12">
        <div
          class="jacket-img relative-position"
          style="cursor: pointer;"
        >
          <img class="absolute-center" :src="`/assets/musicjacket/${musicData.jacketImage}_jacket.png`" />
        </div>
        <a-player :music="{
          title: musicData.title,
          author: musicData.bandName,
          url: `/assets/sound/${musicData.bgmId}.mp3`,
          pic: `/assets/musicjacket/${musicData.jacketImage}_thumb.png`
        }" ref="player" mode="order"></a-player>
      </div>
      <div class="col-lg-6 col-xs-12">
        <h3>{{musicData.title}}</h3>
        <p>{{$t('music.composer')}}: {{musicData.composer}}</p>
        <p>{{$t('music.lyricist')}}: {{musicData.lyricist}}</p>
        <p>{{$t('music.arranger')}}: {{musicData.arranger}}</p>
        <p>{{$t('common.band')}}:
          <span v-if="Number(musicData.bandId) > 5">{{musicData.bandName}}</span>
          <img height="60px" width="100px" v-if="Number(musicData.bandId) <= 5" v-lazy="`/assets/band/logo/00${musicData.bandId}_logoL.png`">
        </p>
        <!-- <p>{{$t('combo')}}: {{musicData.combo}}</p> -->
        <p>{{$t('music.howtoget')}}: {{musicData.howToGet}}</p>
        <p>{{$t('music.difficulty')}}:
          <span style="color: RGB(67, 98, 241);">{{musicData.difficulty[0].level}}</span>
           / <span style="color: RGB(76, 219, 95);">{{musicData.difficulty[3].level}}</span>
           / <span style="color: RGB(216, 173, 96);">{{musicData.difficulty[2].level}}</span>
           / <span style="color: RGB(244, 56, 56);">{{musicData.difficulty[1].level}}</span>
          <span v-if="musicData.difficulty[4]"> / <span style="color: RGB(227, 41, 136);">{{musicData.difficulty[4].level}}</span></span>
        </p>
        <q-btn @click="$router.push(`/music/${server}/${musicData.musicId}/beatmap`)">{{$t('music.check-beatmap')}}</q-btn>
        <q-collapsible id="achievements" icon="move_to_inbox" :label="$t('music.achieve')">
          <div class="row">
            <div class="row items-center col-xl-6 col-12">
              <p class="col-12">Combo</p>
              <span class="row col-12">
                <span class="col-md-2 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('combo_easy'))}.png`">
                  <p>{{getAchievement('combo_easy').quantity}}</p>
                  <p>Easy</p>
                </span>
                <span class="col-md-2 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('combo_normal'))}.png`">
                  <p>{{getAchievement('combo_normal').quantity}}</p>
                  <p>Normal</p>
                </span>
                <span class="col-md-2 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('combo_hard'))}.png`">
                  <p>{{getAchievement('combo_hard').quantity}}</p>
                  <p>Hard</p>
                </span>
                <span class="col-md-2 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('combo_expert'))}.png`">
                  <p>{{getAchievement('combo_expert').quantity}}</p>
                  <p>Expert</p>
                </span>
              </span>
            </div>
            <div class="row items-center col-xl-6 col-12">
              <p class="col-12">Full combo</p>
              <span class="row col-12">
                <span class="col-md-2 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_easy'))}.png`">
                  <p>{{getAchievement('full_combo_easy').quantity}}</p>
                  <p>Easy</p>
                </span>
                <span class="col-md-2 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_normal'))}.png`">
                  <p>{{getAchievement('full_combo_normal').quantity}}</p>
                  <p>Normal</p>
                </span>
                <span class="col-md-2 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_hard'))}.png`">
                  <p>{{getAchievement('full_combo_hard').quantity}}</p>
                  <p>Hard</p>
                </span>
                <span class="col-md-2 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_expert'))}.png`">
                  <p>{{getAchievement('full_combo_expert').quantity}}</p>
                  <p>Expert</p>
                </span>
              </span>
            </div>
            <div class="row items-center col-12">
              <p class="col-12">Score rank</p>
              <span class="row col-12">
                <span class="col-md-2 col-xs-4 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_c'))}.png`">
                  <p>{{getAchievement('score_rank_c').quantity}}</p>
                  <p>Rank C</p>
                </span>
                <span class="col-md-2 col-xs-4 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_b'))}.png`">
                  <p>{{getAchievement('score_rank_b').quantity}}</p>
                  <p>Rank B</p>
                </span>
                <span class="col-md-2 col-xs-4 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_a'))}.png`">
                  <p>{{getAchievement('score_rank_a').quantity}}</p>
                  <p>Rank A</p>
                </span>
                <span class="col-md-2 col-xs-4 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_s'))}.png`">
                  <p>{{getAchievement('score_rank_s').quantity}}</p>
                  <p>Rank S</p>
                </span>
                <span class="col-md-2 col-xs-4 column items-center">
                  <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_s'))}.png`">
                  <p>{{getAchievement('score_rank_ss').quantity}}</p>
                  <p>Rank SS</p>
                </span>
              </span>
            </div>
          </div>
        </q-collapsible>
      </div>
    </div>
    <q-spinner v-else color="pink" size="48px"></q-spinner>
  </q-page>
</template>

<script>
import VueAplayer from 'vue-aplayer'
import { mapState, mapActions } from 'vuex'

export default {
  // name: 'PageName',
  data () {
    return {
      isReady: false
    }
  },
  components: {
    aPlayer: VueAplayer
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getMusicById({musicId: this.$route.params.musicId, server: this.server})
      this.isReady = true
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
    musicData () {
      return this.musicMap[this.server][this.$route.params.musicId]
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
</style>
