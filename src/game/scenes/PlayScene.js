/* eslint-disable no-unused-vars */
import { Scene } from 'phaser'
import * as dat from 'dat.gui'

export default class PlayScene extends Scene {
  beatmap
  BPM = 0
  cH = 800
  cW = 800
  hitLineHeight
  noteAppearHeight
  // about Time
  startT
  nowT
  lastT
  totalT = 0
  sumT = 0
  frame = 0
  // object
  testText
  totalCombo = 0
  combo = 0
  // setting
  speed = 9.0
  noteSize = 1.0
  // note
  xK = 0.25
  changeK = 3.5
  offset = 500 + (11 - this.speed) * 500
  speedK
  noteSprite
  sliderSprite
  // bgm
  cBGM
  bVolume = 0.5
  pVolume = 0
  constructor () {
    super({ key: 'PlayScene' })
  }
  reload () {
    this.combo = 0
    this.cBGM.stop()
    for (let i = 0; i < this.noteSprite.length; i++) {
      if (this.noteSprite[i].s != null) { this.noteSprite[i].s.destroy() }
      if (this.noteSprite[i].s2 != null) { this.noteSprite[i].s2.destroy() }
    }
    for (let i = 0; i < this.sliderSprite.length; i++) {
      this.sliderSprite[i].s.destroy()
    }
    this.noteSprite = []
    this.sliderSprite = []
    let j = 0
    for (let i = 0; i < this.beatmap.objects.length; i++) {
      let nSI = {
        s: null,
        s2: null,
        startT: 0,
        runT: 0,
        isHit: false,
        isUsed: false
      }
      if (this.beatmap.objects[i].type === 'Object') {
        if ((this.beatmap.objects[i].effect === 'Single' || (this.beatmap.objects[i].effect === 'Skill' && this.beatmap.objects[i].property === 'Slider') || this.beatmap.objects[i].effect === 'FeverSingle') &&
        this.beatmap.objects[i].property === 'Single') {
          switch (this.beatmap.objects[i].lane) {
            case 1:
              nSI.s = this.add.sprite(this.cW / 2 - 9, this.noteAppearHeight + 10, 'noteN1')
              break
            case 2:
              nSI.s = this.add.sprite(this.cW / 2 - 6, this.noteAppearHeight + 10, 'noteN2')
              break
            case 3:
              nSI.s = this.add.sprite(this.cW / 2 - 3, this.noteAppearHeight + 10, 'noteN3')
              break
            case 4:
              nSI.s = this.add.sprite(this.cW / 2, this.noteAppearHeight + 10, 'noteN4')
              break
            case 5:
              nSI.s = this.add.sprite(this.cW / 2 + 3, this.noteAppearHeight + 10, 'noteN5')
              break
            case 6:
              nSI.s = this.add.sprite(this.cW / 2 + 6, this.noteAppearHeight + 10, 'noteN6')
              break
            case 7:
              nSI.s = this.add.sprite(this.cW / 2 + 9, this.noteAppearHeight + 10, 'noteN7')
              break
          }
          nSI.s.displayWidth = 10
          nSI.s.displayHeight = 5
          nSI.s.depth = -1
          nSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        } else if (this.beatmap.objects[i].effect === 'Flick' || this.beatmap.objects[i].effect === 'SlideEndFlick_A' || this.beatmap.objects[i].effect === 'SlideEndFlick_B') {
          switch (this.beatmap.objects[i].lane) {
            case 1:
              nSI.s = this.add.sprite(this.cW / 2 - 9, this.noteAppearHeight + 10, 'noteU1')
              nSI.s2 = this.add.sprite(this.cW / 2 - 9, this.noteAppearHeight + 5, 'upImg')
              break
            case 2:
              nSI.s = this.add.sprite(this.cW / 2 - 6, this.noteAppearHeight + 10, 'noteU2')
              nSI.s2 = this.add.sprite(this.cW / 2 - 6, this.noteAppearHeight + 5, 'upImg')
              break
            case 3:
              nSI.s = this.add.sprite(this.cW / 2 - 3, this.noteAppearHeight + 10, 'noteU3')
              nSI.s2 = this.add.sprite(this.cW / 2 - 3, this.noteAppearHeight + 5, 'upImg')
              break
            case 4:
              nSI.s = this.add.sprite(this.cW / 2, this.noteAppearHeight + 10, 'noteU4')
              nSI.s2 = this.add.sprite(this.cW / 2, this.noteAppearHeight + 5, 'upImg')
              break
            case 5:
              nSI.s = this.add.sprite(this.cW / 2 + 3, this.noteAppearHeight + 10, 'noteU5')
              nSI.s2 = this.add.sprite(this.cW / 2 + 3, this.noteAppearHeight + 5, 'upImg')
              break
            case 6:
              nSI.s = this.add.sprite(this.cW / 2 + 6, this.noteAppearHeight + 10, 'noteU6')
              nSI.s2 = this.add.sprite(this.cW / 2 + 6, this.noteAppearHeight + 5, 'upImg')
              break
            case 7:
              nSI.s = this.add.sprite(this.cW / 2 + 9, this.noteAppearHeight + 10, 'noteU7')
              nSI.s2 = this.add.sprite(this.cW / 2 + 9, this.noteAppearHeight + 5, 'upImg')
              break
          }
          nSI.s.displayWidth = 10
          nSI.s.displayHeight = 5
          nSI.s.depth = -1
          nSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
          nSI.s2.displayWidth = 6
          nSI.s2.displayHeight = 3
          nSI.s2.depth = -1
        } else if (this.beatmap.objects[i].effect === 'Slide_A' || this.beatmap.objects[i].effect === 'Slide_B') {
          switch (this.beatmap.objects[i].lane) {
            case 1:
              nSI.s = this.add.sprite(this.cW / 2 - 9, this.noteAppearHeight + 10, 'sliderP')
              break
            case 2:
              nSI.s = this.add.sprite(this.cW / 2 - 6, this.noteAppearHeight + 10, 'sliderP')
              break
            case 3:
              nSI.s = this.add.sprite(this.cW / 2 - 3, this.noteAppearHeight + 10, 'sliderP')
              break
            case 4:
              nSI.s = this.add.sprite(this.cW / 2, this.noteAppearHeight + 10, 'sliderP')
              break
            case 5:
              nSI.s = this.add.sprite(this.cW / 2 + 3, this.noteAppearHeight + 10, 'sliderP')
              break
            case 6:
              nSI.s = this.add.sprite(this.cW / 2 + 6, this.noteAppearHeight + 10, 'sliderP')
              break
            case 7:
              nSI.s = this.add.sprite(this.cW / 2 + 9, this.noteAppearHeight + 10, 'sliderP')
              break
          }
          nSI.s.displayWidth = 10
          nSI.s.displayHeight = 5
          nSI.s.depth = -1
          nSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        } else if (this.beatmap.objects[i].property === 'LongStart' || this.beatmap.objects[i].property === 'LongEnd' || this.beatmap.objects[i].property === 'Slide') {
          switch (this.beatmap.objects[i].lane) {
            case 1:
              nSI.s = this.add.sprite(this.cW / 2 - 9, this.noteAppearHeight + 10, 'noteS1')
              break
            case 2:
              nSI.s = this.add.sprite(this.cW / 2 - 6, this.noteAppearHeight + 10, 'noteS2')
              break
            case 3:
              nSI.s = this.add.sprite(this.cW / 2 - 3, this.noteAppearHeight + 10, 'noteS3')
              break
            case 4:
              nSI.s = this.add.sprite(this.cW / 2, this.noteAppearHeight + 10, 'noteS4')
              break
            case 5:
              nSI.s = this.add.sprite(this.cW / 2 + 3, this.noteAppearHeight + 10, 'noteS5')
              break
            case 6:
              nSI.s = this.add.sprite(this.cW / 2 + 6, this.noteAppearHeight + 10, 'noteS6')
              break
            case 7:
              nSI.s = this.add.sprite(this.cW / 2 + 9, this.noteAppearHeight + 10, 'noteS7')
              break
          }
          nSI.s.displayWidth = 10
          nSI.s.displayHeight = 5
          nSI.s.depth = -1
          nSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        }
      }
      this.noteSprite[i] = nSI
    }
    for (let i = 0; i < this.beatmap.objects.length; i++) {
      let sSI = {
        s: null,
        startT: 0,
        isHit: false,
        n1: null,
        n2: null
      }
      if (this.beatmap.objects[i].property === 'LongStart') {
        sSI.s = this.add.quad(this.cW / 2, 100, 'longNL')
        sSI.s.depth = -1
        sSI.n1 = i
        sSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        let flag = false
        for (let i0 = i + 1; i0 < this.beatmap.objects.length; i0++) { // 向后遍历
          if (this.beatmap.objects[i0].property === 'LongEnd' && this.noteSprite[i0].isUsed === false) { // 查询是否有第一个符合end且未用过的note
            if (this.beatmap.objects[i0 + 1].property === 'LongEnd' && this.noteSprite[i0 + 1].isUsed === false) { // 查询这个note的下一个note是否同级
              for (let i01 = i + 1; i01 < this.beatmap.objects.length; i01++) { // 重新遍历
                if (this.beatmap.objects[i01].property === 'LongStart' && this.noteSprite[i01].isUsed === false) { // 查询start的下一个符合条件note
                  if (this.beatmap.objects[i].lane > this.beatmap.objects[i01].lane) { // 如果note.i的轨道大于note.i01
                    if (this.beatmap.objects[i0].lane > this.beatmap.objects[i0 + 1].lane) { // 如果note.i0的轨道大于note.i0+1
                      sSI.n2 = i0
                      this.noteSprite[i0].isUsed = true
                    } else {
                      sSI.n2 = i0 + 1
                      this.noteSprite[i0 + 1].isUsed = true
                    }
                  } else {
                    if (this.beatmap.objects[i0].lane > this.beatmap.objects[i0 + 1].lane) {
                      sSI.n2 = i0 + 1
                      this.noteSprite[i0 + 1].isUsed = true
                    } else {
                      sSI.n2 = i0
                      this.noteSprite[i0].isUsed = true
                    }
                  }
                  flag = true
                  break
                }
              }
            } else {
              sSI.n2 = i0
              this.noteSprite[i0].isUsed = true
            }
            break
          }
        }
        this.sliderSprite[j] = sSI
        j++
      } else if (this.beatmap.objects[i].effect === 'Slide_A') {
        sSI.s = this.add.quad(this.cW / 2, 100, 'longNL')
        sSI.s.depth = -1
        sSI.n1 = i
        sSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        for (let i0 = i + 1; i0 < this.beatmap.objects.length; i0++) {
          if (this.beatmap.objects[i0].effect === 'SlideEndFlick_A' || this.beatmap.objects[i0].effect === 'SlideEnd_A' || this.beatmap.objects[i0].effect === 'Slide_A') {
            sSI.n2 = i0
            break
          }
        }
        this.sliderSprite[j] = sSI
        j++
      } else if (this.beatmap.objects[i].effect === 'Slide_B') {
        sSI.s = this.add.quad(this.cW / 2, 100, 'longNL')
        sSI.s.depth = -1
        sSI.n1 = i
        sSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        for (let i0 = i + 1; i0 < this.beatmap.objects.length; i0++) {
          if (this.beatmap.objects[i0].effect === 'SlideEndFlick_B' || this.beatmap.objects[i0].effect === 'SlideEnd_B' || this.beatmap.objects[i0].effect === 'Slide_B') {
            sSI.n2 = i0
            break
          }
        }
        this.sliderSprite[j] = sSI
        j++
      } else if (this.beatmap.objects[i].effect === 'SlideStart_A') {
        sSI.s = this.add.quad(this.cW / 2, 100, 'longNL')
        sSI.s.depth = -1
        sSI.n1 = i
        sSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        for (let i0 = i + 1; i0 < this.beatmap.objects.length; i0++) {
          if (this.beatmap.objects[i0].effect === 'SlideEndFlick_A' || this.beatmap.objects[i0].effect === 'SlideEnd_A' || this.beatmap.objects[i0].effect === 'Slide_A') {
            sSI.n2 = i0
            break
          }
        }
        this.sliderSprite[j] = sSI
        j++
      } else if (this.beatmap.objects[i].effect === 'SlideStart_B') {
        sSI.s = this.add.quad(this.cW / 2, 100, 'longNL')
        sSI.s.depth = -1
        sSI.n1 = i
        sSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        for (let i0 = i + 1; i0 < this.beatmap.objects.length; i0++) {
          if (this.beatmap.objects[i0].effect === 'SlideEndFlick_B' || this.beatmap.objects[i0].effect === 'SlideEnd_B' || this.beatmap.objects[i0].effect === 'Slide_B') {
            sSI.n2 = i0
            break
          }
        }
        this.sliderSprite[j] = sSI
        j++
      }
    }
  }
  seekLoad (value) {
    this.reload()
    this.cBGM.play({ volume: this.bVolume, seek: value })
  }
  setup () {
    var gui = new dat.GUI()
    gui.domElement.style.marginTop = '50px'
    var sm = gui.addFolder('Control Panel')
    let soundSeek = sm.add(this.cBGM, 'seek', 0, this.cBGM.duration).step(0.001).listen()
    sm.add(this.cBGM, 'rate', 0.5, 1.5).step(0.01).listen()
    // sm.add(this.cBGM, 'detune', -1200, 1200).step(50).listen()
    // sm.add(this.cBGM, 'loop').listen()
    let soundPlay = sm.add(this.cBGM, 'play')
    let soundPause = sm.add(this.cBGM, 'pause')
    let soundResume = sm.add(this.cBGM, 'resume')
    let soundStop = sm.add(this.cBGM, 'stop')
    sm.open()
    soundPlay.domElement.id = 'play'
    document.getElementById('play').parentNode.onclick = () => {
      this.reload()
      this.cBGM.play({ volume: this.bVolume })
    }
    soundSeek.onFinishChange((value) => this.seekLoad(value))
  }
  create () {
    this.noteSprite = []
    this.sliderSprite = []
    // get beatmap
    this.beatmap = JSON.parse(window.name).body
    this.totalCombo = this.beatmap.metadata.combo
    console.log(this.beatmap, this.totalCombo)
    // all the img must connect with cw & ch
    // load bg & bgr
    let bg = this.add.sprite(this.cW / 2, this.cH / 2, 'bg')
    let bgR = this.add.sprite(this.cW / 2, this.cH / 3, 'bgR')
    bg.displayWidth = this.cW * 1.32
    bg.displayHeight = this.cH / 2 * 2
    bgR.displayWidth = this.cH / 820 * 680
    bgR.displayHeight = bgR.displayWidth / 16.7 * 9
    // init the begin & end
    this.hitLineHeight = bgR.y + bgR.displayHeight / 2
    this.noteAppearHeight = bgR.y - bgR.displayHeight / 2
    // load bgHL
    let bgHL = this.add.sprite(this.cW / 2, this.hitLineHeight, 'bgHL')
    bgHL.displayWidth = bgR.displayWidth * 1.5
    bgHL.displayHeight = bgHL.displayWidth / 1800 * 38
    // set bg depth
    bg.depth = bgR.depth = bgHL.depth = 0
    // init note sprite
    this.speedK = (bgR.displayHeight - 10) / this.offset / 37.3
    let j = 0
    for (let i = 0; i < this.beatmap.objects.length; i++) {
      let nSI = {
        s: null,
        s2: null,
        startT: 0,
        runT: 0,
        isHit: false,
        isUsed: false
      }
      if (this.beatmap.objects[i].type === 'Object') {
        if ((this.beatmap.objects[i].effect === 'Single' || (this.beatmap.objects[i].effect === 'Skill' && this.beatmap.objects[i].property === 'Slider') || this.beatmap.objects[i].effect === 'FeverSingle') &&
        this.beatmap.objects[i].property === 'Single') {
          switch (this.beatmap.objects[i].lane) {
            case 1:
              nSI.s = this.add.sprite(this.cW / 2 - 9, this.noteAppearHeight + 10, 'noteN1')
              break
            case 2:
              nSI.s = this.add.sprite(this.cW / 2 - 6, this.noteAppearHeight + 10, 'noteN2')
              break
            case 3:
              nSI.s = this.add.sprite(this.cW / 2 - 3, this.noteAppearHeight + 10, 'noteN3')
              break
            case 4:
              nSI.s = this.add.sprite(this.cW / 2, this.noteAppearHeight + 10, 'noteN4')
              break
            case 5:
              nSI.s = this.add.sprite(this.cW / 2 + 3, this.noteAppearHeight + 10, 'noteN5')
              break
            case 6:
              nSI.s = this.add.sprite(this.cW / 2 + 6, this.noteAppearHeight + 10, 'noteN6')
              break
            case 7:
              nSI.s = this.add.sprite(this.cW / 2 + 9, this.noteAppearHeight + 10, 'noteN7')
              break
          }
          nSI.s.displayWidth = 10
          nSI.s.displayHeight = 5
          nSI.s.depth = -1
          nSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        } else if (this.beatmap.objects[i].effect === 'Flick' || this.beatmap.objects[i].effect === 'SlideEndFlick_A' || this.beatmap.objects[i].effect === 'SlideEndFlick_B') {
          switch (this.beatmap.objects[i].lane) {
            case 1:
              nSI.s = this.add.sprite(this.cW / 2 - 9, this.noteAppearHeight + 10, 'noteU1')
              nSI.s2 = this.add.sprite(this.cW / 2 - 9, this.noteAppearHeight + 5, 'upImg')
              break
            case 2:
              nSI.s = this.add.sprite(this.cW / 2 - 6, this.noteAppearHeight + 10, 'noteU2')
              nSI.s2 = this.add.sprite(this.cW / 2 - 6, this.noteAppearHeight + 5, 'upImg')
              break
            case 3:
              nSI.s = this.add.sprite(this.cW / 2 - 3, this.noteAppearHeight + 10, 'noteU3')
              nSI.s2 = this.add.sprite(this.cW / 2 - 3, this.noteAppearHeight + 5, 'upImg')
              break
            case 4:
              nSI.s = this.add.sprite(this.cW / 2, this.noteAppearHeight + 10, 'noteU4')
              nSI.s2 = this.add.sprite(this.cW / 2, this.noteAppearHeight + 5, 'upImg')
              break
            case 5:
              nSI.s = this.add.sprite(this.cW / 2 + 3, this.noteAppearHeight + 10, 'noteU5')
              nSI.s2 = this.add.sprite(this.cW / 2 + 3, this.noteAppearHeight + 5, 'upImg')
              break
            case 6:
              nSI.s = this.add.sprite(this.cW / 2 + 6, this.noteAppearHeight + 10, 'noteU6')
              nSI.s2 = this.add.sprite(this.cW / 2 + 6, this.noteAppearHeight + 5, 'upImg')
              break
            case 7:
              nSI.s = this.add.sprite(this.cW / 2 + 9, this.noteAppearHeight + 10, 'noteU7')
              nSI.s2 = this.add.sprite(this.cW / 2 + 9, this.noteAppearHeight + 5, 'upImg')
              break
          }
          nSI.s.displayWidth = 10
          nSI.s.displayHeight = 5
          nSI.s.depth = -1
          nSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
          nSI.s2.displayWidth = 6
          nSI.s2.displayHeight = 3
          nSI.s2.depth = -1
        } else if (this.beatmap.objects[i].effect === 'Slide_A' || this.beatmap.objects[i].effect === 'Slide_B') {
          switch (this.beatmap.objects[i].lane) {
            case 1:
              nSI.s = this.add.sprite(this.cW / 2 - 9, this.noteAppearHeight + 10, 'sliderP')
              break
            case 2:
              nSI.s = this.add.sprite(this.cW / 2 - 6, this.noteAppearHeight + 10, 'sliderP')
              break
            case 3:
              nSI.s = this.add.sprite(this.cW / 2 - 3, this.noteAppearHeight + 10, 'sliderP')
              break
            case 4:
              nSI.s = this.add.sprite(this.cW / 2, this.noteAppearHeight + 10, 'sliderP')
              break
            case 5:
              nSI.s = this.add.sprite(this.cW / 2 + 3, this.noteAppearHeight + 10, 'sliderP')
              break
            case 6:
              nSI.s = this.add.sprite(this.cW / 2 + 6, this.noteAppearHeight + 10, 'sliderP')
              break
            case 7:
              nSI.s = this.add.sprite(this.cW / 2 + 9, this.noteAppearHeight + 10, 'sliderP')
              break
          }
          nSI.s.displayWidth = 10
          nSI.s.displayHeight = 5
          nSI.s.depth = -1
          nSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        } else if (this.beatmap.objects[i].property === 'LongStart' || this.beatmap.objects[i].property === 'LongEnd' || this.beatmap.objects[i].property === 'Slide') {
          switch (this.beatmap.objects[i].lane) {
            case 1:
              nSI.s = this.add.sprite(this.cW / 2 - 9, this.noteAppearHeight + 10, 'noteS1')
              break
            case 2:
              nSI.s = this.add.sprite(this.cW / 2 - 6, this.noteAppearHeight + 10, 'noteS2')
              break
            case 3:
              nSI.s = this.add.sprite(this.cW / 2 - 3, this.noteAppearHeight + 10, 'noteS3')
              break
            case 4:
              nSI.s = this.add.sprite(this.cW / 2, this.noteAppearHeight + 10, 'noteS4')
              break
            case 5:
              nSI.s = this.add.sprite(this.cW / 2 + 3, this.noteAppearHeight + 10, 'noteS5')
              break
            case 6:
              nSI.s = this.add.sprite(this.cW / 2 + 6, this.noteAppearHeight + 10, 'noteS6')
              break
            case 7:
              nSI.s = this.add.sprite(this.cW / 2 + 9, this.noteAppearHeight + 10, 'noteS7')
              break
          }
          nSI.s.displayWidth = 10
          nSI.s.displayHeight = 5
          nSI.s.depth = -1
          nSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        }
      }
      this.noteSprite[i] = nSI
    }
    for (let i = 0; i < this.beatmap.objects.length; i++) {
      let sSI = {
        s: null,
        startT: 0,
        isHit: false,
        n1: null,
        n2: null
      }
      if (this.beatmap.objects[i].property === 'LongStart') {
        sSI.s = this.add.quad(this.cW / 2, 100, 'longNL')
        sSI.s.depth = -1
        sSI.n1 = i
        sSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        let flag = false
        for (let i0 = i + 1; i0 < this.beatmap.objects.length; i0++) { // 向后遍历
          if (this.beatmap.objects[i0].property === 'LongEnd' && this.noteSprite[i0].isUsed === false) { // 查询是否有第一个符合end且未用过的note
            if (this.beatmap.objects[i0 + 1].property === 'LongEnd' && this.noteSprite[i0 + 1].isUsed === false) { // 查询这个note的下一个note是否同级
              for (let i01 = i + 1; i01 < this.beatmap.objects.length; i01++) { // 重新遍历
                if (this.beatmap.objects[i01].property === 'LongStart' && this.noteSprite[i01].isUsed === false) { // 查询start的下一个符合条件note
                  if (this.beatmap.objects[i].lane > this.beatmap.objects[i01].lane) { // 如果note.i的轨道大于note.i01
                    if (this.beatmap.objects[i0].lane > this.beatmap.objects[i0 + 1].lane) { // 如果note.i0的轨道大于note.i0+1
                      sSI.n2 = i0
                      this.noteSprite[i0].isUsed = true
                    } else {
                      sSI.n2 = i0 + 1
                      this.noteSprite[i0 + 1].isUsed = true
                    }
                  } else {
                    if (this.beatmap.objects[i0].lane > this.beatmap.objects[i0 + 1].lane) {
                      sSI.n2 = i0 + 1
                      this.noteSprite[i0 + 1].isUsed = true
                    } else {
                      sSI.n2 = i0
                      this.noteSprite[i0].isUsed = true
                    }
                  }
                  flag = true
                  break
                }
              }
            } else {
              sSI.n2 = i0
              this.noteSprite[i0].isUsed = true
            }
            break
          }
        }
        this.sliderSprite[j] = sSI
        j++
      } else if (this.beatmap.objects[i].effect === 'Slide_A') {
        sSI.s = this.add.quad(this.cW / 2, 100, 'longNL')
        sSI.s.depth = -1
        sSI.n1 = i
        sSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        for (let i0 = i + 1; i0 < this.beatmap.objects.length; i0++) {
          if (this.beatmap.objects[i0].effect === 'SlideEndFlick_A' || this.beatmap.objects[i0].effect === 'SlideEnd_A' || this.beatmap.objects[i0].effect === 'Slide_A') {
            sSI.n2 = i0
            break
          }
        }
        this.sliderSprite[j] = sSI
        j++
      } else if (this.beatmap.objects[i].effect === 'Slide_B') {
        sSI.s = this.add.quad(this.cW / 2, 100, 'longNL')
        sSI.s.depth = -1
        sSI.n1 = i
        sSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        for (let i0 = i + 1; i0 < this.beatmap.objects.length; i0++) {
          if (this.beatmap.objects[i0].effect === 'SlideEndFlick_B' || this.beatmap.objects[i0].effect === 'SlideEnd_B' || this.beatmap.objects[i0].effect === 'Slide_B') {
            sSI.n2 = i0
            break
          }
        }
        this.sliderSprite[j] = sSI
        j++
      } else if (this.beatmap.objects[i].effect === 'SlideStart_A') {
        sSI.s = this.add.quad(this.cW / 2, 100, 'longNL')
        sSI.s.depth = -1
        sSI.n1 = i
        sSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        for (let i0 = i + 1; i0 < this.beatmap.objects.length; i0++) {
          if (this.beatmap.objects[i0].effect === 'SlideEndFlick_A' || this.beatmap.objects[i0].effect === 'SlideEnd_A' || this.beatmap.objects[i0].effect === 'Slide_A') {
            sSI.n2 = i0
            break
          }
        }
        this.sliderSprite[j] = sSI
        j++
      } else if (this.beatmap.objects[i].effect === 'SlideStart_B') {
        sSI.s = this.add.quad(this.cW / 2, 100, 'longNL')
        sSI.s.depth = -1
        sSI.n1 = i
        sSI.startT = this.beatmap.objects[i].timing - this.offset / 1000
        for (let i0 = i + 1; i0 < this.beatmap.objects.length; i0++) {
          if (this.beatmap.objects[i0].effect === 'SlideEndFlick_B' || this.beatmap.objects[i0].effect === 'SlideEnd_B' || this.beatmap.objects[i0].effect === 'Slide_B') {
            sSI.n2 = i0
            break
          }
        }
        this.sliderSprite[j] = sSI
        j++
      }
    }
    // word
    this.testText = this.add.text(20, 15, 'FPS：计算中...', {
      fontStyle: '等线',
      fill: '#fff',
      fontSize: 100 + 'px'
    })
    // add sound
    this.sound.add('flickS')
    this.sound.add('hihatS')
    this.cBGM = this.sound.add('BGM')
    // init time
    this.startT = Date.now()
    this.nowT = this.startT
    // add sound
    this.cBGM.play({ volume: this.bVolume })
    this.setup()
  }
  update () {
    this.countFPS()
    this.totalT = this.cBGM.seek
    for (let i = 0; i < this.noteSprite.length; i++) {
      if (this.beatmap.objects[i].type === 'Object' && this.noteSprite[i].s !== null) {
        if (this.totalT >= this.noteSprite[i].startT && this.noteSprite[i].isHit === false) {
          this.noteSprite[i].runT = (this.totalT - this.noteSprite[i].startT) * 1000
          if (this.noteSprite[i].s2 != null) {
            this.noteSprite[i].s2.x = this.cW / 2 + (this.beatmap.objects[i].lane - 4) * (this.xK * this.noteSprite[i].runT * this.speedK * this.noteSprite[i].s.displayHeight + this.changeK)
            this.noteSprite[i].s2.displayWidth = this.noteSize * 4 + this.noteSize * 1 * (this.noteSprite[i].s.y - 100) / 10
            this.noteSprite[i].s2.displayHeight = this.noteSize * 2 + this.noteSize * 0.5 * (this.noteSprite[i].s.y - 100) / 10
            this.noteSprite[i].s2.y = this.noteAppearHeight + 9 + this.noteSprite[i].runT * this.speedK * 0.9 * this.noteSprite[i].s.displayHeight
            this.noteSprite[i].s2.depth = 6
          }
          this.noteSprite[i].s.x = this.cW / 2 + (this.beatmap.objects[i].lane - 4) * (this.xK * this.noteSprite[i].runT * this.speedK * this.noteSprite[i].s.displayHeight + this.changeK)
          this.noteSprite[i].s.displayWidth = this.noteSize * 8 + this.noteSize * 2 * (this.noteSprite[i].s.y - 100) / 10
          this.noteSprite[i].s.displayHeight = this.noteSize * 4 + this.noteSize * 1 * (this.noteSprite[i].s.y - 100) / 10
          this.noteSprite[i].s.y = this.noteAppearHeight + 10 + this.noteSprite[i].runT * this.speedK * this.noteSprite[i].s.displayHeight
          this.noteSprite[i].s.depth = 5
        }
        if (this.noteSprite[i].isHit === false && this.beatmap.objects[i].timing <= this.totalT) {
          this.combo++
          this.noteSprite[i].isHit = true
          // this.noteSprite[i].runT = this.offset
          this.noteSprite[i].s.y = this.hitLineHeight
          this.noteSprite[i].s.depth = -1
          if (this.beatmap.objects[i].timing <= this.totalT) {
            if (this.beatmap.objects[i].effect === 'Flick' || this.beatmap.objects[i].effect === 'SlideEndFlick_A' || this.beatmap.objects[i].effect === 'SlideEndFlick_B') {
              this.sound.play('flickS', { volume: this.pVolume })
            } else {
              this.sound.play('hihatS', { volume: this.pVolume })
            }
          }
          if (this.noteSprite[i].s2 !== null) {
            this.noteSprite[i].s2.depth = -1
          }
        }
      }
      if (this.noteSprite[i].s !== null && this.noteSprite[i].s.y >= this.cH - 200) {
        this.combo++
        this.noteSprite[i].isHit = true
        this.noteSprite[i].s.y = this.hitLineHeight
        this.noteSprite[i].s.depth = -1
        if (this.noteSprite[i].s2 !== null) {
          this.noteSprite[i].s2.depth = -1
        }
      }
    }
    // 计算滑条位置
    for (let i = 0; i < this.sliderSprite.length; i++) {
      if (this.noteSprite[this.sliderSprite[i].n2].isHit === true) {
        this.sliderSprite[i].s.depth = -1
      } else if (this.sliderSprite[i].startT <= this.totalT) {
        // 改变前置note位置
        if (this.beatmap.objects[this.sliderSprite[i].n1].timing <= this.totalT) {
          this.noteSprite[this.sliderSprite[i].n1].s.x = 50 + this.beatmap.objects[this.sliderSprite[i].n1].lane * 87.5 +
          (this.beatmap.objects[this.sliderSprite[i].n2].lane - this.beatmap.objects[this.sliderSprite[i].n1].lane) * 87.5 *
          ((this.totalT - this.beatmap.objects[this.sliderSprite[i].n1].timing) / (this.beatmap.objects[this.sliderSprite[i].n2].timing - this.beatmap.objects[this.sliderSprite[i].n1].timing))
        }
        // 改变滑条位置
        this.sliderSprite[i].s.depth = 1
        this.sliderSprite[i].s.bottomLeftX = this.noteSprite[this.sliderSprite[i].n1].s.x - this.noteSprite[this.sliderSprite[i].n1].s.displayWidth / 2 + 2
        this.sliderSprite[i].s.bottomLeftY = this.noteSprite[this.sliderSprite[i].n1].s.y
        this.sliderSprite[i].s.bottomRightX = this.noteSprite[this.sliderSprite[i].n1].s.x + this.noteSprite[this.sliderSprite[i].n1].s.displayWidth / 2 - 2
        this.sliderSprite[i].s.bottomRightY = this.noteSprite[this.sliderSprite[i].n1].s.y
        this.sliderSprite[i].s.topLeftX = this.noteSprite[this.sliderSprite[i].n2].s.x - this.noteSprite[this.sliderSprite[i].n2].s.displayWidth / 2 + 2
        this.sliderSprite[i].s.topLeftY = this.noteSprite[this.sliderSprite[i].n2].s.y
        this.sliderSprite[i].s.topRightX = this.noteSprite[this.sliderSprite[i].n2].s.x + this.noteSprite[this.sliderSprite[i].n2].s.displayWidth / 2 - 2
        this.sliderSprite[i].s.topRightY = this.noteSprite[this.sliderSprite[i].n2].s.y
      }
    }
  }
  countFPS () {
    this.lastT = this.nowT
    this.nowT = Date.now()
    this.sumT += this.nowT - this.lastT
    this.frame++
    if (this.sumT >= 499) {
      this.testText.text = this.cBGM.seek.toFixed(3) + '   ' + this.combo + '   ' + Math.floor(1000 / (this.sumT / this.frame)) + ' fps'
      this.frame = 0
      this.sumT = 0
    }
  }
}
