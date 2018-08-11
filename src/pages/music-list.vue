<template>
  <q-page padding>
    <div class="block filter">
      <q-collapsible :label="$t('common.filter')" v-model="isFilterVisible">
        <q-card style="padding: 1%;">
          <div class="row gutter">
            <q-select class="col-12" multiple chips v-model="selectBandId" :float-label="$t('music.select-band')"
              :options="bandOption" color="pink"></q-select>
          </div>
          <p>{{$t('common.sort.title')}}</p>
          <div class="row gutter">
            <q-radio color="pink" v-model="sortParam" val="asc" :label="$t('common.sort.asc')" />
            <q-radio color="pink" v-model="sortParam" val="desc" :label="$t('common.sort.desc')" />
          </div>
          <br>
          <div class="row gutter">
            <q-radio color="pink" v-model="orderKey" val="musicId" label="ID" />
            <q-radio color="pink" v-model="orderKey" val="bandId" :label="$t('common.band')" />
            <q-radio color="pink" v-model="orderKey" val="maxDifficilty" :label="$t('common.difficulty')" />
          </div>
          <br>
          <div>
            <q-btn color="pink" @click="doFilter(server), saveFilter()">{{$t('common.apply-save')}}</q-btn>
          </div>
        </q-card>
      </q-collapsible>
    </div>
    <q-infinite-scroll ref="musicScroll" v-if="isReady" :handler="loadMore">
      <div class="row gt-sm gutter-sm">
        <div v-for="music in musicList" :key="music.cardId" class="col-12 col-md-6 col-xl-3 col-lg-4 full-height">
          <q-card class="music-card" @click.native="$router.push(`/music/${server}/${music.musicId}`)" v-lazy:background-image="music.jacket">
            <span :class="`music-img-band music-img-band-${music.bandId}`"></span>
            <q-card-title class="music-title">
              {{music.title}}<br>
              <span slot="subtitle">
                {{music.bandName}}<br>
                <span class="music-difficulty"><span class="music-level music-level-easy">{{music.difficulty[0]}}</span>
                 / <span class="music-level music-level-normal">{{music.difficulty[3]}}</span>
                 / <span class="music-level music-level-hard">{{music.difficulty[2]}}</span>
                 / <span class="music-level music-level-expert">{{music.difficulty[1]}}</span>
                <span v-if="music.difficulty[4]"> / <span class="music-level music-level-special">{{music.difficulty[4]}}</span></span></span>
              </span>
            </q-card-title>
          </q-card>
        </div>
      </div>
      <div class="row lt-md gutter-sm">
        <div v-for="music in musicList" :key="music.cardId" class="col-12 col-md-6 col-xl-3 col-lg-4 full-height">
          <q-card class="music-card-collapse" @click.native="$router.push(`/music/${server}/${music.musicId}`)" v-lazy:background-image="music.jacket">
            <p>
              {{music.title}}<br>
              {{music.bandName}}<br>
              <span class="music-difficulty"><span class="music-level music-level-easy">{{music.difficulty[0]}}</span>
               / <span class="music-level music-level-normal">{{music.difficulty[3]}}</span>
               / <span class="music-level music-level-hard">{{music.difficulty[2]}}</span>
               / <span class="music-level music-level-expert">{{music.difficulty[1]}}</span>
              <span v-if="music.difficulty[4]"> / <span class="music-level music-level-special">{{music.difficulty[4]}}</span></span></span>
            </p>
          </q-card>
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
      orderKey: 'musicId',
      sortParam: 'desc'
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
      this.orderKey = LocalStorage.get.item(`musicfilter.${server}`).orderKey || 'musicId'
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
        orderKey: this.orderKey
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
        orderKey: this.orderKey
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

.one-img-full
  background-size auto 100%
  background-repeat no-repeat
  background-position center

.one-img-thumb
  height 90px
  margin 5px
  background-size auto 100%
  background-repeat no-repeat
  background-position center

.music-img-band
  position absolute
  top 3%
  left 3%
  width 100%
  height 40px
  background-size contain
  background-repeat no-repeat

.music-img-band-1
  background-image url('/statics/band_logo_1.png')

.music-img-band-2
  background-image url('/statics/band_logo_2.png')

.music-img-band-3
  background-image url('/statics/band_logo_3.png')

.music-img-band-4
  background-image url('/statics/band_logo_4.png')

.music-img-band-5
  background-image url('/statics/band_logo_5.png')

.music-card
  position relative
  width 100%
  padding-top 100%
  cursor pointer
  background-size contain
  background-repeat no-repeat

.music-title
  position relative

.music-card-collapse
  position relative
  height 100px
  background-size contain
  background-repeat no-repeat

.music-card-collapse p
  font-size 80%
  margin-left 120px
  line-height 200%
  position absolute
  top 50%
  transform translate(0, -50%)

span.music-difficulty
  display block

.gt-sm span.music-difficulty
  margin-top 5px

span.music-level
  display inline-block
  color white
  font-size 85%
  font-weight bold
  width 25px
  height 16px
  border-radius 7px
  background red
  text-align center
  line-height 16px

span.music-level-easy
  background RGB(67, 98, 241)

span.music-level-normal
  background RGB(76, 219, 95)

span.music-level-hard
  background RGB(249, 205, 94)

span.music-level-expert
  background RGB(244, 56, 56)

span.music-level-special
  background RGB(227, 41, 136)
</style>
