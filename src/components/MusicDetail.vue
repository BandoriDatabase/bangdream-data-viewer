<template>
  <div>
    <music v-if="isReady" :data="musicMap[server][$route.params.musicId]"></music>
    <q-spinner v-else color="pink" size="48px"></q-spinner>
  </div>
</template>

<script>
import {
  QSpinner
} from 'quasar'
import { mapState, mapActions } from 'vuex'
import Music from './common/Music'

export default {
  name: 'musicDetailComponent',
  components: {
    Music,
    QSpinner
  },
  data () {
    return {
      isReady: false,
      currDiffi: {}
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getMusicById({musicId: this.$route.params.musicId, server: this.server})
      this.isReady = true
    })
  },
  computed: {
    ...mapState('music', [
      'musicMap'
    ]),
    server () {
      return this.$route.params.server
    }
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
