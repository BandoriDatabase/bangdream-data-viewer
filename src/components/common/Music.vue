<template>
  <div class="row sm-column">
    <div class="col-lg-6 col-xs-12">
      <div @click="$preview.open(0, [{
        src: `/assets/musicjacket/${data.jacketImage}_jacket.png`,
        title: data.title,
        w: 600,
        h: 600
      }], {
        fullscreenEl: true,
        zoomEl: true,
        shareEl: true,
        history: false
      })" v-lazy:background-image="`/assets/musicjacket/${data.jacketImage}_jacket.png`" class="jacket-img preview-img"></div>
      <a-player :music="{
        title: data.title,
        author: data.bandName,
        url: `/assets/sound/${data.bgmId}.mp3`,
        pic: `/assets/musicjacket/${data.jacketImage}_thumb.png`
      }" ref="player" mode="single"></a-player>
    </div>
    <div class="col-lg-6 col-xs-12">
      <h3>{{data.title}}</h3>
      <p>{{$t('composer')}}: {{data.composer}}</p>
      <p>{{$t('lyricist')}}: {{data.lyricist}}</p>
      <p>{{$t('arranger')}}: {{data.arranger}}</p>
      <p>{{$t('band')}}:
        <span v-if="Number(data.bandId) > 5">{{data.bandName}}</span>
        <img height="60px" width="100px" v-if="Number(data.bandId) <= 5" v-lazy="`/assets/band/logo/00${data.bandId}_logoL.png`">
      </p>
      <!-- <p>{{$t('combo')}}: {{data.combo}}</p> -->
      <p>{{$t('howtoget')}}: {{data.howToGet}}</p>
      <q-btn @click="$router.push({ name: 'musicScore', params: { musicId: data.musicId } })">{{$t('check-beatmap')}}</q-btn>
      <!-- <p>{{$t('difficulty')}}: {{getDifficulty(data.id)[0].level}} /
          {{getDifficulty(data.id)[3].level}} /
          {{getDifficulty(data.id)[2].level}} /
          {{getDifficulty(data.id)[1].level}}</p> -->
      <q-collapsible id="achievements" icon="move_to_inbox" :label="$t('achieve')">
        <div class="row">
          <div class="row items-center col-xl-6 col-12">
            <p class="col-12">Combo</p>
            <span class="row">
              <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('combo_easy'))}.png`">
                <p>{{getAchievement('combo_easy').quantity}}</p>
                <p>Easy</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('combo_normal'))}.png`">
                <p>{{getAchievement('combo_normal').quantity}}</p>
                <p>Normal</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('combo_hard'))}.png`">
                <p>{{getAchievement('combo_hard').quantity}}</p>
                <p>Hard</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('combo_expert'))}.png`">
                <p>{{getAchievement('combo_expert').quantity}}</p>
                <p>Expert</p>
              </span>
            </span>
          </div>
          <div class="row items-center col-xl-6 col-12">
            <p class="col-3 col-xs-12">Full combo</p>
            <span class="row">
              <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_easy'))}.png`">
                <p>{{getAchievement('full_combo_easy').quantity}}</p>
                <p>Easy</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_normal'))}.png`">
                <p>{{getAchievement('full_combo_normal').quantity}}</p>
                <p>Normal</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_hard'))}.png`">
                <p>{{getAchievement('full_combo_hard').quantity}}</p>
                <p>Hard</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('full_combo_expert'))}.png`">
                <p>{{getAchievement('full_combo_expert').quantity}}</p>
                <p>Expert</p>
              </span>
            </span>
          </div>
          <div class="row items-center col-xl-6 col-12">
            <p class="col-3 col-xs-12">Score rank</p>
            <span class="row">
              <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_c'))}.png`">
                <p>{{getAchievement('score_rank_c').quantity}}</p>
                <p>Rank C</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_b'))}.png`">
                <p>{{getAchievement('score_rank_b').quantity}}</p>
                <p>Rank B</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_a'))}.png`">
                <p>{{getAchievement('score_rank_a').quantity}}</p>
                <p>Rank A</p>
              </span>
              <span class="col-md-3 col-sm-6 col-xs-6 column items-center">
                <img class="thumb-item" v-lazy="`/assets/thumb/common_${getRwardFileName(getAchievement('score_rank_s'))}.png`">
                <p>{{getAchievement('score_rank_s').quantity}}</p>
                <p>Rank S</p>
              </span>
            </span>
          </div>
        </div>
      </q-collapsible>
    </div>
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
    "band": "Band",
    "achieve": "Live achievement reward",
    "combo": "Total notes",
    "check-beatmap": "Open beatmap player"
  },
  "zh-cn": {
    "composer": "作曲",
    "lyricist": "作词",
    "arranger": "编曲",
    "howtoget": "获得方式",
    "difficulty": "难度",
    "band": "演奏者",
    "achieve": "歌曲成就",
    "combo": "音符数",
    "check-beatmap": "打开谱面播放器"
  },
  "zh-tw": {
    "composer": "作曲",
    "lyricist": "作詞",
    "arranger": "編曲",
    "howtoget": "獲得方式",
    "difficulty": "難度",
    "band": "演奏者",
    "achieve": "歌曲成就",
    "combo": "音符數",
    "check-beatmap": "打開譜面播放器"
  },
  "ja": {
    "composer": "作曲",
    "lyricist": "作詞",
    "arranger": "編曲",
    "howtoget": "入手方法",
    "difficulty": "難易度",
    "band": "出演者",
    "achieve": "達成報酬",
    "combo": "トータルノート",
    "check-beatmap": "ビートマッププレイヤーを開く"
  }
}
</i18n>

