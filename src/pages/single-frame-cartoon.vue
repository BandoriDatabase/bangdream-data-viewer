<template>
  <q-page padding>
    <div style="margin-bottom: 30px;">
      <span class="text-h3 text-bold">{{$t('left.SFC')}}</span>
    </div>
    <div class="row q-col-gutter-sm" v-if="isReady" :options="{navbar: false, toolbar: false}">
      <div class="col-lg-4 col-xl-3 col-md-6 col-12" v-for="(singleFrame, idx) in sfcList[server]" :key="idx">
        <q-card style="cursor: pointer;" @click="openURL(singleFrame.assetAddress)">
          <q-card-section v-bind:title="singleFrame.title">
            <q-img :src="singleFrame.assetAddress">
              <div class="single-frame-img-title-f absolute-bottom text-subtitle2 text-center">{{singleFrame.title}}</div>
            </q-img>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-spinner v-else color="pink" size="48px"></q-spinner>
  </q-page>
</template>

<script>
import { openURL } from 'quasar'
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
    ]),
    openURL
  }
}
</script>

<style scoped lang="stylus">
.single-frame-img-title
  padding 1% 5% 2% 5%
  background-color rgba(0,0,0,0.5)
.single-frame-img-title-f
  font-size 15px
  width 90%
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
</style>
