<template>
  <div>
    <p>{{$t('hint[0]')}} <span class="desktop-only">{{$t('hint[1]')}}</span><span class="mobile-only">{{$t('hint[2]')}}</span>{{$t('hint[3]')}}</p>
    <div class="row sm-column md-column" v-if="isReady">
      <div class="col-lg-4 col-xl-3 col-md-6 col-12" v-for="(singleFrame, idx) in sfcList" :key="idx">
        <q-card>
          <q-card-media>
            <img v-lazy="singleFrame.assetAddress" class="single-frame-img preview-img"
              @click="$preview.open(idx, previewGallery, {
                fullscreenEl: true,
                zoomEl: true,
                shareEl: true,
                history: false
              })" />
            <q-card-title slot="overlay">
              {{singleFrame.title}}
            </q-card-title>
          </q-card-media>
        </q-card>
      </div>
    </div>
    <q-spinner v-else color="pink" size="48px"></q-spinner>
  </div>
</template>

<i18n>
{
  "en": {
    "hint": [
      "Hint:",
      "Click",
      "Touch",
      " to open large picture"
    ]
  },
  "zh-CN": {
    "hint": [
      "提示：",
      "点击",
      "触摸",
      "可以查看大图"
    ]
  },
  "zh-TW": {
    "hint": [
      "提示：",
      "點擊",
      "觸摸",
      "可以查看大圖"
    ]
  }
}
</i18n>

<script>
import {
  QCard,
  QCardTitle,
  QCardMedia,
  QSpinner
} from 'quasar'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    QCard,
    QCardTitle,
    QCardMedia,
    QSpinner
  },
  data () {
    return {
      isReady: false,
      previewGallery: []
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getSFCList()
      this.previewGallery = this.sfcList.map(elem => ({
        src: elem.assetAddress,
        title: elem.title,
        w: 800,
        h: 640
      }))
      this.isReady = true
    })
  },
  computed: {
    ...mapState('sfc', [
      'sfcList'
    ])
  },
  methods: {
    ...mapActions('sfc', [
      'getSFCList'
    ])
  }
}
</script>

<style lang="stylus" scoped>
</style>
