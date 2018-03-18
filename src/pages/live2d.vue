<template>
  <q-page padding>
    <div class="row gutter-sm">
      <div class="col-12 col-md-6 col-lg-4 col-xl-3 relative-position">
        <q-select :float-label="$t('common.character')" v-model="selectedChara" :options="charaOptions" @input="fetchCostumAndVoice"></q-select>
        <q-inner-loading :visible="!charaOptions.length">
          <q-spinner-dots size="30px" color="pink-6"></q-spinner-dots>
        </q-inner-loading>
      </div>
      <div class="col-12 col-md-6 col-lg-4 col-xl-3 relative-position">
        <q-select :float-label="$t('live2d.costum')" v-model="selectedCostum" :options="costumOptions" :disable="!selectedChara"
          @input="fetchLive2dModel"></q-select>
        <q-inner-loading :visible="selectedChara && !costumOptions.length">
          <q-spinner-dots size="30px" color="pink-6"></q-spinner-dots>
        </q-inner-loading>
      </div>
      <div class="col-12 col-md-6 col-lg-4 col-xl-3 relative-position">
        <q-select :float-label="$t('live2d.voice')" v-model="selectedVoice" :options="voiceOptions" :disable="!selectedChara || !selectedCostum"></q-select>
        <q-inner-loading :visible="selectedChara && selectedCostum && !voiceOptions.length">
          <q-spinner-dots size="30px" color="pink-6"></q-spinner-dots>
        </q-inner-loading>
      </div>
      <div class="col-12 col-md-6 col-lg-4 col-xl-3">
        <q-btn @click="showLive2d" :disable="!selectedChara || !selectedCostum || !voiceOptions.length">{{$t('live2d.show')}}</q-btn>
        <q-btn @click="showHelp">{{$t('live2d.how-to-use')}}</q-btn>
      </div>
    </div>
    <div class="row gutter-sm">
      <div class="col-12 col-md-6" v-if="selectedCostum">
        <q-card>
          <q-card-main>
            <p>{{$t('live2d.costum-name')}} {{selectedCostum.description}}</p>
            <p>{{$t('live2d.costum-how-to-get')}} {{selectedCostum.howToGet}}</p>
            <p>{{$t('live2d.costum-avaliable-from')}} {{(new Date(Number(selectedCostum.publishedAt))).toLocaleString()}}</p>
          </q-card-main>
        </q-card>
      </div>
      <div class="col-12 col-md-6" v-if="selectedVoice">
        <q-card>
          <q-card-main>
            <p>{{$t('live2d.voice-appear')}} <span style="text-transform: capitalize">{{selectedVoice.live2dCategory.replace(/_/g, ' ')}}</span></p>
            <p>{{$t('live2d.voice-type')}} <span style="text-transform: capitalize">{{selectedVoice.scenarioType.replace(/_/g, ' ')}}</span></p>
            <p>{{$t('live2d.voice-motion')}} {{selectedVoice.motion}}</p>
          </q-card-main>
        </q-card>
      </div>
    </div>
    <div class="row justify-center">
      <canvas ref="viewer"></canvas>
    </div>
  </q-page>
</template>

<script>
import { Dialog } from 'quasar'
import { mapState, mapActions } from 'vuex'
import BufferLoader from '../plugins/bufferLoader'

export default {
  // name: 'PageName',
  data () {
    return {
      isReady: false,
      selectedChara: null,
      selectedCostum: null,
      selectedVoice: null,
      charaOptions: [],
      costumOptions: [],
      voiceOptions: [],
      AudioContext: window.AudioContext || window.webkitAudioContext || false,
      lipSyncValue: 0,
      voicePlaying: false
    }
  },
  mounted () {
    const { AudioContext } = this
    if (!AudioContext) return
    if (this.forceReload) window.location.reload()
    this.audioContext = new AudioContext()
    this.updateData(this.server)
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
  methods: {
    ...mapActions('live2d', [
      'getCharaLive2d'
    ]),
    ...mapActions('chara', [
      'getBandCharaList'
    ]),
    async updateData (server) {
      this.isReady = false
      this.selectedChara = null
      this.selectedCostum = null
      this.selectedVoice = null
      const bandCharaList = await this.getBandCharaList(server)
      this.charaOptions = bandCharaList.map(elem => ({
        label: elem.characterName,
        value: elem.characterId
      }))
      this.isReady = true
    },
    async fetchCostumAndVoice () {
      this.selectedCostum = null
      this.selectedVoice = null
      this.voiceOptions = []
      console.log('start fetch')
      await this.getCharaLive2d({server: this.server, charaId: this.selectedChara})
      this.costumOptions = this.costumMap[this.server][this.selectedChara].map(elem => ({
        label: elem.description,
        value: elem
      }))
    },
    async fetchLive2dModel () {
      this.voiceOptions = []
      this.model = await this.$api.getLive2dModel(this.server, this.selectedCostum.costumeId)
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
                } else {
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
        title: this.$t('live2d.dialog-how-to-use.title'),
        message: this.$t('live2d.dialog-how-to-use.msg')
      })
    }
  },
  beforeDestroy () {
    if (this.app) this.app.destroy()
    this.audioContext.close()
    // this.stage.destory()
    // this.renderer.destroy()
    // Object.keys(PIXI.utils.TextureCache).forEach((texture) => { PIXI.utils.TextureCache[texture].destroy(true) })
  },
  beforeRouteUpdate (to, from, next) {
    this.updateData(to.params.server)
    next()
  }
}
</script>

<style>
</style>
