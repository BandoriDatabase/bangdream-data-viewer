import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import PlayScene from './scenes/PlayScene'

// eslint-disable-next-line no-unused-vars
let beatmap = null

function launch () {
  // eslint-disable-next-line no-unused-vars
  let beatmap1 = this.beatmap
  // eslint-disable-next-line no-unused-vars
  let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    beatmap: beatmap1,
    scene: [BootScene, PlayScene]
  })
  window.name = JSON.stringify(beatmap1)
}

export default launch
export { launch }
