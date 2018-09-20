<template>
  <q-page padding>
    <div style="margin-bottom: 10px;">
      <span class="q-display-2 text-bold">{{$t('left.music')}}</span>
      <q-btn :label="$t('common.filter')" style="margin-left: 10px;" class="float-right" @click="isFilterVisible = true"></q-btn>
    </div>
    <q-modal v-model="isFilterVisible" :content-css="{padding: '15px', maxWidth: '500px'}">
      <div>
        <div class="row">
          <p class="col-12">{{$t('music.select-band')}}</p>
          <q-checkbox color="pink" class="col-md-4 col-6" v-model="selectBandId" v-for="opt in bandOption" :key="opt.value" :val="opt.value" :label="opt.label"></q-checkbox>
        </div>
        <div class="q-mt-md">
          <p>{{$t('music.tag')}}</p>
          <div>
            <q-radio color="pink" v-model="selectTag" val="anime" :label="$t('common.anime')" />
            <q-radio color="pink" v-model="selectTag" val="normal" :label="$t('common.normal')" />
            <q-radio color="pink" v-model="selectTag" val="all" :label="$t('common.all')" />
          </div>
        </div>
        <p class="q-mt-md">{{$t('common.sort.title')}}</p>
        <div>
          <q-radio color="pink" v-model="sortParam" val="asc" :label="$t('common.sort.asc')" />
          <q-radio color="pink" v-model="sortParam" val="desc" :label="$t('common.sort.desc')" />
        </div>
        <div>
          <q-radio color="pink" v-model="orderKey" val="musicId" label="ID" />
          <!-- <q-radio color="pink" v-model="orderKey" val="bandId" :label="$t('common.band')" /> -->
          <q-radio color="pink" v-model="orderKey" val="maxDifficilty" :label="$t('common.difficulty')" />
          <q-radio color="pink" v-model="orderKey" val="publishedAt" :label="$t('common.release-date')" />
        </div>
        <div>
          <q-btn color="pink" @click="doFilter(server), saveFilter(), isFilterVisible = false">{{$t('common.apply-save')}}</q-btn>
        </div>
      </div>
    </q-modal>
    <q-infinite-scroll ref="musicScroll" v-if="isReady" :handler="loadMore">
      <div class="row">
        <div class="col-xl-4 col-md-6 col-sm-12 col-12" v-for="music in musicList" :key="music.cardId">
          <div class="row music">
            <q-card class="music-cover col-xl-6 col-md-6 col-sm-4 col-4" @click.native="$router.push(`/music/${server}/${music.musicId}`)" v-lazy:background-image="music.jacket">
            </q-card>
            <div class="music-desc col-xl-6 col-md-6 col-sm-8 col-8">
              <p class="music-title">{{music.title}}</p>
              <p class="music-band-name">{{music.bandName}}</p>
              <p class="music-publish">{{(new Date(Number(music.publishedAt))).toLocaleString()}}</p>
              <div class="music-levels">
                <span class="music-level music-level-easy">{{music.difficulty[0]}}</span>
                <span class="music-level music-level-normal">{{music.difficulty[3]}}</span>
                <span class="music-level music-level-hard">{{music.difficulty[2]}}</span>
                <span class="music-level music-level-expert">{{music.difficulty[1]}}</span>
                <span v-if="music.difficulty[4]" class="music-level music-level-special">{{music.difficulty[4]}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="message" class="row justify-center items-center" style="margin-bottom: 50px;">
        <q-spinner color="pink" size="48px"></q-spinner>
        Loading more musics...
      </div>
    </q-infinite-scroll>
    <q-inner-loading :visible="!isReady">
      <q-spinner color="pink" size="48px"></q-spinner>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
import { mapState, mapActions } from 'vuex'

export default {
  // name: 'PageName',
  data () {
    return {
      isReady: false,
      isFilterVisible: false,
      selectBandId: [],
      bandOption: [],
      musicList: [],
      queryParams: {limit: 12, page: 1},
      orderKey: 'publishedAt',
      sortParam: 'desc',
      selectTag: 'all'
    }
  },
  mounted () {
    this.updateData(this.server)
  },
  computed: {
    ...mapState('band', [
      'bandList'
    ]),
    server () {
      return this.$route.params.server
    }
  },
  methods: {
    ...mapActions('band', [
      'getBandList'
    ]),
    async updateData (server) {
      this.isReady = false
      if (!LocalStorage.get.item(`musicfilter.${server}`)) LocalStorage.set(`musicfilter.${server}`, {})
      this.selectBandId = LocalStorage.get.item(`musicfilter.${server}`).bandId || []
      this.sortParam = LocalStorage.get.item(`musicfilter.${server}`).sort || 'desc'
      this.orderKey = LocalStorage.get.item(`musicfilter.${server}`).orderKey || 'publishedAt'
      this.selectTag = LocalStorage.get.item(`musicfilter.${server}`).tag || 'all'
      await this.doFilter(server)
      await this.getBandList(server)
      this.bandOption = this.bandList[server].map(elem => ({
        label: elem.bandName,
        value: elem.bandId
      }))
      this.isReady = true
    },
    async getMusicList (params, server) {
      // console.log(params)
      this.musicList = this.musicList.concat((await this.$api.getMusic(params, server)).data)
    },
    async doFilter (server) {
      this.isReady = false
      this.queryParams = {
        limit: 12,
        page: 1,
        bandId: this.selectBandId,
        sort: this.sortParam,
        orderKey: this.orderKey,
        tag: this.selectTag
      }
      if (this.$refs.musicScroll) this.$refs.musicScroll.reset()
      try {
        this.musicList = (await this.$api.getMusic(this.queryParams, server)).data
      } catch (e) {
        this.musicList = []
      }
      this.isReady = true
    },
    saveFilter () {
      LocalStorage.set(`musicfilter.${this.server}`, {
        bandId: this.selectBandId,
        sort: this.sortParam,
        orderKey: this.orderKey,
        tag: this.selectTag
      })
    },
    async loadMore (index, done) {
      try {
        this.queryParams.page += 1
        await this.getMusicList(this.queryParams, this.server)
        // this.doFilter()
      } catch (error) {
        console.log('no more musics')
        this.$refs.musicScroll.stop()
      } finally {
        done()
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.updateData(to.params.server)
    next()
  }
}
</script>

<style lang="stylus" scoped>
.filter
  margin-bottom 10px

.music
  position relative
  margin-bottom 30px

.music-cover
  position relative
  width 100%
  padding-top 50%
  cursor pointer
  background-size contain
  background-repeat no-repeat
  background-size 100% 100%

h3
  font-family -apple-system, PingFang, Helvetica
  font-weight bold

.music-desc p, .music-levels
  font-family -apple-system, PingFang, Helvetica
  margin-left 15px
  padding-right 15px

.music-title
  margin-top 15px
  font-weight 700
  font-size 120%
  line-height 120%

.music-band-name
  font-size 85%
  margin-top -10px
  color #888888

.music-levels
  position absolute
  bottom 11px

span.music-level
  display inline-block
  color white
  font-size 85%
  font-weight semi-bold
  width 32px
  height 20px
  border-radius 10px
  background red
  text-align center
  line-height 20px
  margin-right 4px
  margin-bottom 4px

@media screen and (max-width: 768px)
  .row.music
    margin-bottom 15px
  .music-cover
    position relative
    width 100%
    padding-top calc(100% / 3)
    cursor pointer
    background-size contain
    background-repeat no-repeat
    background-size 100% 100%
  .music-title
    margin-top 10px
    font-size 110%
    line-height 110%
  .music-band-name
    font-size 80%
  .music-levels
    bottom inherit
    margin-top -8px

span.music-level-easy
  background RGB(68, 79, 173)

span.music-level-normal
  background RGB(86, 175, 95)

span.music-level-hard
  background RGB(251, 195, 79)

span.music-level-expert
  background RGB(236, 69, 68)

span.music-level-special
  background RGB(152, 35, 168)
</style>
