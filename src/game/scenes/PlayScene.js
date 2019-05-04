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
  isHit = []
  combo = 0
  constructor () {
    super({ key: 'PlayScene' })
  }
  create () {
    // get beatmap
    this.beatmap = JSON.parse(window.name).body
    this.isHit = new Array(this.beatmap.metadata.combo)
    for (let i = 0; i < this.isHit.length; i++) { this.isHit[i] = false }
    console.log(this.beatmap, this.isHit.length)
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
    this.testText.text = this.totalT + '    ' + this.combo
    if (!this.k) {
      console.log(this.isHit.length)
      this.k = true
    }
    // hit note
    for (let i = 0; i < this.isHit.length; i++) {
      // console.log(this.beatmap.objects[i])
      if (this.beatmap.objects[i].type === 'Object' && this.isHit[i] === false) {
        if (this.beatmap.objects[i].timing <= this.totalT / 1000) {
          this.combo++
          // eslint-disable-next-line no-unused-expressions
          this.isHit[i] = true
        }
      }
    }
  }
}
