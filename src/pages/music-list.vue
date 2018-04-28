<template>
  <q-page padding>
    <div class="block">
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
          <q-card style="height: 500px; cursor: pointer;" @click.native="$router.push(`/music/${server}/${music.musicId}`)">
            <q-card-media class="full-height" style="position: relative;">
              <span :class="`music-img-band-${music.bandId}`"></span>
              <div v-lazy:background-image="music.jacket" class="full-height one-img-full" />
              <q-card-title slot="overlay">
                {{music.title}}<br>
                {{music.bandName}}<br>
                {{music.difficulty[0]}} /
                {{music.difficulty[3]}} /
                {{music.difficulty[2]}} /
                {{music.difficulty[1]}}
              </q-card-title>
            </q-card-media>
          </q-card>
        </div>
      </div>
      <div class="row lt-md gutter-sm">
        <div v-for="music in musicList" :key="music.cardId" class="col-12 col-md-6 col-xl-3 col-lg-4 full-height">
          <q-card style="height: 100px;" @click.native="$router.push(`/music/${server}/${music.musicId}`)">
            <q-card-main class="no-padding">
              <div class="row full-height items-center">
                <div v-lazy:background-image="music.jacket" class="col-3 one-img-thumb"></div>
                <div class="col-8">
                  {{music.title}}<br>
                  {{music.bandName}}
                </div>
              </div>
            </q-card-main>
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
.one-img-full
  background-size: auto 100%
  background-repeat: no-repeat
  background-position: center

.one-img-thumb
  height: 90px
  margin: 5px
  background-size: auto 100%
  background-repeat: no-repeat
  background-position: center

.music-img-band-1
  position: absolute
  top: 3%
  left: 5%
  width 90px
  height 40px
  background: url('/statics/band_logo_1.png') no-repeat
  background-size cover
  background-position center

.music-img-band-2
  position: absolute
  top: 3%
  left: 5%
  width 90px
  height 60px
  background: url('/statics/band_logo_2.png') no-repeat
  background-size cover
  background-position center

.music-img-band-3
  position: absolute
  top: 3%
  left: 5%
  width 90px
  height 90px
  background: url('/statics/band_logo_3.png') no-repeat
  background-size cover
  background-position center

.music-img-band-4
  position: absolute
  top: 3%
  left: 5%
  width 90px
  height 80px
  background: url('/statics/band_logo_4.png') no-repeat
  background-size cover
  background-position center

.music-img-band-5
  position: absolute
  top: 3%
  left: 5%
  width 90px
  height 70px
  background: url('/statics/band_logo_5.png') no-repeat
  background-size cover
  background-position center
</style>
