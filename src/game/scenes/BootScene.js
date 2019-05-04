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
  }

  create () {
    this.scene.start('PlayScene')
  }
}
