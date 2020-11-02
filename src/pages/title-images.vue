<template>
  <q-page padding>
    <div style="margin-bottom: 30px;">
      <span class="text-h3 text-bold">{{$t('left.gametitle')}}</span>
    </div>
    <viewer :images="imgs">
      <Waterfall :maxCol="3" :gutterWidth="15" :gutterHeight="5">
        <WaterfallItem v-for="src in imgs" :key="src" :width="$q.platform.is.mobile ? 350 : 465">
          <img v-lazy="src" class="game-title-img shadow-3" />
        </WaterfallItem>
      </Waterfall>
    </viewer>
    <p class="text-h5" v-if="isReady && !imgs.length">{{$t('title-images.failed-load')}}</p>
    <q-inner-loading :showing="!isReady">
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
        try {
          const titleList = (await this.$api.getTitles(this.server)).filter(elem => elem.type === 'directory')
          this.imgs = titleList.map(elem => `/assets/${this.server}/title/${elem.name}/title_bg.webp`)
        } catch (error) {
          this.imgs = []
        }
        this.isReady = true
      })
    }
  },
  async mounted () {
    this.isReady = false
    try {
      const titleList = (await this.$api.getTitles(this.server)).filter(elem => elem.type === 'directory')
      this.imgs = titleList.map(elem => `/assets/${this.server}/title/${elem.name}/title_bg.webp`)
    } catch (error) {
      this.imgs = []
    }
    this.isReady = true
  }
}
</script>

<style scoped lang="stylus">
.game-title-img
  width 100%
  cursor pointer
</style>
