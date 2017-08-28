<template>
  <div>
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
        url: `https://bangdream.ga/assets/sound/${data.bgmID}.mp3`,
        pic: `https://bangdream.ga/assets/musicjacket/${data.jacketImage}_thumb.png`
      }" ref="player" mode="single"></a-player>
      <q-card-main>
        <p>{{$t('composer')}}: {{data.composer}}</p>
        <p>{{$t('lyricist')}}: {{data.lyricist}}</p>
        <p>{{$t('arranger')}}: {{data.arranger}}</p>
        <p>{{$t('band')}}: <span v-if="Number(data.bandID) > 5">{{bandMap[data.bandID].bandName}}</span>
            <img height="60px" width="90px" v-if="Number(data.bandID) <= 5" v-lazy="`https://bangdream.ga/assets/band/logo/00${data.bandID}_logoL.png`" :alt="bandMap[data.bandID].bandName"></p>
        <p>{{$t('howtoget')}}: {{data.howToGet}}</p>
        <p>{{$t('difficulty')}}: {{getDifficulty(data.id)[0].level}} /
            {{getDifficulty(data.id)[3].level}} /
            {{getDifficulty(data.id)[2].level}} /
            {{getDifficulty(data.id)[1].level}}</p>
        <q-collapsible id="achievements" icon="move_to_inbox" label="Live achievement reward">
          <div class="row">
            <div class="row items-center col-12 col-xl-4 col-lg-4 col-md-6">
              <p class="col-3 col-xs-12">Combo</p>
              <span class="row">
                <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('combo_easy'))}.png`">
                  <p>{{getAchievement('combo_easy').quantity}}</p>
                  <p>Easy</p>
                </span>
                <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('combo_normal'))}.png`">
                  <p>{{getAchievement('combo_normal').quantity}}</p>
                  <p>Normal</p>
                </span>
                <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('combo_hard'))}.png`">
                  <p>{{getAchievement('combo_hard').quantity}}</p>
                  <p>Hard</p>
                </span>
                <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('combo_expert'))}.png`">
                  <p>{{getAchievement('combo_expert').quantity}}</p>
                  <p>Expert</p>
                </span>
              </span>
            </div>
            <div class="row items-center col-12 col-xl-4 col-lg-4 col-md-6">
              <p class="col-3 col-xs-12">Full combo</p>
              <span class="row">
                <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_easy'))}.png`">
                  <p>{{getAchievement('full_combo_easy').quantity}}</p>
                  <p>Easy</p>
                </span>
                <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_normal'))}.png`">
                  <p>{{getAchievement('full_combo_normal').quantity}}</p>
                  <p>Normal</p>
                </span>
                <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_hard'))}.png`">
                  <p>{{getAchievement('full_combo_hard').quantity}}</p>
                  <p>Hard</p>
                </span>
                <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_expert'))}.png`">
                  <p>{{getAchievement('full_combo_expert').quantity}}</p>
                  <p>Expert</p>
                </span>
              </span>
            </div>
            <div class="row items-center col-12 col-xl-4 col-lg-4 col-md-6">
              <p class="col-3 col-xs-12">Score rank</p>
              <span class="row">
                <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_c'))}.png`">
                  <p>{{getAchievement('score_rank_c').quantity}}</p>
                  <p>Rank C</p>
                </span>
                <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_b'))}.png`">
                  <p>{{getAchievement('score_rank_b').quantity}}</p>
                  <p>Rank B</p>
                </span>
                <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_a'))}.png`">
                  <p>{{getAchievement('score_rank_a').quantity}}</p>
                  <p>Rank A</p>
                </span>
                <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                  <img class="thumb-item" v-lazy="`https://bangdream.ga/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_s'))}.png`">
                  <p>{{getAchievement('score_rank_s').quantity}}</p>
                  <p>Rank S</p>
                </span>
              </span>
            </div>
          </div>
        </q-collapsible>
      </q-card-main>
    </q-card>
  </div>
</template>

<i18n>
{
  "en": {
    "composer": "Composer",
    "lyricist": "Lyricist",
    "arranger": "Arranger",
    "howtoget": "How to get",
    "difficulty": "Difficulty",
    "band": "Band"
  },
  "zh-CN": {
    "composer": "作曲",
    "lyricist": "作词",
    "arranger": "编曲",
    "howtoget": "获得方式",
    "difficulty": "难度",
    "band": "演奏者"
  },
  "zh-TW": {
    "composer": "作曲",
    "lyricist": "作詞",
    "arranger": "編曲",
    "howtoget": "獲得方式",
    "difficulty": "難度",
    "band": "演奏者"
  }
}
</i18n>

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
      'bandMap',
      'musicDifficultyList'
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
    },
    getDifficulty (musicID) {
      return this.musicDifficultyList.filter(elem => elem.musicID === musicID)
    }
  }
}
</script>

<style lang="stylus" scoped>
.jacket-img
  width: 100%
  height: 500px
  background-size: auto 100%
  background-repeat: no-repeat
  background-position: center

.thumb-item
  width 72px
  height 72px
</style>
