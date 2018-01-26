<template>
  <div>
    <div class="relative-position">
      <q-btn @click="playSoundList(talk, 0, false)" :disable="isPlaying">{{$t('auto-play')}}</q-btn>
      <q-btn @click="playSoundList(talk, 0, true)" :disable="isPlaying">{{$t('auto-play-with-bgm')}}</q-btn>
      <q-btn @click="stop = true, isStopping = true" :disable="isStopping || !isPlaying" color="pink-6">{{$t('stop')}}</q-btn>
      <a :href="env.backgroundImage" target="_blank">{{$t('show-bg-image')}}</a>
      <q-inner-loading :visible="isStopping">
        <q-spinner-dots size="40px" color="pink-6"></q-spinner-dots>
        {{$t('stop-hint-text')}}
      </q-inner-loading>
    </div>
    <div v-if="isPlaying && currVoice">
      <p>{{$t('curr-voice')}}</p>
      <div style="height: 110px;">
        <q-transition appear enter="bounceInUp" leave="bounceOutUp" :duration="500">
          <div class="row items-center" v-if="isShowCurr">
            <div class="col-3 column items-center">
              <img :src="`statics/chara_icon_${currVoice.charaId}.png`">
              <div>{{currVoice.charaName}}</div>
            </div>
            <div class="col-9">{{currVoice.text}}</div>
          </div>
        </q-transition>
      </div>
    </div>
    <q-data-table v-if="!isLoading" :data="talk" :config="tableConf" :columns="tableCols">
      <template slot="col-charaId" slot-scope="cell">
        <img v-if="cell.data > 0 && cell.data < 26" :src="`statics/chara_icon_${cell.data}.png`" class="responsive">
      </template>
      <template slot="col-voice" slot-scope="cell">
        <q-btn @click="playSound(cell.data)">Play</q-btn>
      </template>
    </q-data-table>
    <q-inner-loading :visible="isLoading">
      <q-spinner-dots size="80px" color="pink-6"></q-spinner-dots>
    </q-inner-loading>
  </div>
</template>

<i18n>
{
  "en": {
    "auto-play": "Auto Play",
    "auto-play-with-bgm": "Auto Play With BGM",
    "stop": "Stop",
    "show-bg-image": "Background image",
    "stop-hint-text": "Waiting for current voice playing to its end and stop...",
    "curr-voice": "Current voice",
    "table": {
      "avatar": "Avatar",
      "chara": "Character",
      "voice-text": "Voice text",
      "voice-play": "Voice player"
    }
  },
  "zh-cn": {
    "auto-play": "自动播放语音",
    "auto-play-with-bgm": "自动播放语音和背景音乐",
    "stop": "停止",
    "show-bg-image": "背景图片",
    "stop-hint-text": "等待当前语音播放结束……",
    "curr-voice": "当前语音",
    "table": {
      "avatar": "头像",
      "chara": "角色",
      "voice-text": "语音文本",
      "voice-play": "播放语音"
    }
  },
  "zh-tw": {
    "auto-play": "自動播放語音",
    "auto-play-with-bgm": "自動播放語音和背景音樂",
    "stop": "停止",
    "show-bg-image": "背景圖片",
    "stop-hint-text": "等待當前語音播放結束……",
    "curr-voice": "當前語音",
    "table": {
      "avatar": "頭像",
      "chara": "角色",
      "voice-text": "語音文本",
      "voice-play": "播放語音"
    }
  }
}
</i18n>

<script>
import {
  QDataTable,
  QBtn,
  QSpinnerDots,
  QInnerLoading,
  QTransition
} from 'quasar'
import apiDBInfo from 'api/dbinfo'
import BufferLoader from 'assets/bufferLoader'
import 'quasar-extras/animate/bounceInUp.css'
import 'quasar-extras/animate/bounceOutUp.css'

export default {
  name: 'scenario',
  components: {
    QDataTable,
    QBtn,
    QSpinnerDots,
    QInnerLoading,
    QTransition
  },
  data () {
    return {
      env: {},
      talk: [],
      tableConf: {
        rowHeight: '40px'
      },
      tableCols: [{
        label: this.$t('table.avatar'),
        field: 'charaId',
        width: '20px'
      }, {
        label: this.$t('table.chara'),
        field: 'charaName',
        width: '20px'
      }, {
        label: this.$t('table.voice-text'),
        field: 'text',
        width: '200px'
      }, {
        label: this.$t('table.voice-play'),
        field: 'voice',
        width: '30px'
      }],
      audioContext: new AudioContext(),
      isLoading: false,
      isPlaying: false,
      isStopping: false,
      stop: false,
      currVoice: null,
      isShowCurr: false
    }
  },
  computed: {
    server () {
      return this.$route.params.server
    },
    scenarioType () {
      return this.$route.params.scenarioType
    },
    scenarioName () {
      return this.$route.params.scenarioName
    }
  },
  async mounted () {
    this.isLoading = true
    const ret = await apiDBInfo.getScenarioInfo(this.server, this.scenarioType, this.scenarioName)
    this.env = ret.env
    this.talk = ret.talk
    this.isLoading = false
  },
  methods: {
    playSound (voicePath, cb) {
      // load and play
      const buf = new BufferLoader(
        this.audioContext,
        [
          voicePath
        ],
        () => {
          const source = this.audioContext.createBufferSource()
          source.buffer = buf.bufferList[0]
          const gain = this.audioContext.createGain()
          gain.gain.value = 0.5
          source.connect(gain)
          gain.connect(this.audioContext.destination)
          source.start(this.audioContext.currentTime)

          source.addEventListener('ended', () => {
            this.isShowCurr = false
            if (cb) {
              setTimeout(() => {
                cb()
              }, 1000)
            }
          })
        }
      )

      buf.load()
    },
    playBGM (voicePath, cb) {
      // load and play
      const buf = new BufferLoader(
        this.audioContext,
        [
          voicePath
        ],
        () => {
          const source = this.audioContext.createBufferSource()
          source.buffer = buf.bufferList[0]
          const gain = this.audioContext.createGain()
          gain.gain.value = 0.5
          source.connect(gain)
          source.loop = true
          gain.connect(this.audioContext.destination)
          source.start(this.audioContext.currentTime)
          this.bgm = source

          if (cb) cb()
        }
      )

      buf.load()
    },
    playSoundList (talk, idx, isBGM) {
      this.currVoice = talk[idx]
      if (isBGM && !this.bgm) {
        this.isPlaying = true
        this.playBGM(this.env.bgm, () => {
          this.playSoundList(talk, idx, false)
        })
      }
      else if (!talk[idx].voice) this.playSoundList(talk, idx += 1)
      else {
        this.isPlaying = true
        this.isShowCurr = true
        this.playSound(talk[idx].voice, () => {
          if (this.stop || idx + 1 === talk.length) {
            if (this.bgm) {
              this.bgm.stop()
              delete this.bgm
            }
            this.isPlaying = false
            this.isStopping = false
            this.stop = false
            this.currVoice = null
            return
          }
          this.playSoundList(talk, idx += 1)
        })
      }
    }
  },
  destroyed () {
    this.audioContext.close()
  }
}
</script>

<style lang="stylus" scoped>

</style>
