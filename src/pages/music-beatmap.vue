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
            <q-select class="col-3" float-label="Difficulty" v-model="difficulty" :options="difficultyOptions"></q-select>
          </div>
          <canvas ref="game"></canvas>
        </div>
        <div class="col-lg-6 col-xs-12">
          <h3>{{data.title}}</h3>
          <p>{{$t('music.composer')}}: {{data.composer}}</p>
          <p>{{$t('music.lyricist')}}: {{data.lyricist}}</p>
          <p>{{$t('music.arranger')}}: {{data.arranger}}</p>
          <p>{{$t('common.band')}}:
            <span v-if="Number(data.bandId) > 5">{{data.bandName}}</span>
            <img height="60px" width="100px" v-if="Number(data.bandId) <= 5" v-lazy="`/assets/band/logo/00${data.bandId}_logoL.png`">
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
import BufferLoader from '../plugins/bufferLoader'

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
        Long: 'statics/gameres/note_long_3.png',
        Slide_Start_A: 'statics/gameres/note_long_3.png',
        Slide_Start_B: 'statics/gameres/note_long_3.png',
        Slide_A: 'statics/gameres/note_slide_among.png',
        Slide_B: 'statics/gameres/note_slide_among.png',
        Slide_End_A: 'statics/gameres/note_long_3.png',
        Slide_End_B: 'statics/gameres/note_long_3.png',
        Slide_End_Flick_A: 'statics/gameres/note_flick_3.png',
        Slide_End_Flick_B: 'statics/gameres/note_flick_3.png',
        Skill: 'statics/gameres/note_skill_3.png',
        LongLine: 'statics/gameres/longNoteLine.png'
      },
      containerNotes: [[], [], [], [], [], [], []],
      slideGroups: [],
      isReady: false,
      data: {},
      leftLaneBase: 10,
      currBaseTime: 0,
      difficultyOptions: [
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
      noteArr: []
    }
  },
  async mounted () {
    const { AudioContext } = this
    if (!AudioContext) return
    this.audioContext = new AudioContext()
    await this.getMusicById({musicId: this.$route.params.musicId, server: 'jp'})
    this.data = this.musicMap.jp[this.$route.params.musicId]
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
      bg.lineStyle(2, 0xd4d4d4)
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

      this.lane1Container = new PIXI.Container()
      this.lane1Container.x = this.leftLaneBase
      this.lane1Container.width = 70
      this.lane1Container.height = 750
      this.app.stage.addChild(this.lane1Container)

      this.lane2Container = new PIXI.Container()
      this.lane2Container.x = this.leftLaneBase + 70
      this.lane2Container.width = 70
      this.lane2Container.height = 750
      this.app.stage.addChild(this.lane2Container)

      this.lane3Container = new PIXI.Container()
      this.lane3Container.x = this.leftLaneBase + 70 * 2
      this.lane3Container.width = 70
      this.lane3Container.height = 750
      this.app.stage.addChild(this.lane3Container)

      this.lane4Container = new PIXI.Container()
      this.lane4Container.x = this.leftLaneBase + 70 * 3
      this.lane4Container.width = 70
      this.lane4Container.height = 750
      this.app.stage.addChild(this.lane4Container)

      this.lane5Container = new PIXI.Container()
      this.lane5Container.x = this.leftLaneBase + 70 * 4
      this.lane5Container.width = 70
      this.lane5Container.height = 750
      this.app.stage.addChild(this.lane5Container)

      this.lane6Container = new PIXI.Container()
      this.lane6Container.x = this.leftLaneBase + 70 * 5
      this.lane6Container.width = 70
      this.lane6Container.height = 750
      this.app.stage.addChild(this.lane6Container)

      this.lane7Container = new PIXI.Container()
      this.lane7Container.x = this.leftLaneBase + 70 * 6
      this.lane7Container.width = 70
      this.lane7Container.height = 750
      this.app.stage.addChild(this.lane7Container)

      this.slideContainer = new PIXI.Container()
      this.slideContainer.x = this.leftLaneBase
      this.slideContainer.width = 70 * 7
      this.slideContainer.height = 750
      this.app.stage.addChild(this.slideContainer)

      const blackMask = new PIXI.Graphics()
      blackMask.beginFill(0xfff, 1)
      blackMask.drawRect(0, 0, 510, 750)
      this.app.stage.mask = blackMask

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
          `/assets/sound/${this.data.bgmId}.mp3`,
          '/statics/hihat.wav',
          '/statics/flick.mp3'
        ],
        () => { this.audioDisable = false }
      )

      this.bufferLoader.load()
    },
    startRhythm () {
      if (!this.app) {
        this.app = new PIXI.Application(510, 800, {
          view: this.$refs.game
        })

        if (Object.keys(PIXI.loader.resources).length) {
          this.renderStage()
        } else {
          PIXI.loader.add([
            'statics/gameres/note_normal_3.png',
            'statics/gameres/note_flick_3.png',
            'statics/gameres/note_long_3.png',
            'statics/gameres/note_skill_3.png',
            'statics/gameres/note_slide_among.png',
            'statics/gameres/longNoteLine.png'
          ]).load(this.renderStage)
        }
      }
      if (this.audioPaused) {
        this.audioContext.resume()
        this.audioPaused = false
        return
      }
      this.$http.get(`/api/v1/jp/music/chart/${this.$route.params.musicId}/${this.difficulty}`)
        .then(res => res.json())
        .then(res => res.notes)
        .then(res => {
          const baseTime = this.audioContext.currentTime + 0.1
          this.data.combo = res.reduce((sum, note) => {
            if (!note.endTiming) return sum + 1
            else return sum + 2
          }, 0)
          res.forEach(note => {
            switch (note.type) {
              case 'Music':
                this.playSound(this.bufferLoader.bufferList[0], baseTime + note.timing)
                break
              default:
                if (note.type.indexOf('Flick') !== -1) this.playSound(this.bufferLoader.bufferList[2], baseTime + note.timing)
                else this.playSound(this.bufferLoader.bufferList[1], baseTime + note.timing)
                if (note.endTiming) this.playSound(this.bufferLoader.bufferList[1], baseTime + note.endTiming)
                break
            }
          })

          this.noteArr = res
          // prepare note lane data
          const noteLaneArr = [
            res.filter(note => note.column === 'SC'),
            res.filter(note => note.column === '1'),
            res.filter(note => note.column === '2'),
            res.filter(note => note.column === '3'),
            res.filter(note => note.column === '4'),
            res.filter(note => note.column === '5'),
            res.filter(note => note.column === '6')
          ]
          this.currBaseTime = baseTime
          this.tickerFunc = this.drawNotes.bind(this, noteLaneArr, this.bufferLoader.bufferList[0].duration)
          this.app.ticker.add(this.tickerFunc)

          this.audioStarted = true
        })
    },
    drawNotes (noteLaneArr, maxLength) {
      if (this.audioPaused) return
      // draw notes on lane
      this.drawLaneNotes(noteLaneArr[0], this.lane1Container, this.currBaseTime, 0)
      this.drawLaneNotes(noteLaneArr[1], this.lane2Container, this.currBaseTime, 1)
      this.drawLaneNotes(noteLaneArr[2], this.lane3Container, this.currBaseTime, 2)
      this.drawLaneNotes(noteLaneArr[3], this.lane4Container, this.currBaseTime, 3)
      this.drawLaneNotes(noteLaneArr[4], this.lane5Container, this.currBaseTime, 4)
      this.drawLaneNotes(noteLaneArr[5], this.lane6Container, this.currBaseTime, 5)
      this.drawLaneNotes(noteLaneArr[6], this.lane7Container, this.currBaseTime, 6)

      // draw slide
      this.drawSlideNotes(this.noteArr, this.slideContainer, this.currBaseTime)

      if (this.audioContext.currentTime - this.currBaseTime > maxLength) {
        this.stopRhythm()
      }
    },
    drawLaneNotes (noteArr, container, baseTime, laneIndex) {
      const comingNotes = noteArr.filter(note => {
        const noteTime = note.timing - (this.audioContext.currentTime - baseTime)
        const noteEndTime = note.endTiming - (this.audioContext.currentTime - baseTime)
        return (noteTime > 0 && noteTime < 1) || (noteEndTime > 0 && noteTime < 1)
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
        this.currentNotes[laneIndex] = []
      } else {
        // check if next notes and current notes are matched
        const nextFirstNote = comingNotes[0]
        const nextFirstNoteOldIndex = this.currentNotes[laneIndex].findIndex(note => note.index === nextFirstNote.index)
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
      // if (JSON.stringify(this.currentNotes[laneIndex]) !== JSON.stringify(this.containerNotes[laneIndex])) {
      //   console.log(this.currentNotes[laneIndex], this.containerNotes[laneIndex], laneIndex)
      //   this.audioContext.close()
      //   this.app.ticker.remove(this.tickerFunc)
      // }

      // update notes position
      this.currentNotes[laneIndex].forEach((note, idx) => {
        const drawNote = container.getChildAt(idx)
        const noteTime = note.timing - (this.audioContext.currentTime - baseTime)
        // const noteEndTime = note.endTiming - (this.audioContext.currentTime - baseTime)

        // let the note drop down for 1s
        drawNote.x = 0
        drawNote.y = 736 * (1 - noteTime)
      })
    },
    drawSlideNotes (noteArr, container, baseTime) {
      const comingNotes = noteArr.filter(note => {
        const noteTime = note.timing - (this.audioContext.currentTime - baseTime)
        const noteEndTime = note.endTiming - (this.audioContext.currentTime - baseTime)
        return (noteTime > 0 && noteTime < 1) || (noteEndTime > 0 && noteTime < 1)
      })

      // remove finished slide
      const removeGroup = this.slideGroups.filter(slideGroup => slideGroup[slideGroup.length - 1].timing < (this.audioContext.currentTime - baseTime))
      removeGroup.forEach(slideGroup => {
        container.removeChildAt(this.slideGroups.indexOf(slideGroup))
        this.slideGroups.splice(this.slideGroups.indexOf(slideGroup), 1)
      })

      // check for slide start note
      const slideStartNotes = comingNotes.filter(note => note.type.indexOf('Slide_Start') !== -1)
      if (slideStartNotes.length) {
        // if already exists, then ignore, else add it to arr
        slideStartNotes.forEach(startNote => {
          const exist = this.slideGroups.find(slideGroup => slideGroup[0].timing === startNote.timing &&
            slideGroup[0].type === startNote.type)
          if (!exist) {
            // get slide group notes
            // find slide end note
            const endNote = this.noteArr
              .find(note => note.timing > startNote.timing && [startNote.type.replace('Start', 'End'), startNote.type.replace('Start', 'End_Flick')].indexOf(note.type) !== -1)
            this.slideGroups.push(noteArr.filter(note => {
              const startTiming = startNote.timing
              const endTiming = endNote.timing
              return note.timing >= startTiming && note.timing <= endTiming &&
                [startNote.type.replace('_Start', ''), startNote.type, endNote.type].indexOf(note.type) !== -1
            }))
            container.addChild(this.drawNewSlide(this.slideGroups[this.slideGroups.length - 1]))
          }
        })
      }

      this.slideGroups.forEach((group, idx) => {
        const drawNote = container.getChildAt(idx)
        const noteTime = group[0].timing - (this.audioContext.currentTime - baseTime)
        // const noteEndTime = note.endTiming - (this.audioContext.currentTime - baseTime)

        // let the note drop down for 1s
        drawNote.x = 0
        drawNote.y = 736 * (1 - noteTime)
      })
    },
    drawNewNote (note) {
      const noteAsset = this.typeNoteMap[note.type] || this.typeNoteMap.Single
      let ret
      if (note.endTiming) {
        ret = new PIXI.Container()
        const startNote = new PIXI.Sprite(PIXI.loader.resources[noteAsset].texture)
        startNote.x = 0
        startNote.y = 0
        startNote.width = 70
        startNote.height = 27.3
        ret.addChild(startNote)

        const endNote = new PIXI.Sprite(PIXI.loader.resources[this.typeNoteMap.Long].texture)
        endNote.x = 0
        endNote.y = 736 * (note.timing - note.endTiming)
        endNote.width = 70
        endNote.height = 27.3
        ret.addChild(endNote)

        const longLine = new PIXI.Sprite(PIXI.loader.resources[this.typeNoteMap.LongLine].texture)
        longLine.x = 0
        longLine.y = 736 * (note.timing - note.endTiming) + 27.3 / 2
        longLine.width = 70
        longLine.height = startNote.y - endNote.y
        ret.addChild(longLine)
      } else {
        ret = new PIXI.Sprite(PIXI.loader.resources[noteAsset].texture)
        ret.x = 0
        ret.y = 0
        ret.width = 70
        ret.height = 27.3
      }

      return ret
    },
    drawNewSlide (slideGroup) {
      // between two slide note should be skewed long note line
      // transform slide group into array of two notes
      const ret = new PIXI.Container()
      const slideNotes = slideGroup.reduce((sum, note, idx) => {
        if (idx < slideGroup.length - 1) return sum.concat([[note, slideGroup[idx + 1]]])
        return sum
      }, [])
      const baseTiming = slideGroup[0].timing
      slideNotes.forEach((notes, idx) => {
        const longLine = new PIXI.Sprite(PIXI.loader.resources[this.typeNoteMap.LongLine].texture)
        longLine.x = 70 * (Number(notes[0].column) || 0)
        longLine.y = (27.3 / 2) + (baseTiming - notes[0].timing) * 736
        longLine.width = 70
        const skewXangel = Math.atan((70 * ((Number(notes[1].column) || 0) - (Number(notes[0].column) || 0))) /
          (736 * (notes[0].timing - notes[1].timing)))
        longLine.height = 736 * (notes[0].timing - notes[1].timing) / Math.cos(skewXangel)
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

<style>
</style>
