<template>
  <q-page padding>
    <p class="quote" v-html="$t('music.declaration')"></p>
    <div v-if="isReady">
      <div class="row">
        <div class="col-lg-6 col-xs-12">
          <q-progress indeterminate v-if="audioDisable" />
          <div class="row gutter justify-center items-center">
            <q-btn class="col-3" @click="startRhythm(), $ga.event('music-score', 'start', 'view')" :disable="(audioDisable) || (audioStarted && !audioPaused)">Start</q-btn>
            <q-btn class="col-3" @click="pauseRhythm(), $ga.event('music-score', 'pause', 'view')" :disable="!audioStarted">Pause</q-btn>
            <q-btn class="col-3" @click="stopRhythm(), $ga.event('music-score', 'stop', 'view')" :disable="!audioStarted">Stop</q-btn>
            <q-select class="col-3" label="Difficulty" v-model="difficulty" :options="difficultyOptions">
              <template v-slot:selected-item="scope">
                {{ scope.opt.label }}
              </template>
            </q-select>
          </div>
          <canvas ref="game"></canvas>
        </div>
        <div class="col-lg-6 col-xs-12">
          <div
            class="jacket-img relative-position"
          >
            <img class="absolute-center" :src="data.jacket" />
          </div>
          <h4>{{data.title}}</h4>
          <q-btn @click="$router.push(`/music/${server}/${data.musicId}`)">{{$t('music.back-detail')}}</q-btn>
          <p>{{$t('music.composer')}}: {{data.composer}}</p>
          <p>{{$t('music.lyricist')}}: {{data.lyricist}}</p>
          <p>{{$t('music.arranger')}}: {{data.arranger}}</p>
          <p>{{$t('common.band')}}:
            <span v-if="Number(data.bandId) > 5">{{data.bandName}}</span>
            <img height="60px" width="100px" v-if="Number(data.bandId) <= 5" v-lazy="`/assets/band/logo/00${data.bandId}_rip/logoL.png`">
          </p>
          <p>{{$t('music.combo')}}: {{data.combo}}</p>
        </div>
      </div>
    </div>
    <q-spinner v-else color="pink" size="48px"></q-spinner>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BufferLoader from '../boot/bufferLoader'

