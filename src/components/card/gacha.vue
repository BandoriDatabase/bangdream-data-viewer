<template>
  <div>
    <q-card>
      <q-banner class="bg-pink text-white">
        <div class="text-subtitle1">{{data.gachaName}}</div>
      </q-banner>
      <div class="gacha-img" v-lazy:background-image="`/assets-${server}/gacha/screen/${data.resourceName}_rip/logo.png`"></div>
      <q-card-section>
        <h5 class="q-my-xs"
            v-if="Number(data.publishedAt) > Date.now()">{{$t('not-started')}}<br>{{(new Date(Number(data.publishedAt))).toLocaleString()}}</h5>
        <count-down :target-time="Number(data.closedAt)"
                    v-else></count-down>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn flat
               class="text-pink"
               @click="$emit('open-modal')"
               icon="launch">{{$t('gacha.open-detail')}}</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import CountDown from 'components/common/countdown'

export default {
  // name: 'ComponentName',
  props: ['data', 'server'],
  data () {
    return {
      isGcahaReady: false
    }
  },
  components: {
    CountDown
  }
}
</script>

<style lang="stylus" scoped>
.gacha-img {
  height: 140px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
