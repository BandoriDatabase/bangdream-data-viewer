<template>
  <q-page padding>
    <div class="row gutter-sm" v-if="isReady">
      <div class="col-xl-2 col-lg-3 col-md-4 col-4" v-for="(singleStamp, idx) in stampList[server]" :key="idx">
        <q-card class="stamp-img" v-lazy:background-image="`/assets-${server}/stamp/01_rip/${singleStamp.imageName}.png`"></q-card>
      </div>
    </div>
    <q-spinner v-else color="pink" size="48px"></q-spinner>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      isReady: false
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getStampList(this.server)
      this.isReady = true
    })
  },
  computed: {
    ...mapState('stamp', [
      'stampList'
    ]),
    server () {
      return this.$route.params.server
    }
  },
  watch: {
    '$route.params.server': function () {
      this.isReady = false
      this.$nextTick(async () => {
        await this.getStampList(this.server)
        this.isReady = true
      })
    }
  },
  methods: {
    ...mapActions('stamp', [
      'getStampList'
    ])
  }
}
</script>

<style scoped lang="stylus">
.stamp-img
  position relative
  width 100%
  padding-top 82.5%
  background-size contain
  background-repeat no-repeat
</style>
