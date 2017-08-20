<template>
  <div>
    <p>Hint: <span class="desktop-only">Click</span><span class="mobile-only">Touch</span> and open large picture</p>
    <div class="row sm-column md-column">
      <q-card class="col-lg-3 col-xl-3 col-12" v-for="(singleFrame, idx) in gallery" :key="idx">
        <q-card-media>
          <img v-lazy="singleFrame.assetAddress" class="responsive preview-img"
            @click="$preview.open(idx, previewGallery, {
              fullscreenEl: true,
              zoomEl: true,
              shareEl: true
            })" />
          <q-card-title slot="overlay">
            {{singleFrame.title}}
          </q-card-title>
        </q-card-media>
      </q-card>
    </div>
  </div>
</template>

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
        elem.assetAddress = `https://bangdream.ga/hotlink-ok/assets/loading/downloading_${elem.assetBundleName}.png`
        return elem
      })
    },
    previewGallery () {
      // for photoswipe
      if (!this.singleFrameCartoons) return []
      return this.singleFrameCartoons.map(elem => ({
        src: `https://bangdream.ga/hotlink-ok/assets/loading/downloading_${elem.assetBundleName}.png`,
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
