<template>
  <div>
    <music v-if="isReady" :data="musicMap[$route.params.musicId]"></music>
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
