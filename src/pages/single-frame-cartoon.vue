<template>
  <q-page padding>
    <div style="margin-bottom: 30px;">
      <span class="q-display-2 text-bold">{{$t('left.SFC')}}</span>
    </div>
    <viewer class="row gutter-sm" v-if="isReady" :options="{navbar: false, toolbar: false}">
      <div class="col-lg-4 col-xl-3 col-md-6 col-12" v-for="(singleFrame, idx) in sfcList[server]" :key="idx">
        <q-card style="cursor: pointer;">
          <q-card-media>
            <img v-lazy="singleFrame.assetAddress" class="single-frame-img" />
            <q-card-title slot="overlay">
              {{singleFrame.title}}
            </q-card-title>
          </q-card-media>
        </q-card>
      </div>
    </viewer>
    <q-spinner v-else color="pink" size="48px"></q-spinner>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  // name: 'PageName',
  data () {
    return {
      isReady: false
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getSFCList(this.server)
      this.isReady = true
    })
  },
  computed: {
    ...mapState('sfc', [
      'sfcList'
    ]),
    server () {
      return this.$route.params.server
    }
  },
  watch: {
    '$route.params.server': function () {
      this.isReady = false
      this.$nextTick(async () => {
        await this.getSFCList(this.server)
        this.isReady = true
      })
    }
  },
  methods: {
    ...mapActions('sfc', [
      'getSFCList'
    ])
  }
}
</script>

<style scoped lang="stylus">
.single-frame-img
  height 350px
</style>
