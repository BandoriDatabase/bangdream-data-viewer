<template>
  <div v-if="isGcahaReady" class="row gutter-sm">
    <!-- <div class="col-12">
      {{$t('gacha.list-title', { srv: $t(`common.${server}`) })}}
      {{$t('gacha.list-count')}}: {{currentGachaList[server].length}}
    </div> -->
    <div class="col-xl-4 col-md-6 col-12" v-for="gacha in currentGachaList[server]" :key="gacha.seq">
      <q-card inline>
        <q-card-title class="bg-pink text-white">
          {{gacha.gachaName}}
        </q-card-title>
        <q-card-media>
          <img v-lazy="`/assets-${server}/gacha/screen/${gacha.resourceName}_logo.png`" class="responsive" />
        </q-card-media>
        <q-card-main>
          <h5 class="q-my-sm" v-if="Number(gacha.publishedAt) > Date.now()">{{$t('not-started')}}<br>{{(new Date(Number(gacha.publishedAt))).toLocaleString()}}</h5>
          <count-down :target-time="Number(gacha.closedAt)" v-else></count-down>
        </q-card-main>
        <q-card-separator />
        <q-card-actions>
          <q-btn flat class="text-pink"
            @click="$emit('open-modal', gacha)"
            icon="launch"
          >{{$t('gacha.open-detail')}}</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
  <div v-else>
    <p>{{$t('fetch-data', { type: $t('common.gacha') })}}</p>
    <p>{{$t('gacha.list-count')}} {{$t('fetch-data', { type: $t('common.gacha') })}}</p>
    <q-spinner color="pink" size="48px"></q-spinner>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CountDown from 'components/common/countdown'

export default {
  // name: 'ComponentName',
  props: ['server'],
  data () {
    return {
      isGcahaReady: false
    }
  },
  components: {
    CountDown
  },
  computed: {
    ...mapState('gacha', [
      'currentGachaList'
    ])
  },
  mounted () {
    this.loadData()
  },
  methods: {
    ...mapActions('gacha', [
      'getGachaCurrent'
    ]),
    loadData () {
      this.$nextTick(async () => {
        await this.getGachaCurrent(this.server)
        this.isGcahaReady = true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
