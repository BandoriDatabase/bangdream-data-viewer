<template>
  <div id="game-container" v-if="downloaded" />
  <div v-else>
    Downloading /api/v1/jp/music/chart/175/expert ...
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Game',
  data () {
    return {
      downloaded: false,
      data: {},
      difficultyOptions: 'expert'
    }
  },
  computed: {
    ...mapState('music', [
      'musicMap'
    ])
  },
  methods: {
    ...mapActions('music', [
      'getMusicById'
    ])
  },
  async mounted () {
    this.server = `jp`
    await this.getMusicById({ musicId: 175, server: this.server })
    this.data = this.musicMap.jp[175]
    // console.log(this.data.bgmFile)
    /*
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
    ] */
    import('../game/game').then(game => {
      this.$http.get('/api/v1/jp/music/chart/175/expert')
        .then(res => {
          game.beatmap = res
          game.bgm = this.data.bgmFile
          this.downloaded = true
          this.$nextTick(() => game.launch())
        })
    })
  }
}
</script>
