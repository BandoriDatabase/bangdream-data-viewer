<template>
  <div>
    <p>{{$t('hint[0]')}} <span class="desktop-only">{{$t('hint[1]')}}</span><span class="mobile-only">{{$t('hint[2]')}}</span>{{$t('hint[3]')}}</p>
    <div class="row sm-column md-column">
      <div class="col-lg-4 col-xl-3 col-md-6 col-12" v-for="(singleFrame, idx) in gallery" :key="idx">
        <q-card>
          <q-card-media>
            <img v-lazy="singleFrame.assetAddress" class="responsive preview-img"
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
  QCardMedia
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: {
    QCard,
    QCardTitle,
    QCardMedia
  },
  computed: {
    ...mapGetters('DB', [
      'singleFrameCartoons'
    ]),
    gallery () {
      if (!this.singleFrameCartoons) return []
      return this.singleFrameCartoons.map(elem => {
        elem.assetAddress = `/assets/loading/downloading_${elem.assetBundleName}.png`
        return elem
      })
    },
    previewGallery () {
      // for photoswipe
      if (!this.singleFrameCartoons) return []
      return this.singleFrameCartoons.map(elem => ({
        src: `/assets/loading/downloading_${elem.assetBundleName}.png`,
        title: elem.title,
        w: 800,
        h: 640
      }))
    }
  }
}
</script>

<style>
</style>
