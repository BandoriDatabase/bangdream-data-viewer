/* eslint-disable no-unused-vars */
import { Scene } from 'phaser'

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
  // note
  noteSpriteInfo () {
  }
  noteSprite = []
  constructor () {
    super({ key: 'PlayScene' })
  }
  create () {
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
    for (let i = 0; i < this.beatmap.objects.length; i++) {
      let nSI = {
        s: null,
        startT: 0,
        runT: 0,
        isHit: false
      }
      if (this.beatmap.objects[i].type === 'Object' &&
      this.beatmap.objects[i].effect === 'Single' &&
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
        nSI.startT = this.beatmap.objects[i].timing - 2000 / 1000
      }
      this.noteSprite[i] = nSI
    }
    // word
    this.testText = this.add.text(20, 15, 'FPS：计算中...', {
      fontStyle: '等线',
      fill: '#fff',
      fontSize: 100 + 'px'
    })
    // init time
    this.startT = Date.now()
    this.nowT = this.startT
  }
  countTime () {
    this.lastT = this.nowT// 保存当前时间
    this.nowT = Date.now()// 获取当前时间
    this.totalT = this.nowT - this.startT // 计算经过时间
    this.sumT += this.nowT - this.lastT
    this.frame++// 帧片数++
  }
  k =false
  update () {
    this.countTime()
    this.testText.text = (this.totalT / 1000).toFixed(3) + '    ' + this.combo
    if (!this.k) {
      console.log(this.noteSprite.length)
      this.k = true
    }
    let k = 2.42
    let speed = 0.175
    // hit note
    for (let i = 0; i < this.noteSprite.length; i++) {
      // console.log(this.beatmap.objects[i])
      if (this.noteSprite[i].isHit === false && this.beatmap.objects[i].type === 'Object') {
        if (this.noteSprite[i].s !== null && (this.totalT / 1000) >= this.noteSprite[i].startT) {
          this.noteSprite[i].s.displayWidth = 8 + 2 * (this.noteSprite[i].s.y - 100) / 10
          this.noteSprite[i].s.displayHeight = 4 + 1 * (this.noteSprite[i].s.y - 100) / 10
          switch (this.beatmap.objects[i].lane) {
            case 1:
              this.noteSprite[i].s.x -= 3 * k * this.noteSprite[i].runT * speed
              break
            case 2:
              this.noteSprite[i].s.x -= 2 * k * this.noteSprite[i].runT * speed
              break
            case 3:
              this.noteSprite[i].s.x -= k * this.noteSprite[i].runT * speed
              break
            case 4:
              break
            case 5:
              this.noteSprite[i].s.x += k * this.noteSprite[i].runT * speed
              break
            case 6:
              this.noteSprite[i].s.x += 2 * k * this.noteSprite[i].runT * speed
              break
            case 7:
              this.noteSprite[i].s.x += 3 * k * this.noteSprite[i].runT * speed
              break
          }
          this.noteSprite[i].s.y += 10 * this.noteSprite[i].runT * speed
          this.noteSprite[i].s.depth = 2
          this.noteSprite[i].runT = this.totalT / 1000 - this.noteSprite[i].startT
        }
        if (this.noteSprite[i].s !== null && this.beatmap.objects[i].timing <= this.totalT / 1000) {
          this.combo++
          // eslint-disable-next-line no-unused-expressions
          this.noteSprite[i].isHit = true
          this.noteSprite[i].s.depth = -1
        }
      }
    }
  }
}
