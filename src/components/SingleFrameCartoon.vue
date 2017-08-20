<template>
  <section>
    <div class="row sm-column md-column gutter" v-for="(singleFrames, idx) in gallery" :key="idx">
      <div class="width-1of3" v-for="frame in singleFrames" :key="frame.singleFrameCartoonId">
        <div class="card">
          <div class="card-title bg-pink text-white">
            {{frame.title}}
          </div>
          <div class="card-content card-force-top-padding">
            <img v-lazy="frame.assetAddress" class="responsive">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('DB', [
      'singleFrameCartoons'
    ]),
    gallery () {
      if (!this.singleFrameCartoons) return []
      return this.singleFrameCartoons.map(elem => {
        elem.assetAddress = `https://bangdream.ga/hotlink-ok/assets/loading/downloading_${elem.assetBundleName}.png`
        return elem
      }).reduce((prev, curr, currIdx) => {
        const prevIdx = Math.trunc(currIdx / 3)
        if (!prev[prevIdx]) prev[prevIdx] = []
        prev[prevIdx].push(curr)
        return prev
      }, [])
    }
  }
}
</script>

<style>
</style>
