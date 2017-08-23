<template>
  <q-card v-if="data && diffi && bandMap">
    <q-card-media>
      <img v-lazy:background-image="`https://bangdream.ga/assets/musicjacket/${data.jacketImage}_jacket.png`" class="jacket-img preview-img"
        @click="$preview.open(0, [{
          src: `https://bangdream.ga/assets/musicjacket/${data.jacketImage}_jacket.png`,
          title: data.title,
          w: 600,
          h: 600
        }], {
          fullscreenEl: true,
          zoomEl: true,
          shareEl: true,
          history: false
        })" />
      <q-card-title slot="overlay">
        {{data.title}}
        <span slot="subtitle">{{bandMap[data.bandID].bandName}}</span>
      </q-card-title>
    </q-card-media>
    <a-player :music="{
      title: data.title,
      author: bandMap[data.bandID].bandName,
      url: `https://bangdream.ga/assets/sound/${data.bgmId}.mp3`,
      pic: `https://bangdream.ga/assets/musicjacket/${data.jacketImage}_thumb.png`
    }" ref="player" mode="single"></a-player>
    <q-card-main>
      <p>Composer: {{data.composer}}</p>
      <p>Lyricist: {{data.lyricist}}</p>
      <p>Arranger: {{data.arranger}}</p>
      <p>How to get: {{data.howToGet}}</p>
      <q-collapsible id="achievements" icon="move_to_inbox" label="Live achievement reward">
        <div>
          <div class="row items-center">
            <p class="col-3 col-xs-12">Combo</p>
            <span class="row">
              <span class="col-md-3 col-sm-6 col-xs-12 column items-center">
                <img v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('combo_easy'))}.png`">
                <p>{{getAchievement('combo_easy').quantity}}</p>
                <p>Easy</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-12 column items-center">
                <img v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('combo_normal'))}.png`">
                <p>{{getAchievement('combo_normal').quantity}}</p>
                <p>Normal</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-12 column items-center">
                <img v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('combo_hard'))}.png`">
                <p>{{getAchievement('combo_hard').quantity}}</p>
                <p>Hard</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-12 column items-center">
                <img v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('combo_expert'))}.png`">
                <p>{{getAchievement('combo_expert').quantity}}</p>
                <p>Expert</p>
              </span>
            </span>
          </div>
          <div class="row items-center">
            <p class="col-3 col-xs-12">Full combo</p>
            <span class="row">
              <span class="col-md-3 col-sm-6 col-xs-12 column items-center">
                <img v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_easy'))}.png`">
                <p>{{getAchievement('full_combo_easy').quantity}}</p>
                <p>Easy</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-12 column items-center">
                <img v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_normal'))}.png`">
                <p>{{getAchievement('full_combo_normal').quantity}}</p>
                <p>Normal</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-12 column items-center">
                <img v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_hard'))}.png`">
                <p>{{getAchievement('full_combo_hard').quantity}}</p>
                <p>Hard</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-12 column items-center">
                <img v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_expert'))}.png`">
                <p>{{getAchievement('full_combo_expert').quantity}}</p>
                <p>Expert</p>
              </span>
            </span>
          </div>
          <div class="row items-center">
            <p class="col-3 col-xs-12">Score rank</p>
            <span class="row">
              <span class="col-md-3 col-sm-6 col-xs-12 column items-center">
                <img v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_c'))}.png`">
                <p>{{getAchievement('score_rank_c').quantity}}</p>
                <p>Rank C</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-12 column items-center">
                <img v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_b'))}.png`">
                <p>{{getAchievement('score_rank_b').quantity}}</p>
                <p>Rank B</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-12 column items-center">
                <img v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_a'))}.png`">
                <p>{{getAchievement('score_rank_a').quantity}}</p>
                <p>Rank A</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-12 column items-center">
                <img v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_s'))}.png`">
                <p>{{getAchievement('score_rank_s').quantity}}</p>
                <p>Rank S</p>
              </span>
            </span>
          </div>
        </div>
      </q-collapsible>
    </q-card-main>
  </q-card>
</template>

<script>
import {
  QCard,
  QCardTitle,
  QCardMedia,
  QCardMain,
  QCollapsible
} from 'quasar'
import { mapGetters } from 'vuex'
import VueAplayer from 'vue-aplayer'

export default {
  name: 'musicComponent',
  props: ['data', 'diffi'],
  components: {
    QCard,
    QCardTitle,
    QCardMedia,
    QCardMain,
    QCollapsible,
    aPlayer: VueAplayer
  },
  computed: {
    ...mapGetters('DB', [
      'bandMap'
    ])
  },
  beforeDestroy () {
    let aplayer = this.$refs.player.control
    aplayer.destroy()
  },
  methods: {
    getAchievement (name) {
      return this.data.achievements.find(elem => elem.name === name)
    },
    getRwardFileName (achievement) {
      if (achievement.rewardID) {
        const splitName = achievement.rewardType.split('_')
        splitName[1] = splitName[1].charAt(0).toUpperCase() + splitName[1].slice(1)
        return splitName.join('').concat(achievement.rewardID)
      }
      else {
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
  background-size: cover
  background-repeat: no-repeat
  background-position: center
</style>
