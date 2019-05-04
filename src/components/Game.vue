<template>
  <div id="game-container" v-if="downloaded" />
  <div v-else>
    Downloading ...
  </div>
</template>

<script>
export default {
  name: 'Game',
  data () {
    return {
      downloaded: false
    }
  },
  mounted () {
    import('../game/game').then(game => {
      this.$http.get('/api/v1/jp/music/chart/100/hard')
        .then(res => {
          game.beatmap = res
          this.downloaded = true
          this.$nextTick(() => game.launch())
        })
    })
  }
}
</script>
