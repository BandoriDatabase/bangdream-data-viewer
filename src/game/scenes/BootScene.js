import { Scene } from 'phaser'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }
  /**
   * please load src here
   */
  preload () {
    this.load.image('bg', 'statics/assets/liveBG_normal.png')
    this.load.image('bgR', 'statics/assets/bg_line_rhythm.png')
    this.load.image('bgHL', 'statics/assets/game_play_line.png')
    this.load.image('noteN1', 'statics/assets/note/note_normal_1.png')
    this.load.image('noteN2', 'statics/assets/note/note_normal_2.png')
    this.load.image('noteN3', 'statics/assets/note/note_normal_3.png')
    this.load.image('noteN4', 'statics/assets/note/note_normal_4.png')
    this.load.image('noteN5', 'statics/assets/note/note_normal_5.png')
    this.load.image('noteN6', 'statics/assets/note/note_normal_6.png')
    this.load.image('noteN7', 'statics/assets/note/note_normal_7.png')
  }

  create () {
    this.scene.start('PlayScene')
  }
}
