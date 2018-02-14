<template>
  <div>
    <div class="row sm-gutter">
      <div class="col-12 col-md-6 col-lg-4 col-xl-3 relative-position">
        <q-select :float-label="$t('chara')" v-model="selectedChara" :options="charaOptions" @change="fetchCostumAndVoice"></q-select>
        <q-inner-loading :visible="!charaOptions.length">
          <q-spinner-dots size="30px" color="pink-6"></q-spinner-dots>
        </q-inner-loading>
      </div>
      <div class="col-12 col-md-6 col-lg-4 col-xl-3 relative-position">
        <q-select :float-label="$t('costum')" v-model="selectedCostum" :options="costumOptions" :disable="!selectedChara"
          @change="fetchLive2dModel"></q-select>
        <q-inner-loading :visible="selectedChara && !costumOptions.length">
          <q-spinner-dots size="30px" color="pink-6"></q-spinner-dots>
        </q-inner-loading>
      </div>
      <div class="col-12 col-md-6 col-lg-4 col-xl-3 relative-position">
        <q-select :float-label="$t('voice')" v-model="selectedVoice" :options="voiceOptions" :disable="!selectedChara || !selectedCostum"></q-select>
        <q-inner-loading :visible="selectedChara && selectedCostum && !voiceOptions.length">
          <q-spinner-dots size="30px" color="pink-6"></q-spinner-dots>
        </q-inner-loading>
      </div>
      <div class="col-12 col-md-6 col-lg-4 col-xl-3">
        <q-btn @click="showLive2d" :disable="!selectedChara || !selectedCostum || !voiceOptions.length">{{$t('show')}}</q-btn>
        <q-btn @click="showHelp">{{$t('how-to-use')}}</q-btn>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-6" v-if="selectedCostum">
        <q-card>
          <q-card-main>
            <p>{{$t('costum-name')}} {{selectedCostum.description}}</p>
            <p>{{$t('costum-how-to-get')}} {{selectedCostum.howToGet}}</p>
            <p>{{$t('costum-avaliable-from')}} {{(new Date(Number(selectedCostum.publishedAt))).toLocaleString()}}</p>
          </q-card-main>
        </q-card>
      </div>
      <div class="col-12 col-md-6" v-if="selectedVoice">
        <q-card>
          <q-card-main>
            <p>{{$t('voice-appear')}} <span style="text-transform: capitalize">{{selectedVoice.live2dCategory.replace(/_/g, ' ')}}</span></p>
            <p>{{$t('voice-type')}} <span style="text-transform: capitalize">{{selectedVoice.scenarioType.replace(/_/g, ' ')}}</span></p>
            <p>{{$t('voice-motion')}} {{selectedVoice.motion}}</p>
          </q-card-main>
        </q-card>
      </div>
    </div>
    <div class="row justify-center">
      <canvas ref="viewer"></canvas>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "chara": "Character",
    "costum": "Costum",
    "voice": "Voice",
    "show": "Show",
    "how-to-use": "How to use",
    "costum-name": "Costum name:",
    "costum-how-to-get": "How to get:",
    "costum-avaliable-from": "Avaliable from:",
    "voice-appear": "Voice appearance:",
    "voice-type": "Voice type:",
    "voice-motion": "Live2D motion:",
    "dialog-how-to-use": {
      "title": "How to use",
      "msg": "At first choose a Character, then a costum, you can click SHOW button now to load live2d model.<br>Select one of the voice and touch/click the live2d model, it will respond to you."
    }
  },
  "zh-cn": {
    "chara": "角色",
    "costum": "服装",
    "voice": "语音",
    "show": "显示",
    "how-to-use": "如何使用",
    "costum-name": "服装名称：",
    "costum-how-to-get": "获得方式：",
    "costum-avaliable-from": "从该时间起可见：",
    "voice-appear": "语音出现场所：",
    "voice-type": "语音类别：",
    "voice-motion": "Live2D动作：",
    "dialog-how-to-use": {
      "title": "如何使用",
      "msg": "首先选择角色，再选择服装，就可以点击“显示”按钮展示Live2D模型了（需要加载）。<br>选择一个语音再点击/触摸Live2D模型，就会播放语音并附带动作。"
    }
  },
  "zh-tw": {
    "chara": "角色",
    "costum": "服裝",
    "voice": "語音",
    "show": "顯示",
    "how-to-use": "如何使用",
    "costum-name": "服裝名稱：",
    "costum-how-to-get": "獲得方式：",
    "costum-avaliable-from": "從該時間起可見：",
    "voice-appear": "語音出現場所：",
    "voice-type": "語音類別：",
    "voice-motion": "Live2D動作：",
    "dialog-how-to-use": {
      "title": "如何使用",
      "msg": "首先選擇角色，再選擇服裝，就可以點擊“顯示”按鈕展示Live2D模型了（需要加載）。<br>選擇壹個語音再點擊/觸摸Live2D模型，就會播放語音並附帶動作。"
    }
  }
}
</i18n>

<script>
/* global PIXI */
import {
  QSelect,
  QSpinnerDots,
  QInnerLoading,
  QBtn,
  QCard,
  QCardMain,
  Dialog
} from 'quasar'
import { mapState, mapActions } from 'vuex'
import apiDBInfo from 'api/dbinfo'
import BufferLoader from 'assets/bufferLoader'

