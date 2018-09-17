<template>
  <q-page padding>
    <div class="block filter">
      <q-collapsible :label="$t('common.filter')" v-model="isFilterVisible">
        <div>
          <div class="row gutter">
            <q-select class="col-12" multiple chips v-model="selectBandId" :float-label="$t('music.select-band')"
              :options="bandOption" color="pink"></q-select>
          </div>
          <div>
            <p>{{$t('music.tag')}}</p>
            <div>
              <q-radio color="pink" v-model="selectTag" val="anime" :label="$t('common.anime')" />
              <q-radio color="pink" v-model="selectTag" val="normal" :label="$t('common.normal')" />
              <q-radio color="pink" v-model="selectTag" val="all" :label="$t('common.all')" />
            </div>
          </div>
          <p>{{$t('common.sort.title')}}</p>
          <div class="row gutter">
            <q-radio color="pink" v-model="sortParam" val="asc" :label="$t('common.sort.asc')" />
            <q-radio color="pink" v-model="sortParam" val="desc" :label="$t('common.sort.desc')" />
          </div>
          <div class="row gutter">
            <q-radio color="pink" v-model="orderKey" val="musicId" label="ID" />
            <!-- <q-radio color="pink" v-model="orderKey" val="bandId" :label="$t('common.band')" /> -->
            <q-radio color="pink" v-model="orderKey" val="maxDifficilty" :label="$t('common.difficulty')" />
            <q-radio color="pink" v-model="orderKey" val="publishedAt" :label="$t('common.release-date')" />
          </div>
          <div>
            <q-btn color="pink" @click="doFilter(server), saveFilter()">{{$t('common.apply-save')}}</q-btn>
          </div>
        </div>
      </q-collapsible>
    </div>
    <q-infinite-scroll ref="musicScroll" v-if="isReady" :handler="loadMore">
      <div class="row gt-sm gutter-sm">
        <div v-for="music in musicList" :key="music.cardId" class="col-6 col-md-4 col-lg-3 full-height">
          <q-card class="music-card" @click.native="$router.push(`/music/${server}/${music.musicId}`)" v-lazy:background-image="music.jacket">
            <q-card-title class="music-title">
              {{music.title}}<br>
              <span slot="subtitle">
                {{music.bandName}}
              </span>
            </q-card-title>
            <q-card-main>
              <div :class="`music-img-band img-band-${music.bandId}`" />
              <span class="music-difficulty">
                <q-chip small color="indigo">{{music.difficulty[0]}}</q-chip>
                <q-chip small color="green">{{music.difficulty[3]}}</q-chip>
                <q-chip small color="amber">{{music.difficulty[2]}}</q-chip>
                <q-chip small color="red">{{music.difficulty[1]}}</q-chip>
                <q-chip v-if="music.difficulty[4]" small color="purple">{{music.difficulty[4]}}</q-chip>
              </span>
            </q-card-main>
          </q-card>
        </div>
      </div>
      <div class="row lt-md gutter-sm">
        <div v-for="music in musicList" :key="music.cardId" class="col-12 col-lg-3 full-height">
          <q-card class="music-card-collapse" @click.native="$router.push(`/music/${server}/${music.musicId}`)" v-lazy:background-image="music.jacket">
            <p>
              {{music.title}}<br>
              {{music.bandName}}<br>
              <span class="music-difficulty">
                <q-chip small color="indigo">{{music.difficulty[0]}}</q-chip>
                <q-chip small color="green">{{music.difficulty[3]}}</q-chip>
                <q-chip small color="amber">{{music.difficulty[2]}}</q-chip>
                <q-chip small color="red">{{music.difficulty[1]}}</q-chip>
                <q-chip v-if="music.difficulty[4]" small color="purple">{{music.difficulty[4]}}</q-chip>
              </span>
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
  width 100%
  height 50px
  background-size contain
  background-repeat no-repeat

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
  span
    display inline-block
    font-size 85%
    font-weight bold
    width 30px
    height 18px
    border-radius 8px
    background red
    text-align center
    line-height 18px
    margin-right 5px

.gt-sm span.music-difficulty
  margin-top 5px
</style>