export default {
  // name: 'PageName',
  data () {
    return {
      difficulty: 'expert',
      audioDisable: true,
      audioStarted: false,
      audioPaused: false,
      AudioContext: window.AudioContext || window.webkitAudioContext || false,
      noteStartPoint: [
        {
          x: 50,
          y: 50
        }, {
          x: 120,
          y: 50
        }, {
          x: 190,
          y: 50
        }, {
          x: 260,
          y: 50
        }, {
          x: 330,
          y: 50
        }, {
          x: 400,
          y: 50
        }, {
          x: 470,
          y: 50
        }
      ],
      noteEndPoint: [
        {
          x: 50,
          y: 750
        }, {
          x: 120,
          y: 750
        }, {
          x: 190,
          y: 750
        }, {
          x: 260,
          y: 750
        }, {
          x: 330,
          y: 750
        }, {
          x: 400,
          y: 750
        }, {
          x: 470,
          y: 750
        }
      ],
      currentNotes: [[], [], [], [], [], [], []],
      typeNoteMap: {
        Single: 'statics/gameres/note_normal_3.png',
        Flick: 'statics/gameres/note_flick_3.png',
        FeverFlick: 'statics/gameres/note_flick_3.png',
        LongStart: 'statics/gameres/note_long_3.png',
        LongEnd: 'statics/gameres/note_long_3.png',
        SlideStart_A: 'statics/gameres/note_long_3.png',
        SlideStart_B: 'statics/gameres/note_long_3.png',
        Slide_A: 'statics/gameres/note_slide_among.png',
        Slide_B: 'statics/gameres/note_slide_among.png',
        SlideEnd_A: 'statics/gameres/note_long_3.png',
        SlideEnd_B: 'statics/gameres/note_long_3.png',
        SlideEndFlick_A: 'statics/gameres/note_flick_3.png',
        SlideEndFlick_B: 'statics/gameres/note_flick_3.png',
        Skill: 'statics/gameres/note_skill_3.png',
        LongLine: 'statics/gameres/longNoteLine.png'
      },
      containerNotes: [[], [], [], [], [], [], []],
      laneContainers: [null, null, null, null, null, null, null],
      longGroups: [],
      specialNotes: [],
      isReady: false,
      data: {},
      leftLaneBase: 10,
      currBaseTime: 0,
      difficultyOptions: [
        {
          label: 'Special (0)',
          value: 'special'
        },
        {
          label: 'Expert (0)',
          value: 'expert'
        },
        {
          label: 'Hard (0)',
          value: 'hard'
        },
        {
          label: 'Normal (0)',
          value: 'normal'
        },
        {
          label: 'Easy (0)',
          value: 'easy'
        }
      ],
      noteArr: [],
      timing: 0,
      comboText: null,
      combo: 0,
      BPMText: null,
      BPM: 0
    }
  },
  async mounted () {
    const { AudioContext } = this
    this.server = this.$route.params.server
    if (!AudioContext) return
    this.audioContext = new AudioContext()
    await this.getMusicById({ musicId: this.$route.params.musicId, server: this.server })
    this.data = this.musicMap[this.server][this.$route.params.musicId]
    this.isReady = true
    this.difficultyOptions = [
      {
        label: `Expert (${this.data.difficulty[1].level})`,
        value: 'expert'
      },
      {
        label: `Hard (${this.data.difficulty[2].level})`,
        value: 'hard'
      },
      {
        label: `Normal (${this.data.difficulty[3].level})`,
        value: 'normal'
      },
      {
        label: `Easy (${this.data.difficulty[0].level})`,
        value: 'easy'
      }
    ]
    if (this.data.difficulty[4]) {
      this.difficultyOptions.unshift({
        label: `Special (${this.data.difficulty[4].level})`,
        value: 'special'
      })
    }
    this.difficulty = this.difficultyOptions[0]

    this.loadRes()
  },
  computed: {
    ...mapState('music', [
      'musicMap'
    ])
  },
  destroyed () {
    this.audioContext.close()
  },
  methods: {
    ...mapActions('music', [
      'getMusicById'
    ]),
    renderStage () {
      const bg = new PIXI.Graphics()
      bg.lineStyle(2, 0x686868)
        .moveTo(this.leftLaneBase, 0).lineTo(this.leftLaneBase, 750)
        .moveTo(this.leftLaneBase + 70, 0).lineTo(this.leftLaneBase + 70, 750)
        .moveTo(this.leftLaneBase + 70 * 2, 0).lineTo(this.leftLaneBase + 70 * 2, 750)
        .moveTo(this.leftLaneBase + 70 * 3, 0).lineTo(this.leftLaneBase + 70 * 3, 750)
        .moveTo(this.leftLaneBase + 70 * 4, 0).lineTo(this.leftLaneBase + 70 * 4, 750)
        .moveTo(this.leftLaneBase + 70 * 5, 0).lineTo(this.leftLaneBase + 70 * 5, 750)
        .moveTo(this.leftLaneBase + 70 * 6, 0).lineTo(this.leftLaneBase + 70 * 6, 750)
        .moveTo(this.leftLaneBase + 70 * 7, 0).lineTo(this.leftLaneBase + 70 * 7, 750)
        .moveTo(0, 750).lineTo(600, 750)
      this.app.stage.addChild(bg)

      this.laneContainers[0] = new PIXI.Container()
      this.laneContainers[0].x = this.leftLaneBase
      this.laneContainers[0].width = 70
      this.laneContainers[0].height = 750
      this.app.stage.addChild(this.laneContainers[0])

      this.laneContainers[1] = new PIXI.Container()
      this.laneContainers[1].x = this.leftLaneBase + 70
      this.laneContainers[1].width = 70
      this.laneContainers[1].height = 750
      this.app.stage.addChild(this.laneContainers[1])

      this.laneContainers[2] = new PIXI.Container()
      this.laneContainers[2].x = this.leftLaneBase + 70 * 2
      this.laneContainers[2].width = 70
      this.laneContainers[2].height = 750
      this.app.stage.addChild(this.laneContainers[2])

      this.laneContainers[3] = new PIXI.Container()
      this.laneContainers[3].x = this.leftLaneBase + 70 * 3
      this.laneContainers[3].width = 70
      this.laneContainers[3].height = 750
      this.app.stage.addChild(this.laneContainers[3])

      this.laneContainers[4] = new PIXI.Container()
      this.laneContainers[4].x = this.leftLaneBase + 70 * 4
      this.laneContainers[4].width = 70
      this.laneContainers[4].height = 750
      this.app.stage.addChild(this.laneContainers[4])

      this.laneContainers[5] = new PIXI.Container()
      this.laneContainers[5].x = this.leftLaneBase + 70 * 5
      this.laneContainers[5].width = 70
      this.laneContainers[5].height = 750
      this.app.stage.addChild(this.laneContainers[5])

      this.laneContainers[6] = new PIXI.Container()
      this.laneContainers[6].x = this.leftLaneBase + 70 * 6
      this.laneContainers[6].width = 70
      this.laneContainers[6].height = 750
      this.app.stage.addChild(this.laneContainers[6])

      this.slideContainer = new PIXI.Container()
      this.slideContainer.x = this.leftLaneBase
      this.slideContainer.width = 70 * 7
      this.slideContainer.height = 750
      this.app.stage.addChild(this.slideContainer)

      this.specialContainer = new PIXI.Container()
      this.specialContainer.x = this.leftLaneBase
      this.specialContainer.width = 70 * 7
      this.specialContainer.height = 750
      this.app.stage.addChild(this.specialContainer)

      const blackMask = new PIXI.Graphics()
      blackMask.beginFill(0xfff, 1)
      blackMask.drawRect(0, 0, 510, 750)
      this.app.stage.mask = blackMask

      this.comboText = new PIXI.Text('Combo: 0', { fontSize: 21, fill: 'white', align: 'center' })
      this.comboText.x = 210
      this.comboText.y = 200
      this.app.stage.addChild(this.comboText)

      this.BPMText = new PIXI.Text('BPM: 0', { fontSize: 15, fill: 'white' })
      this.BPMText.x = 400
      this.BPMText.y = 30
      this.app.stage.addChild(this.BPMText)

      this.app.renderer.render(this.app.stage)
    },
    playSound (buffer, time) {
      // console.log(time, this.audioContext.currentTime)
      const source = this.audioContext.createBufferSource()
      source.buffer = buffer
      source.connect(this.audioContext.destination)
      source.start(time)
    },
    loadRes () {
      this.bufferLoader = new BufferLoader(
        this.audioContext,
        [
          this.data.bgmFile,
          '/statics/hihat.wav',
          '/statics/flick.mp3'
        ],
        () => { this.audioDisable = false }
      )

      this.bufferLoader.load()
    },
    startRhythm () {
      if (!this.app) {
        if (Object.keys(PIXI.loader.resources).length) {
          this.app = new PIXI.Application(510, 800, {
            view: this.$refs.game
          })
          this.app.renderer.plugins.interaction.autoPreventDefault = false
          this.app.renderer.view.style.touchAction = 'auto'
          this.renderStage()
        } else {
          PIXI.loader.add([
            'statics/gameres/note_normal_3.png',
            'statics/gameres/note_flick_3.png',
            'statics/gameres/note_long_3.png',
            'statics/gameres/note_skill_3.png',
            'statics/gameres/note_slide_among.png',
            'statics/gameres/longNoteLine.png'
          ]).load(this.startRhythm)
          return
        }
      }
      this.BPM = 0
      if (this.audioPaused) {
        this.audioContext.resume()
        this.audioPaused = false
        return
      }
      this.$http.get(`/api/v1/jp/music/chart/${this.$route.params.musicId}/${this.difficulty.value}`)
        .then(res => res.json())
        .then(res => {
          const { metadata, objects } = res
          const baseTime = this.audioContext.currentTime + 0.1
          this.data.combo = metadata.combo
          objects.forEach(note => {
            if (note.effect.indexOf('.wav') !== -1) {
              this.playSound(this.bufferLoader.bufferList[0], baseTime + note.timing)
            } else {
              if (note.effect.indexOf('Flick') !== -1) this.playSound(this.bufferLoader.bufferList[2], baseTime + note.timing)
              else if (note.type !== 'System') this.playSound(this.bufferLoader.bufferList[1], baseTime + note.timing)
            }
          })

          this.BPM = metadata.bpm
          this.BPMText.text = `BPM: ${this.BPM}`
          this.combo = 0
          this.comboText.text = `Combo: ${this.combo}`

          this.noteArr = objects
          // prepare note lane data
          const noteLaneArr = [
            objects.filter(note => note.lane === 1 && note.type === 'Object'),
            objects.filter(note => note.lane === 2 && note.type === 'Object'),
            objects.filter(note => note.lane === 3 && note.type === 'Object'),
            objects.filter(note => note.lane === 4 && note.type === 'Object'),
            objects.filter(note => note.lane === 5 && note.type === 'Object'),
            objects.filter(note => note.lane === 6 && note.type === 'Object'),
            objects.filter(note => note.lane === 7 && note.type === 'Object')
          ]
          this.currBaseTime = baseTime
          this.tickerFunc = this.drawNotes.bind(this, noteLaneArr, this.bufferLoader.bufferList[0].duration)
          this.app.ticker.add(this.tickerFunc)

          this.audioStarted = true
        })
    },
    drawNotes (noteLaneArr, maxLength) {
      if (this.audioPaused) return
      this.timing = this.audioContext.currentTime - this.currBaseTime
      // draw notes on lane
      this.drawLaneNotes(noteLaneArr[0], this.laneContainers[0], this.currBaseTime, 0)
      this.drawLaneNotes(noteLaneArr[1], this.laneContainers[1], this.currBaseTime, 1)
      this.drawLaneNotes(noteLaneArr[2], this.laneContainers[2], this.currBaseTime, 2)
      this.drawLaneNotes(noteLaneArr[3], this.laneContainers[3], this.currBaseTime, 3)
      this.drawLaneNotes(noteLaneArr[4], this.laneContainers[4], this.currBaseTime, 4)
      this.drawLaneNotes(noteLaneArr[5], this.laneContainers[5], this.currBaseTime, 5)
      this.drawLaneNotes(noteLaneArr[6], this.laneContainers[6], this.currBaseTime, 6)

      // draw long and slide
      this.drawLongNotes(this.noteArr, this.slideContainer, this.currBaseTime)
      this.drawSpecialNotes(this.noteArr.filter(note => note.property === 'Special'), this.specialContainer, this.currBaseTime)

      if (this.audioContext.currentTime - this.currBaseTime > maxLength) {
        this.stopRhythm()
      }
    },
    drawLaneNotes (noteArr, container, baseTime, laneIndex) {
      const comingNotes = noteArr.filter(note => {
        const noteTime = note.timing - (this.audioContext.currentTime - baseTime)
        return (noteTime > 0 && noteTime < 0.7)
      })

      // check new notes
      if (!this.currentNotes[laneIndex].length && comingNotes.length) {
        // all new, put them
        comingNotes.forEach(note => {
          container.addChild(this.drawNewNote(note))

          this.containerNotes[laneIndex].push(note)
        })

        this.currentNotes[laneIndex] = comingNotes
        // console.log(comingNotes, this.currentNotes, this.containerNotes, laneIndex)
      } else if (!comingNotes.length) {
        // all old, remove them
        this.currentNotes[laneIndex].forEach(() => {
          container.removeChildAt(0)
          this.containerNotes[laneIndex].splice(0, 1)
        })
        this.combo += this.currentNotes[laneIndex].length
        this.comboText.text = `Combo: ${this.combo}`
        this.currentNotes[laneIndex] = []
      } else {
        // check if next notes and current notes are matched
        const nextFirstNote = comingNotes[0]
        const nextFirstNoteOldIndex = this.currentNotes[laneIndex].findIndex(note => note.beat === nextFirstNote.beat)
        if (!nextFirstNoteOldIndex) {
          // fist note matches, check if more notes appeared
          if (comingNotes.length !== this.currentNotes[laneIndex].length) {
            // not matched, then add it
            const newNotes = comingNotes.slice(this.currentNotes[laneIndex].length)
            // console.log('new', newNotes, comingNotes, this.currentNotes[laneIndex])
            newNotes.forEach(note => {
              container.addChild(this.drawNewNote(note))

              this.containerNotes[laneIndex].push(note)
            })
          }
        } else if (nextFirstNoteOldIndex === -1) {
          // a note appears when another disappears
          this.currentNotes[laneIndex].forEach(() => {
            container.removeChildAt(0)
            this.containerNotes[laneIndex].splice(0, 1)
          })
          this.combo += this.currentNotes[laneIndex].length
          this.comboText.text = `Combo: ${this.combo}`
          comingNotes.forEach(note => {
            container.addChild(this.drawNewNote(note))

            this.containerNotes[laneIndex].push(note)
          })
        } else {
          // first note not matches, then remove old notes
          const oldNotes = this.currentNotes[laneIndex].slice(0, nextFirstNoteOldIndex)
          // console.log('old', oldNotes)
          oldNotes.forEach(() => {
            container.removeChildAt(0)
            this.containerNotes[laneIndex].splice(0, 1)
          })
          this.combo += oldNotes.length
          this.comboText.text = `Combo: ${this.combo}`

          // check if new notes are there
          if (this.currentNotes[laneIndex].length - nextFirstNoteOldIndex !== comingNotes.length) {
            // got new notes
            const newNotes = comingNotes.slice(-(comingNotes.length - (this.currentNotes[laneIndex].length - nextFirstNoteOldIndex)))
            newNotes.forEach(note => {
              container.addChild(this.drawNewNote(note))

              this.containerNotes[laneIndex].push(note)
            })
          }
        }
        // console.log('tick')

        this.currentNotes[laneIndex] = comingNotes
      }

      // for debug: validity data
      if (JSON.stringify(this.currentNotes[laneIndex]) !== JSON.stringify(this.containerNotes[laneIndex])) {
        console.log(this.currentNotes[laneIndex], this.containerNotes[laneIndex], comingNotes, laneIndex)
        this.audioContext.close()
        this.app.ticker.remove(this.tickerFunc)
      }

      // update notes position
      this.currentNotes[laneIndex].forEach((note, idx) => {
        const drawNote = container.getChildAt(idx)
        const noteTime = note.timing - (this.audioContext.currentTime - baseTime)
        // const noteEndTime = note.endTiming - (this.audioContext.currentTime - baseTime)

        // let the note drop down for 0.7s
        drawNote.x = 0
        drawNote.y = 736 - 736 / 0.7 * noteTime
      })
    },
    drawLongNotes (noteArr, container, baseTime) {
      const comingNotes = noteArr.filter(note => {
        const noteTime = note.timing - (this.audioContext.currentTime - baseTime)
        return (noteTime > 0 && noteTime < 0.7)
      })

      // remove finished long and slide
      const removeGroup = this.longGroups.filter(longGroup => longGroup[longGroup.length - 1].timing < (this.audioContext.currentTime - baseTime))
      removeGroup.forEach(longGroup => {
        container.removeChildAt(this.longGroups.indexOf(longGroup))
        this.longGroups.splice(this.longGroups.indexOf(longGroup), 1)
      })

      // check for long and slide start note
      const longStartNotes = comingNotes.filter(note => note.property.indexOf('LongStart') !== -1 ||
        (note.property.indexOf('Slide') !== -1 && note.effect.indexOf('SlideStart') !== -1))
      if (longStartNotes.length) {
        // if already exists, then ignore, else add it to arr
        longStartNotes.forEach(startNote => {
          const exist = this.longGroups.find(longGroup => longGroup[0].beat === startNote.beat &&
            (longGroup[0].effect === startNote.effect || longGroup[0].property === startNote.property) &&
            longGroup[0].lane === startNote.lane)
          if (!exist) {
            if (startNote.property.indexOf('LongStart') !== -1) {
              const endNote = this.noteArr.find(note => note.timing > startNote.timing && note.property === 'LongEnd' && note.lane === startNote.lane)
              this.longGroups.push([startNote, endNote])
            } else {
              // find slide end note
              const endNote = this.noteArr
                .find(note => note.timing > startNote.timing &&
                  [startNote.effect.replace('Start', 'End'), startNote.effect.replace('Start', 'EndFlick')]
                    .indexOf(note.effect) !== -1)
              // get slide group notes
              this.longGroups.push(noteArr.filter(note => {
                const startTiming = startNote.timing
                const endTiming = endNote.timing
                return note.timing >= startTiming && note.timing <= endTiming &&
                  [startNote.effect.replace('Start', ''), startNote.effect, endNote.effect].indexOf(note.effect) !== -1
              }))
            }
            container.addChild(this.drawNewLong(this.longGroups[this.longGroups.length - 1]))
          }
        })
      }

      this.longGroups.forEach((group, idx) => {
        const drawNote = container.getChildAt(idx)
        const noteTime = group[0].timing - (this.audioContext.currentTime - baseTime)
        // const noteEndTime = note.endTiming - (this.audioContext.currentTime - baseTime)

        // let the note drop down for 1s
        drawNote.x = 0
        drawNote.y = 736 - 736 / 0.7 * noteTime
      })
    },
    drawSpecialNotes (noteArr, container, baseTime) {
      const comingNotes = noteArr.filter(note => {
        const noteTime = note.timing - (this.audioContext.currentTime - baseTime)
        return (noteTime > 0 && noteTime < 0.7)
      })

      const removeGroup = this.specialNotes.filter(specialNote => specialNote.timing < (this.audioContext.currentTime - baseTime))
      removeGroup.forEach(specialNote => {
        container.removeChildAt(this.specialNotes.indexOf(specialNote))
        this.specialNotes.splice(this.specialNotes.indexOf(specialNote), 1)
      })

      if (comingNotes.length) {
        comingNotes.forEach(comingNote => {
          const exist = this.specialNotes.find(specialNote => specialNote.beat === comingNote.beat)
          if (exist) return
          switch (comingNote.effect) {
            case 'BPMChange': {
              setTimeout(() => {
                this.BPM = comingNote.value
                this.BPMText.text = `BPM: ${this.BPM}`
              }, comingNote.timing - (this.audioContext.currentTime - baseTime))

              const BPMObject = new PIXI.Container()
              const BPMLine = new PIXI.Graphics()
              BPMLine.lineStyle(10, 0xBCBCBC)
                .moveTo(this.leftLaneBase, 0).lineTo(this.leftLaneBase + 490, 0)
              BPMObject.addChild(BPMLine)
              const bpmText = new PIXI.Text('BPM ' + comingNote.value, { fontSize: 18, fill: 'white', align: 'center' })
              bpmText.x = this.leftLaneBase + 400
              bpmText.y = -30
              BPMObject.addChild(bpmText)

              container.addChild(BPMObject)

              this.specialNotes.push(comingNote)
              break
            }
          }
        })
      }

      this.specialNotes.forEach((specialNote, idx) => {
        const drawNote = container.getChildAt(idx)
        const noteTime = specialNote.timing - (this.audioContext.currentTime - baseTime)
        // const noteEndTime = note.endTiming - (this.audioContext.currentTime - baseTime)

        // let the note drop down for 1s
        drawNote.x = 0
        drawNote.y = 736 - 736 / 0.7 * noteTime
      })
    },
    drawNewNote (note) {
      let noteAsset = this.typeNoteMap[note.effect] || this.typeNoteMap.Single
      if (note.property.indexOf('Long') !== -1 && note.effect === 'Single') {
        noteAsset = this.typeNoteMap[note.property]
      }
      const ret = new PIXI.Sprite(PIXI.loader.resources[noteAsset].texture)
      ret.x = 0
      ret.y = 0
      ret.width = 70
      ret.height = 27.3

      return ret
    },
    drawNewLong (longGroup) {
      // between two slide note should be skewed long note line
      // transform slide group into array of two notes
      const ret = new PIXI.Container()
      const slideNotes = longGroup.reduce((sum, note, idx) => {
        if (idx < longGroup.length - 1) return sum.concat([[note, longGroup[idx + 1]]])
        return sum
      }, [])
      const baseTiming = longGroup[0].timing
      slideNotes.forEach((notes, idx) => {
        const longLine = new PIXI.Sprite(PIXI.loader.resources[this.typeNoteMap.LongLine].texture)
        longLine.x = 70 * (Number(notes[0].lane - 1) || 0)
        longLine.y = (27.3 / 2) + (baseTiming - notes[0].timing) * 736 / 0.7
        longLine.width = 70
        const skewXangel = Math.atan((70 * ((Number(notes[1].lane - 1) || 0) - (Number(notes[0].lane - 1) || 0))) /
          (736 / 0.7 * (notes[0].timing - notes[1].timing)))
        longLine.height = 736 / 0.7 * (notes[0].timing - notes[1].timing) / Math.cos(skewXangel)
        longLine.skew.x = skewXangel
        ret.addChild(longLine)
      })
      return ret
    },
    stopRhythm () {
      const { AudioContext } = this
      this.tmpDeltaTime = 0
      this.currBaseTime = 0
      this.audioContext.close()
      this.audioContext = new AudioContext()
      this.app.ticker.remove(this.tickerFunc)
      this.currentNotes.forEach((notes, idx) => {
        if (!notes.length) return
        this.laneContainers[idx].removeChildAt(0)
        this.containerNotes[idx].splice(0, 1)

        this.currentNotes[idx] = []
      })
      this.audioStarted = false
      this.audioPaused = false
    },
    pauseRhythm () {
      this.audioContext.suspend()
      this.audioStarted = true
      this.audioPaused = true
    }
  }
}
</script>

<style lang="stylus" scoped>
.jacket-img
  width: 100%
  height: 400px
  background-size: contain
  background-repeat: no-repeat
  background-position: center
</style>
