<template>
  <music v-if="isReady" :data="musicMap[$route.params.musicId]"></music>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Music from './common/Music'

export default {
  name: 'musicDetailComponent',
  components: {
    Music
  },
  data () {
    return {
      isReady: false,
      currDiffi: {}
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getMusicById(this.$route.params.musicId)
      this.isReady = true
    })
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
  }
}
</script>

<style lang="stylus">

</style>
