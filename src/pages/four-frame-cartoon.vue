<template>
  <q-page padding>
    <div style="margin-bottom: 30px;">
      <span class="text-h3 text-bold">{{$t('left.FFC')}}</span>
    </div>
    <div class="q-mb-md">
      {{$t('common.sort.title')}}
      <q-btn-toggle :value="queryParams.sort" @input="onSortChange"
      :options="[{ label: $t('common.sort.asc'), value: 'asc' }, { label: $t('common.sort.desc'), value: 'desc' }]"></q-btn-toggle>
    </div>
    <viewer v-if="isReady" ref="fourframe" :options="{navbar: false}">
      <q-infinite-scroll ref="ffcScroll" @load="loadMore">
        <div class="row q-col-gutter-sm">
          <div class="col-md-6 col-12" v-for="(fourFrame, idx) in ffcList[server]" :key="idx">
            <q-card class="cursor-pointer" @click="$refs.fourframe.$viewer.view(idx)">
              <q-card-section>
                <img v-show="false" :src="fourFrame.assetAddress" />
                <my-q-img height="250px" :src="fourFrame.assetAddress">
                  <template v-slot:loading>
                    <q-skeleton type="rect" width="250px" height="250px" />
                  </template>
                  <div class="absolute-bottom text-subtitle2 text-center">{{fourFrame.title}}</div>
                  <!-- <div class="absolute-bottom text-subtitle2 text-center">{{fourFrame.subTitle}}</div> -->
                </my-q-img>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <template v-slot:loading>
          <div class="row q-col-gutter-md q-mt-xs">
            <div v-for="i in 2" :key="`skel-${i}`" class="col-12 col-md-6">
              <q-card>
                <q-card-section class="row justify-center">
                  <q-skeleton type="rect" width="250px" height="250px" />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </template>
      </q-infinite-scroll>
    </viewer>
    <div class="row q-col-gutter-sm" v-else>
      <div class="col-md-6 col-12" v-for="i in 12" :key="`skel-${i}`">
        <q-card>
          <q-card-section class="row justify-center">
            <q-skeleton type="rect" width="250px" height="250px" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  // name: 'PageName',
  data () {
    return {
      isReady: false,
      queryParams: { limit: 12, page: 1, sort: this.$q.localStorage.getItem('ffc.sort') || 'asc' }
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getFFCList({ server: this.server, params: this.queryParams })
      this.isReady = true
      document.title = `${this.$t('left.FFC')} | Bandori Top`
    })
  },
  computed: {
    ...mapState('ffc', [
      'ffcList'
    ]),
    server () {
      return this.$route.params.server
    }
  },
  watch: {
    '$route.params.server': function () {
      this.isReady = false
      this.queryParams = { limit: 12, page: 1, sort: this.$q.localStorage.getItem('ffc.sort') || 'asc' }
      this.$nextTick(async () => {
        await this.getFFCList({ server: this.server, params: this.queryParams })
        this.isReady = true
        document.title = `${this.$t('left.FFC')} | Bandori Top`
      })
    }
  },
  methods: {
    ...mapActions('ffc', [
      'getFFCList',
      'clearFFCList'
    ]),
    async loadMore (index, done) {
      try {
        // this.infiniteLoading = true
        this.queryParams.page += 1
        await this.getFFCList({ server: this.server, params: this.queryParams })
        // this.infiniteLoading = false
      } catch (error) {
        console.log('no more cards', error)
        this.$refs.ffcScroll.stop()
      } finally {
        done()
      }
    },
    onSortChange (value) {
      this.$q.localStorage.set('ffc.sort', value)
      this.queryParams.sort = value
      this.clearFFCList(this.server)
      this.isReady = false
      this.getFFCList({ server: this.server, params: this.queryParams }).then(() => { this.isReady = true })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
