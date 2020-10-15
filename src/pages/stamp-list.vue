<template>
  <q-page padding>
    <div style="margin-bottom: 30px;">
      <span class="text-h3 text-bold">{{$t('left.stamp')}}</span>
    </div>
    <div class="q-mb-md">
      {{$t('common.sort.title')}}
      <q-btn-toggle :value="queryParams.sort" @input="onSortChange"
      :options="[{ label: $t('common.sort.asc'), value: 'asc' }, { label: $t('common.sort.desc'), value: 'desc' }]"></q-btn-toggle>
    </div>
    <viewer v-if="isReady" ref="stamp-viewer" :options="{navbar: false}">
      <q-infinite-scroll ref="stampScroll" @load="loadMore">
        <div class="row q-col-gutter-sm">
          <div class="col-md-3 col-6" v-for="(singleStamp, idx) in stampList[server]" :key="idx">
            <img v-show="false" :src="`/assets/${server}/stamp/01_rip/${singleStamp.imageName}.webp`" />
            <q-card class="cursor-pointer" @click="$refs['stamp-viewer'].$viewer.view(idx)">
              <my-q-img style="min-height: 120px;" contain :src="`/assets/${server}/stamp/01_rip/${singleStamp.imageName}.webp`">
                <template v-slot:loading>
                  <q-skeleton type="rect" width="100px" height="100px" />
                </template>
              </my-q-img>
            </q-card>
          </div>
        </div>
        <template v-slot:loading>
          <div class="row q-col-gutter-sm">
            <div class="col-md-3 col-6" v-for="i in 4" :key="`skel-${i}`">
              <q-card>
                <q-card-section class="row justify-center">
                  <q-skeleton type="rect" width="100px" height="100px" />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </template>
      </q-infinite-scroll>
    </viewer>
    <div class="row q-col-gutter-sm" v-else>
      <div class="col-md-3 col-6" v-for="i in 12" :key="`skel-${i}`">
        <q-card>
          <q-card-section class="row justify-center">
            <q-skeleton type="rect" width="100px" height="100px" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      isReady: false,
      queryParams: { limit: 12, page: 1, sort: this.$q.localStorage.getItem('stamps.sort') || 'asc' }
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getStampList({ server: this.server, params: this.queryParams })
      this.isReady = true
    })
  },
  computed: {
    ...mapState('stamp', [
      'stampList'
    ]),
    server () {
      return this.$route.params.server
    }
  },
  watch: {
    '$route.params.server': function () {
      this.isReady = false
      this.queryParams = { limit: 12, page: 1, sort: this.$q.localStorage.getItem('stamps.sort') || 'asc' }
      this.$nextTick(async () => {
        await this.getStampList({ server: this.server, params: this.queryParams })
        this.isReady = true
      })
    }
  },
  methods: {
    ...mapActions('stamp', [
      'getStampList',
      'clearStampList'
    ]),
    async loadMore (index, done) {
      try {
        // this.infiniteLoading = true
        this.queryParams.page += 1
        await this.getStampList({ server: this.server, params: this.queryParams })
        // this.infiniteLoading = false
      } catch (error) {
        console.log('no more cards', error)
        this.$refs.stampScroll.stop()
      } finally {
        done()
      }
    },
    onSortChange (value) {
      this.$q.localStorage.set('stamps.sort', value)
      this.queryParams.page = 1
      this.queryParams.sort = value
      this.clearStampList(this.server)
      this.isReady = false
      this.getStampList({ server: this.server, params: this.queryParams }).then(() => { this.isReady = true })
    }
  }
}
</script>

<style scoped lang="stylus">
.stamp-img
  position relative
  width 100%
  padding-top 82.5%
  background-size contain
  background-repeat no-repeat
</style>
