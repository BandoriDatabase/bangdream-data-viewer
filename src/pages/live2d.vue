<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6 col-lg-4 col-xl-3 relative-position">
        <q-select :label="$t('common.character')" v-model="selectedChara" :options="charaOptions" @input="fetchCharaCostumes">
          <template v-slot:selected-item="scope">
            {{ scope.opt.label }}
          </template>
        </q-select>
        <q-inner-loading :showing="!charaOptions.length">
          <q-spinner-dots size="30px" color="pink-6"></q-spinner-dots>
        </q-inner-loading>
      </div>
      <div class="col-12 col-md-6 col-lg-4 col-xl-3 relative-position">
        <q-select :label="$t('live2d.costume')" v-model="selectedCostume" :options="costumeOptions" :disable="!selectedChara"
          @input="fetchLive2dModel">
          <template v-slot:selected-item="scope">
            {{ scope.opt.label }}
          </template>
        </q-select>
        <q-inner-loading :showing="selectedChara && !costumeOptions.length">
          <q-spinner-dots size="30px" color="pink-6"></q-spinner-dots>
        </q-inner-loading>
      </div>
      <div class="col-12 col-md-6 col-lg-4 col-xl-3 relative-position">
        <q-select :label="$t('live2d.voice')" v-model="selectedVoice" :options="voiceOptions"
          :disable="!selectedChara || !selectedCostume">
          <template v-slot:selected-item="scope">
            {{ scope.opt.label }}
          </template>
        </q-select>
        <q-inner-loading :showing="selectedChara && selectedCostume && !voiceOptions.length">
          <q-spinner-dots size="30px" color="pink-6"></q-spinner-dots>
        </q-inner-loading>
      </div>
      <div class="col-12 col-md-6 col-lg-4 col-xl-3">
        <q-btn @click="showLive2d" :disable="!selectedChara || !selectedCostume || !voiceOptions.length">{{$t('live2d.show')}}</q-btn>
        <q-btn @click="showHelp">{{$t('live2d.how-to-use')}}</q-btn>
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6" v-if="selectedCostume">
        <q-card>
          <q-card-section>
            <p>{{$t('live2d.costume-name')}} {{costumeMap[server][selectedChara.value].find(elem => elem.costumeId === selectedCostume.value).description}}</p>
            <p>{{$t('live2d.costume-how-to-get')}} {{costumeMap[server][selectedChara.value].find(elem => elem.costumeId === selectedCostume.value).howToGet}}</p>
            <p>{{$t('live2d.costume-avaliable-from')}} {{(new Date(Number(costumeMap[server][selectedChara.value].find(elem => elem.costumeId === selectedCostume.value).publishedAt))).toLocaleString()}}</p>
          </q-card-section>
          <q-card-actions>
            <q-btn v-if="costumeMap[server][selectedChara.value].find(elem => elem.costumeId === selectedCostume.value).cardId" flat :label="$t('live2d.jump-to-card-detail')"
              @click="$router.push({name: 'cardDetail', params: {server: $route.params.server, cardId: costumeMap[server][selectedChara.value].find(elem => elem.costumeId === selectedCostume.value).cardId, isTrained: 0}})"></q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 col-md-6" v-if="selectedVoice">
        <q-card>
          <q-card-section>
            <p>{{$t('live2d.voice-appear')}} <span style="text-transform: capitalize">{{selectedVoice.value.live2dCategory.replace(/_/g, ' ')}}</span></p>
            <p>{{$t('live2d.voice-type')}} <span style="text-transform: capitalize">{{selectedVoice.value.scenarioType.replace(/_/g, ' ')}}</span></p>
            <p>{{$t('live2d.voice-motion')}} {{selectedVoice.value.motion}}</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center">
      <q-linear-progress indeterminate v-if="modelLoading" color="pink-6"></q-linear-progress>
      <canvas ref="viewer"></canvas>
    </div>
  </q-page>
</template>

<script>
import { Dialog } from 'quasar'
import { mapState, mapActions } from 'vuex'
import BufferLoader from '../boot/bufferLoader'

export default {
  // name: 'PageName',
  data () {
    return {
      isReady: false,
      selectedChara: null,
      selectedCostume: null,
      selectedVoice: null,
      charaOptions: [],
      costumeOptions: [],
      voiceOptions: [],
      AudioContext: window.AudioContext || window.webkitAudioContext || false,
      lipSyncValue: 0,
      voicePlaying: false,
      modelLoading: false
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
      'costumeMap',
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
      'getCharaLive2d',
      'setForceReload'
    ]),
    ...mapActions('chara', [
      'getBandCharaList'
    ]),
    async updateData (server) {
      this.isReady = false
      this.selectedChara = null
      this.selectedCostume = null
      this.selectedVoice = null
      const bandCharaList = await this.getBandCharaList(server)
      this.charaOptions = bandCharaList.map(elem => ({
        label: elem.characterName,
        value: elem.characterId
      }))
      const { costumeId } = this.$route.params
      if (costumeId) {
        const costume = await this.$api.getCostumeById(server, costumeId)
        this.selectedChara = this.charaOptions.find(elem => elem.value === costume.characterId)
        await this.fetchCharaCostumes()
        this.selectedCostume = this.costumeOptions.find(elem => elem.value === Number(costumeId))
        await this.fetchLive2dModel()
      }
      this.isReady = true
    },
    async fetchCharaCostumes () {
      this.selectedCostume = null
      this.selectedVoice = null
      this.voiceOptions = []
      console.log('start fetch')
      await this.getCharaLive2d({ server: this.server, charaId: this.selectedChara.value })
      this.costumeOptions = this.costumeMap[this.server][this.selectedChara.value].map(elem => ({
        label: elem.description,
        value: elem.costumeId
      }))
    },
    async fetchLive2dModel () {
      this.voiceOptions = []
      this.model = await this.$api.getLive2dModel(this.server, this.selectedCostume.value)
      this.voiceOptions = this.voiceMap[this.server][this.selectedChara.value].map(elem => ({
        label: elem.serif,
        value: elem
      }))
    },
    showLive2d () {
      this.modelLoading = true
      if (!this.app) {
        this.app = new PIXI.Application(400, 600, {
          view: this.$refs.viewer,
          transparent: true
        })
        this.app.renderer.plugins.interaction.autoPreventDefault = false
        this.app.renderer.view.style.touchAction = 'auto'
        this.setForceReload()

        this.app.view.addEventListener('click', (e) => {
          if (!this.selectedVoice || this.voicePlaying) return
          this.live2dSprite.startRandomMotionOnce(this.selectedVoice.value.motion)
          this.live2dSprite.playSound(`assets/sound/voice/system/chara${this.selectedVoice.value.characterId}_rip/${this.selectedVoice.value.voice}.mp3`)
        })

        this.app.view.addEventListener('touchend', (e) => {
          if (!this.selectedVoice || this.voicePlaying) return
          this.live2dSprite.startRandomMotionOnce(this.selectedVoice.value.motion)
          this.live2dSprite.playSound(`assets/sound/voice/system/chara${this.selectedVoice.value.characterId}_rip/${this.selectedVoice.value.voice}.mp3`)
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
      this.live2dSprite.onModelReady.push(() => {
        this.modelLoading = false
      })

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