<script>
import {
  QCard,
  QCardTitle,
  QCardMedia,
  QCardMain,
  QCollapsible,
  QBtn
} from 'quasar'
import VueAplayer from 'vue-aplayer'

export default {
  name: 'musicComponent',
  props: ['data', 'diffi', 'band'],
  components: {
    QCard,
    QCardTitle,
    QCardMedia,
    QCardMain,
    QCollapsible,
    aPlayer: VueAplayer,
    QBtn
  },
  beforeDestroy () {
    let aplayer = this.$refs.player.control
    if (aplayer) aplayer.destroy()
  },
  methods: {
    getAchievement (name) {
      return this.data.achievements.find(elem => elem.name === name)
    },
    getRwardFileName (achievement) {
      if (achievement.rewardId) {
        const splitName = achievement.rewardType.split('_')
        splitName[1] = splitName[1].charAt(0).toUpperCase() + splitName[1].slice(1)
        return splitName.join('').concat(achievement.rewardId)
      }
      else {
        return achievement.rewardType
      }
    },
    getDifficulty (musicId) {
      return this.musicDifficultyList.filter(elem => elem.musicId === musicId)
    },
    startRhythm () {
      this.$http.get(`/api/v1/jp/music/chart/${this.data.musicId}/expert`)
        .then(res => res.json())
        .then(res => {
          const baseTime = this.audioContext.currentTime + 0.1
          res.forEach(note => {
            switch (note.type) {
              case 'Music':
                this.playSound(this.bufferLoader.bufferList[0], baseTime + note.timing)
                break
              default:
                this.playSound(this.bufferLoader.bufferList[1], baseTime + note.timing)
                if (note.endTiming) this.playSound(this.bufferLoader.bufferList[1], baseTime + note.endTiming)
                break
            }
          })

          this.draw(res, baseTime, this.bufferLoader.bufferList[0].duration)
        })
    },
    drawBackground () {
      const canvas = this.$refs.game.getContext('2d')
      canvas.clearRect(100, 10, 280, 750)
      canvas.fillStyle = '#1088d0'
      canvas.fillRect(100, 10, 38, 700)
      canvas.fillRect(140, 10, 38, 700)
      canvas.fillRect(180, 10, 38, 700)
      canvas.fillRect(220, 10, 38, 700)
      canvas.fillRect(260, 10, 38, 700)
      canvas.fillRect(300, 10, 38, 700)
      canvas.fillRect(340, 10, 38, 700)

      canvas.fillStyle = '#000000'
      canvas.fillRect(138, 10, 2, 700)
      canvas.fillRect(178, 10, 2, 700)
      canvas.fillRect(218, 10, 2, 700)
      canvas.fillRect(258, 10, 2, 700)
      canvas.fillRect(298, 10, 2, 700)
      canvas.fillRect(338, 10, 2, 700)
    },
    draw (noteArr, baseTime, maxLength) {
      const canvas = this.$refs.game.getContext('2d')
      const drawingNotes = noteArr.filter(note => {
        const noteTime = note.timing - (this.audioContext.currentTime - baseTime)
        const noteEndTime = note.endTiming - (this.audioContext.currentTime - baseTime)
        return (noteTime > 0 && noteTime < 1) || (noteEndTime > 0)
      })

      this.drawBackground()
      const noteColorMap = {
        'Flick': '#e317f1fa',
        'Slide_End_Flick_A': '#e317f1fa',
        'Slide_End_Flick_B': '#e317f1fa'
      }

      drawingNotes.forEach(note => {
        const noteTime = note.timing - (this.audioContext.currentTime - baseTime)
        const noteEndTime = note.endTiming - (this.audioContext.currentTime - baseTime)
        canvas.fillStyle = noteColorMap[note.type] || '#3619d2'
        let height = 690 * (1 - noteTime)
        let noteHeight = 20
        if (height > 700) height = 700
        // draw note as animation
        switch (note.column) {
          case 'SC':
            canvas.fillRect(100, 10 + height, 38, noteHeight)
            if (noteEndTime) {
              canvas.fillRect(100, 700 * (1 - noteEndTime), 38, 20)
              canvas.fillStyle = '#18ff15bd'
              canvas.fillRect(100, 10 + height, 38, 710 * (1 - noteEndTime) - height)
            }
            break
          case '1':
            canvas.fillRect(140, 10 + height, 38, noteHeight)
            if (noteEndTime) {
              canvas.fillRect(140, 700 * (1 - noteEndTime), 38, 20)
              canvas.fillStyle = '#18ff15bd'
              canvas.fillRect(140, 10 + height, 38, 710 * (1 - noteEndTime) - height)
            }
            break
          case '2':
            canvas.fillRect(180, 10 + height, 38, noteHeight)
            if (noteEndTime) {
              canvas.fillRect(180, 700 * (1 - noteEndTime), 38, 20)
              canvas.fillStyle = '#18ff15bd'
              canvas.fillRect(180, 10 + height, 38, 710 * (1 - noteEndTime) - height)
            }
            break
          case '3':
            canvas.fillRect(220, 10 + height, 38, noteHeight)
            if (noteEndTime) {
              canvas.fillRect(220, 700 * (1 - noteEndTime), 38, 20)
              canvas.fillStyle = '#18ff15bd'
              canvas.fillRect(220, 10 + height, 38, 710 * (1 - noteEndTime) - height)
            }
            break
          case '4':
            canvas.fillRect(260, 10 + height, 38, noteHeight)
            if (noteEndTime) {
              canvas.fillRect(260, 700 * (1 - noteEndTime), 38, 20)
              canvas.fillStyle = '#18ff15bd'
              canvas.fillRect(260, 10 + height, 38, 710 * (1 - noteEndTime) - height)
            }
            break
          case '5':
            canvas.fillRect(300, 10 + height, 38, noteHeight)
            if (noteEndTime) {
              canvas.fillRect(300, 700 * (1 - noteEndTime), 38, 20)
              canvas.fillStyle = '#18ff15bd'
              canvas.fillRect(300, 10 + height, 38, 710 * (1 - noteEndTime) - height)
            }
            break
          case '6':
            canvas.fillRect(340, 10 + height, 38, noteHeight)
            if (noteEndTime) {
              canvas.fillRect(340, 700 * (1 - noteEndTime), 38, 20)
              canvas.fillStyle = '#18ff15bd'
              canvas.fillRect(340, 10 + height, 38, 710 * (1 - noteEndTime) - height)
            }
            break
        }
      })

      if (this.audioContext.currentTime - baseTime <= maxLength) requestAnimationFrame(this.draw.bind(this, noteArr, baseTime, maxLength))
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
