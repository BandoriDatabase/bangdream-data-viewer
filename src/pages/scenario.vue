<template>
  <q-page padding>
    <div class="relative-position q-mb-sm">
      <q-btn @click="playSoundList(scenarioData.snippets.filter(snippet => snippet.actionType === 'Talk'), 0, false)" :disable="isPlaying">{{$t('scenario.auto-play')}}</q-btn>
      <q-btn @click="playSoundList(scenarioData.snippets.filter(snippet => snippet.actionType === 'Talk'), 0, true)" :disable="isPlaying">{{$t('scenario.auto-play-with-bgm')}}</q-btn>
      <q-btn @click="stop = true, currentSource.stop(), bgm.stop()" v-show="isPlaying" color="pink-6">{{$t('scenario.stop')}}</q-btn>
      <q-btn @click="$refs.bgImage.$viewer.show()">{{$t('scenario.show-bg-image')}}</q-btn>
      <img :src="scenarioData ? scenarioData.firstBackground : ''" v-show="false" v-viewer ref="bgImage"/>
      <!-- <q-inner-loading :showing="isStopping">
        <q-spinner-dots size="40px" color="pink-6"></q-spinner-dots>
        {{$t('scenario.stop-hint-text')}}
      </q-inner-loading> -->
    </div>
    <div v-if="isPlaying && currVoice">
      <p>{{$t('scenario.curr-voice')}}</p>
      <div style="height: 110px;">
        <transition appear enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight" :duration="500">
          <div class="row items-center" v-if="isShowCurr">
            <div class="col-3 column items-center">
              <img :src="`chara/chara_icon_${currVoice.talkData.talkCharacters[0].characterId}.png`">
              <div>{{currVoice.talkData.windowDisplayName}}</div>
            </div>
            <div class="col-9">{{currVoice.talkData.body}}</div>
          </div>
        </transition>
      </div>
    </div>
    <q-table v-if="!isLoading" :columns="tableCols"
      :data="scenarioData ? scenarioData.snippets.filter(snippet => snippet.actionType === 'Talk') : []">
      <q-td slot="body-cell-charaId" slot-scope="cell" :props="cell">
        <img v-if="cell.value > 0 && cell.value < 36" :src="`chara/chara_icon_${cell.value}.png`" class="responsive">
      </q-td>
      <q-td slot="body-cell-voice" slot-scope="cell" :props="cell">
        <q-btn round @click="playSound(cell.value), playSingleId = cell.rowIndex"
          icon="play_arrow" v-if="playSingleId !== cell.rowIndex">
          <q-tooltip>{{cell.row.talkData.body}}</q-tooltip>
        </q-btn>
        <q-btn round @click="currentSource.stop(), playSingleId = -1"
          icon="stop" v-else>
          <q-tooltip>{{cell.row.talkData.body}}</q-tooltip>
        </q-btn>
      </q-td>
    </q-table>
    <q-inner-loading :showing="isLoading">
      <q-spinner-dots size="80px" color="pink-6"></q-spinner-dots>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { openURL } from 'quasar'
import BufferLoader from '../boot/bufferLoader'

export default {
  // name: 'PageName',
  data () {
    return {
      scenarioData: null,
      tableCols: [{
        name: 'charaId',
        label: this.$t('common.avatar'),
        field: row => row.talkData.talkCharacters[0].characterId,
        style: 'max-width: 20px',
        align: 'center'
      }, {
        name: 'charaName',
        label: this.$t('common.character'),
        field: row => row.talkData.windowDisplayName,
        style: 'max-width: 20px',
        align: 'center'
      }, {
        name: 'text',
        label: this.$t('scenario.voice-text'),
        field: row => row.talkData.body,
        style: 'max-width: 170px;text-overflow: ellipsis;overflow-x: hidden;',
        align: 'left'
      }, {
        name: 'voice',
        label: this.$t('scenario.voice-play'),
        field: row => row.talkData.voices[0].voicePath,
        style: 'max-width: 30px',
        align: 'center'
      }],
      AudioContext: window.AudioContext || window.webkitAudioContext || false,
      isLoading: false,
      isPlaying: false,
      isStopping: false,
      stop: false,
      currVoice: null,
      isShowCurr: false,
      currentSource: null,
      playSingleId: -1
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
    this.scenarioData = await this.$api.getScenarioInfo(this.server, this.scenarioType, this.scenarioName)
    this.isLoading = false
  },
  methods: {
    openURL,
    playSound (voicePath, cb) {
      // load and play
      if (this.currentSource) this.currentSource.stop()
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
          this.currentSource = source

          source.addEventListener('ended', () => {
            this.isShowCurr = false
            this.currentSource = null
            this.playSingleId = -1
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
        this.playBGM(this.scenarioData.firstBgm, () => {
          this.playSoundList(talk, idx, false)
        })
      } else if (!talk[idx].talkData.voices[0]) this.playSoundList(talk, idx += 1)
      else {
        this.isPlaying = true
        this.isShowCurr = true
        this.playSound(talk[idx].talkData.voices[0].voicePath, () => {
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
