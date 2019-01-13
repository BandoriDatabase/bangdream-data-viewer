<template>
  <q-page padding>
    <div style="margin-bottom: 30px;">
      <span class="q-display-2 text-bold">{{$t('left.gametitle')}}</span>
    </div>
    <viewer class="row gutter-sm" :images="imgs">
      <div class="col-lg-4 col-md-6 col-12" v-for="src in imgs" :key="src">
        <q-card>
          <q-card-media style="cursor: pointer;">
            <img v-lazy="src" class="game-title-img" />
          </q-card-media>
        </q-card>
      </div>
    </viewer>
    <q-inner-loading :visible="!isReady">
      <q-spinner color="pink" size="48px"></q-spinner>
    </q-inner-loading>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      isReady: false,
      imgs: []
    }
  },
  async mounted () {
    this.isReady = false
    const titleList = (await this.$api.getTitles()).filter(elem => elem.type === 'directory')
    this.imgs = titleList.map(elem => `/assets/title/${elem.name}/title_bg.png`)
    this.isReady = true
  }
}
</script>

<style scoped lang="stylus">
.game-title-img
  height 360px
</style>
