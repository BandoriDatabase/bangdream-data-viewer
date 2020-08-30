import { Scene } from 'phaser'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }
  /**
   * please load src here
   */
  preload () {
    this.load.image('bg', 'assets/liveBG_normal.png')
    this.load.image('bgR', 'assets/bg_line_rhythm.png')
    this.load.image('bgHL', 'assets/game_play_line.png')
    this.load.image('noteN1', 'assets/note/note_normal_1.png')
    this.load.image('noteN2', 'assets/note/note_normal_2.png')
    this.load.image('noteN3', 'assets/note/note_normal_3.png')
    this.load.image('noteN4', 'assets/note/note_normal_4.png')
    this.load.image('noteN5', 'assets/note/note_normal_5.png')
    this.load.image('noteN6', 'assets/note/note_normal_6.png')
    this.load.image('noteN7', 'assets/note/note_normal_7.png')
    this.load.image('noteS1', 'assets/note/note_slider_1.png')
    this.load.image('noteS2', 'assets/note/note_slider_2.png')
    this.load.image('noteS3', 'assets/note/note_slider_3.png')
    this.load.image('noteS4', 'assets/note/note_slider_4.png')
    this.load.image('noteS5', 'assets/note/note_slider_5.png')
    this.load.image('noteS6', 'assets/note/note_slider_6.png')
    this.load.image('noteS7', 'assets/note/note_slider_7.png')
    this.load.image('noteU1', 'assets/note/note_up_1.png')
    this.load.image('noteU2', 'assets/note/note_up_2.png')
    this.load.image('noteU3', 'assets/note/note_up_3.png')
    this.load.image('noteU4', 'assets/note/note_up_4.png')
    this.load.image('noteU5', 'assets/note/note_up_5.png')
    this.load.image('noteU6', 'assets/note/note_up_6.png')
    this.load.image('noteU7', 'assets/note/note_up_7.png')
    this.load.image('longNL', 'assets/note/longNoteLine.png')
    this.load.image('upImg', 'assets/note/up.png')
    this.load.image('sliderP', 'assets/note/slider_point.png')
    this.load.audio('BGM', window.name2)
    this.load.audio('flickS', 'flick.mp3')
    this.load.audio('hihatS', 'hihat.wav')
  }

  create () {
    this.scene.start('PlayScene')
  }
}
