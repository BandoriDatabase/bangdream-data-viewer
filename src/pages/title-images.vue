<template>
  <q-page padding>
    <div style="margin-bottom: 30px;">
      <span class="q-display-2 text-bold">{{$t('left.gametitle')}}</span>
    </div>
    <viewer :images="imgs">
      <Waterfall :maxCol="3" :gutterWidth="15" :gutterHeight="5">
        <WaterfallItem v-for="src in imgs" :key="src" :width="$q.platform.is.mobile ? 350 : 465">
          <img v-lazy="src" class="game-title-img shadow-3" />
        </WaterfallItem>
      </Waterfall>
    </viewer>
    <!-- <viewer class="row gutter-sm" :images="imgs">
      <div class="col-lg-4 col-md-6 col-12" v-for="src in imgs" :key="src">
        <q-card>
          <q-card-media style="cursor: pointer;">
            <img v-lazy="src" class="game-title-img" />
          </q-card-media>
        </q-card>
      </div>
    </viewer> -->
    <q-inner-loading :visible="!isReady">
      <q-spinner color="pink" size="48px"></q-spinner>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { Waterfall, WaterfallItem } from 'vue2-waterfall'

export default {
  // name: 'PageName',
  components: {
    Waterfall,
    WaterfallItem
  },
  data () {
    return {
      isReady: false,
      imgs: []
    }
  },
  computed: {
    server () {
      return this.$route.params.server
    }
  },
  watch: {
    server (newVal) {
      this.isReady = false
      this.$nextTick(async () => {
        const titleList = (await this.$api.getTitles(newVal)).filter(elem => elem.type === 'directory')
        this.imgs = titleList.map(elem => `/assets-${newVal}/title/${elem.name}/title_bg.png`)
        this.isReady = true
      })
    }
  },
  async mounted () {
    this.isReady = false
    const titleList = (await this.$api.getTitles(this.server)).filter(elem => elem.type === 'directory')
    this.imgs = titleList.map(elem => `/assets-${this.server}/title/${elem.name}/title_bg.png`)
    this.isReady = true
  }
}
</script>

<style scoped lang="stylus">
.game-title-img
  width 100%
  cursor pointer
</style>