export default {
  name: 'Live2DPage',
  data () {
    return {
      isReady: false,
      selectedChara: null,
      selectedCostum: null,
      selectedVoice: null,
      charaOptions: [],
      costumOptions: [],
      voiceOptions: [],
      audioContext: new AudioContext(),
      lipSyncValue: 0,
      voicePlaying: false
    }
  },
  components: {
    QSelect,
    QSpinnerDots,
    QInnerLoading,
    QBtn,
    QCard,
    QCardMain
  },
  async mounted () {
    if (this.forceReload) window.location.reload()
    await this.initData()
    this.isReady = true
  },
  computed: {
    ...mapState('live2d', [
      'voiceMap',
      'costumMap',
      'forceReload'
    ]),
    ...mapState('chara', [
      'bandCharaList'
    ]),
    server () {
      return this.$route.params.server
    }
  },
  watch: {
    '$route.params.server': async function () {
      this.isReady = false
      await this.initData()
      this.isReady = true
    }
  },
  methods: {
    ...mapActions('live2d', [
      'getCharaLive2d'
    ]),
    ...mapActions('chara', [
      'getBandCharaList'
    ]),
    async initData () {
      const bandCharaList = await this.getBandCharaList(this.server)
      this.charaOptions = bandCharaList.map(elem => ({
        label: elem.characterName,
        value: elem.characterId
      }))
    },
    async fetchCostumAndVoice () {
      this.selectedCostum = null
      this.selectedVoice = null
      this.voiceOptions = []
      await this.getCharaLive2d({server: this.server, charaId: this.selectedChara})
      this.costumOptions = this.costumMap[this.server][this.selectedChara].map(elem => ({
        label: elem.description,
        value: elem
      }))
    },
    async fetchLive2dModel () {
      this.voiceOptions = []
      this.model = await apiDBInfo.getLive2dModel(this.server, this.selectedCostum.costumeId)
      this.voiceOptions = this.voiceMap[this.server][this.selectedChara].map(elem => ({
        label: elem.serif,
        value: elem
      }))
    },
    showLive2d () {
      if (!this.app) {
        this.app = new PIXI.Application(400, 600, {
          view: this.$refs.viewer,
          transparent: true
        })

        this.app.view.addEventListener('click', (e) => {
          if (!this.selectedVoice || this.voicePlaying) return
          this.live2dSprite.startRandomMotionOnce(this.selectedVoice.motion)
          this.live2dSprite.playSound(`assets/sound/voice/system/${this.selectedVoice.voice}.mp3`)
        })

        this.app.view.addEventListener('touchend', (e) => {
          if (!this.selectedVoice || this.voicePlaying) return
          this.live2dSprite.startRandomMotionOnce(this.selectedVoice.motion)
          this.live2dSprite.playSound(`assets/sound/voice/system/${this.selectedVoice.voice}.mp3`)
          this.voicePlaying = true
        })
      }
      // remove all old data
      while (this.app.stage.children[0]) {
        this.app.stage.removeChildAt(0)
      }

      this.live2dSprite = new PIXI.Live2DSprite(this.model, {
        audioPlayer: (filename, rootPath) => {
          const buf = new BufferLoader(
            this.audioContext,
            [
              `${rootPath}${filename}`
            ],
            () => {
              const source = this.audioContext.createBufferSource()
              source.buffer = buf.bufferList[0]

              const analyser = this.audioContext.createAnalyser()
              analyser.fftSize = 32
              var bufferLength = analyser.frequencyBinCount
              let cache = []
              let lastTime = Date.now()
              const intervalId = setInterval(() => {
                const dataArray = new Uint8Array(bufferLength)
                analyser.getByteFrequencyData(dataArray)
                const value = (dataArray[9] + dataArray[10] + dataArray[11]) / 3
                if (Date.now() - lastTime < 33) {
                  cache.push(value)
                }
                else {
                  const lipValue = cache.length
                    ? (cache.reduce((previous, current) => {
                      current += previous
                      return current
                    }) / cache.length / 100)
                    : this.lipSyncValue
                  this.lipSyncValue = lipValue || this.lipSyncValue
                  this.live2dSprite.setLipSync(this.lipSyncValue)
                  lastTime = Date.now()
                  cache = []
                }
              }, 10)
              source.addEventListener('ended', () => {
                console.log('ended')
                clearInterval(intervalId)
                this.live2dSprite.setLipSync(0)
                this.live2dSprite.startRandomMotionOnce('idle01')
                this.voicePlaying = false
              })
              const gain = this.audioContext.createGain()
              gain.gain.value = 0.5

              source.connect(analyser)
              gain.connect(this.audioContext.destination)
              analyser.connect(gain)
              source.start(this.audioContext.currentTime)
            }
          )

          buf.load()
        }
      })

      this.live2dSprite.adjustScale(0, 0, 0.7)
      this.live2dSprite.adjustTranslate(0, -0.2)
      this.live2dSprite.startRandomMotionOnce('idle01')

      this.app.stage.addChild(this.live2dSprite)

      this.live2dSprite.on('mousemove', (evt) => {
        const point = evt.data.global
        this.live2dSprite.setViewPoint(point.x, point.y)
      })

      this.app.ticker.add(this.tickerFunc)
    },
    tickerFunc () {
      this.app.render()
    },
    showHelp () {
      Dialog.create({
        title: this.$t('dialog-how-to-use.title'),
        message: this.$t('dialog-how-to-use.msg')
      })
    }
  },
  beforeDestroy () {
    if (this.app) this.app.destroy()
    this.audioContext.close()
    // this.stage.destory()
    // this.renderer.destroy()
    // Object.keys(PIXI.utils.TextureCache).forEach((texture) => { PIXI.utils.TextureCache[texture].destroy(true) })
  }
}
</script>
