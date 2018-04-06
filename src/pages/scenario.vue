<template>
  <q-page padding>
    <div class="relative-position">
      <q-btn @click="playSoundList(talk, 0, false)" :disable="isPlaying">{{$t('scenario.auto-play')}}</q-btn>
      <q-btn @click="playSoundList(talk, 0, true)" :disable="isPlaying">{{$t('scenario.auto-play-with-bgm')}}</q-btn>
      <q-btn @click="stop = true, isStopping = true" :disable="isStopping || !isPlaying" color="pink-6">{{$t('scenario.stop')}}</q-btn>
      <q-btn @click="openURL(env.backgroundImage)">{{$t('scenario.show-bg-image')}}</q-btn>
      <q-inner-loading :visible="isStopping">
        <q-spinner-dots size="40px" color="pink-6"></q-spinner-dots>
        {{$t('scenario.stop-hint-text')}}
      </q-inner-loading>
    </div>
    <div v-if="isPlaying && currVoice">
      <p>{{$t('scenario.curr-voice')}}</p>
      <div style="height: 110px;">
        <transition appear enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutUp" :duration="500">
          <div class="row items-center" v-if="isShowCurr">
            <div class="col-3 column items-center">
              <img :src="`statics/chara_icon_${currVoice.charaId}.png`">
              <div>{{currVoice.charaName}}</div>
            </div>
            <div class="col-9">{{currVoice.text}}</div>
          </div>
        </transition>
      </div>
    </div>
    <q-table v-if="!isLoading" :data="talk" :columns="tableCols">
      <q-td slot="body-cell-charaId" slot-scope="cell" :props="cell">
        <img v-if="cell.value > 0 && cell.value < 26" :src="`statics/chara_icon_${cell.value}.png`" class="responsive">
      </q-td>
      <q-td slot="body-cell-voice" slot-scope="cell" :props="cell">
        <q-btn @click="playSound(cell.value)">Play</q-btn>
      </q-td>
    </q-table>
    <q-inner-loading :visible="isLoading">
      <q-spinner-dots size="80px" color="pink-6"></q-spinner-dots>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { openURL } from 'quasar'
import BufferLoader from '../plugins/bufferLoader'

export default {
  // name: 'PageName',
  data () {
    return {
      env: {},
      talk: [],
      tableCols: [{
        name: 'charaId',
        label: this.$t('common.avatar'),
        field: 'charaId',
        width: '20px'
      }, {
        name: 'charaName',
        label: this.$t('common.character'),
        field: 'charaName',
        width: '20px'
      }, {
        name: 'text',
        label: this.$t('scenario.voice-text'),
        field: 'text',
        width: '200px'
      }, {
        name: 'voice',
        label: this.$t('scenario.voice-play'),
        field: 'voice',
        width: '30px'
      }],
      AudioContext: window.AudioContext || window.webkitAudioContext || false,
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
    const { AudioContext } = this
    if (!AudioContext) return
    this.audioContext = new AudioContext()
    const ret = await this.$api.getScenarioInfo(this.server, this.scenarioType, this.scenarioName)
    this.env = ret.env
    this.talk = ret.talk
    this.isLoading = false
  },
  methods: {
    openURL,
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
      } else if (!talk[idx].voice) this.playSoundList(talk, idx += 1)
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

<style>
</style>
