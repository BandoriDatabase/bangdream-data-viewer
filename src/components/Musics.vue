<template>
  <div>
    <section v-if="$route.params.musicId === undefined">
      <div class="block">
        <p>{{$t('hint[0]')}}<span class="desktop-only">{{$t('hint[1]')}}</span><span class="mobile-only">{{$t('hint[2]')}}</span>{{$t('hint[3]')}}</p>
        <q-btn color="pink" @click="isFilterVisible = !isFilterVisible">{{$t('toolbar.filter')}}</q-btn>
        <q-slide-transition>
          <div class="shadow-3" style="padding: 1%;" v-show="isFilterVisible">
            <p>{{$t('filter.title')}}</p>
            <div class="row gutter">
              <q-select class="col-12" multiple chips v-model="selectBandId" :float-label="$t('filter.bandId')"
                :options="bandOption" color="pink"></q-select>
            </div>
            <p>{{$t('sort.title')}}</p>
            <div class="row gutter">
              <q-radio color="pink" v-model="sortParam" val="asc" :label="$t('sort.asc')" />
              <q-radio color="pink" v-model="sortParam" val="desc" :label="$t('sort.desc')" />
            </div>
            <br>
            <div class="row gutter">
              <q-radio color="pink" v-model="orderKey" val="musicId" label="ID" />
              <q-radio color="pink" v-model="orderKey" val="bandId" :label="$t('filter.bandId')" />
              <q-radio color="pink" v-model="orderKey" val="maxDifficilty" :label="$t('sort.difficulty')" />
            </div>
            <br>
            <div>
              <q-btn color="pink" @click="doFilter(), saveFilter()">{{$t('filter.apply-save')}}</q-btn>
            </div>
          </div>
        </q-slide-transition>
      </div>
      <q-infinite-scroll ref="musicScroll" v-if="isReady" :handler="loadMore">
        <div class="row gt-sm">
          <div v-for="music in musicList" :key="music.cardId" class="col-12 col-md-6 col-xl-3 col-lg-4 full-height">
            <q-card style="height: 500px; cursor: pointer;" @click="$router.push({ name: 'musicDetail', params: { musicId: music.musicId, server } })">
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
        <div class="row lt-md">
          <div v-for="music in musicList" :key="music.cardId" class="col-12 col-md-6 col-xl-3 col-lg-4 full-height">
            <q-card style="height: 100px;" @click="$router.push({ name: 'musicDetail', params: { musicId: music.musicId, server } })">
              <!-- <q-card-media class="full-height" style="position: relative;">
                <span :class="`music-img-band-${music.bandId}`"></span>
                <div v-lazy:background-image="music.jacket" class="full-height one-img-full" />
              </q-card-media> -->
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
    </section>
  </div>
</template>

<i18n>
{
  "en": {
    "hint": [
      "Hint: ",
      "Click",
      "Touch",
      " jacket image to see detail infos."
    ],
    "toolbar": {
      "filter": "Open/Close filter"
    },
    "filter": {
      "title": "Filter options",
      "apply-save": "Save & Apply",
      "bandId": "Band"
    },
    "sort": {
      "title": "Sort options",
      "asc": "Forward",
      "desc": "Backward",
      "difficulty": "Difficulty"
    }
  },
  "zh-cn": {
    "hint": [
      "提示: ",
      "点击",
      "触摸",
      "歌曲封面来查看详细信息"
    ],
    "toolbar": {
      "filter": "打开/关闭过滤"
    },
    "filter": {
      "title": "过滤选项",
      "apply-save": "应用和保存过滤选项",
      "bandId": "乐队/演奏者"
    },
    "sort": {
      "title": "排序选项",
      "asc": "正序",
      "desc": "倒序",
      "difficulty": "难度"
    }
  },
  "zh-tw": {
    "hint": [
      "提示: ",
      "點擊",
      "觸摸",
      "歌曲封面來查看詳細信息"
    ],
    "toolbar": {
      "filter": "打開/關閉過濾"
    },
    "filter": {
      "title": "過濾選項",
      "apply-save": "應用和保存過濾選項",
      "bandId": "樂隊/演奏者"
    },
    "sort": {
      "title": "排序選項",
      "asc": "正序",
      "desc": "倒序",
      "difficulty": "難度"
    }
  },
  "ja": {
    "hint": [
      "ヒント: ジャケット写真を",
      "クリックする",
      "タップする",
      "と詳細情報が表示されます"
    ]
  }
}
</i18n>

<script>
import {
  QInfiniteScroll,
  QSpinner,
  QCard,
  QCardTitle,
  QCardMedia,
  QCardMain,
  QInnerLoading,
  QBtn,
  QSlideTransition,
  QSelect,
  LocalStorage,
  QRadio
} from 'quasar'
import apiDBInfo from 'api/dbinfo'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'musicList',
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
  components: {
    QInfiniteScroll,
    QSpinner,
    QCard,
    QCardTitle,
    QCardMedia,
    QCardMain,
    QInnerLoading,
    QBtn,
    QSlideTransition,
    QSelect,
    LocalStorage,
    QRadio
  },
  mounted () {
    if (!LocalStorage.get.item(`musicfilter.${this.server}`)) LocalStorage.set(`musicfilter.${this.server}`, {})
    this.selectBandId = LocalStorage.get.item(`musicfilter.${this.server}`).bands || []
    this.sortParam = LocalStorage.get.item(`musicfilter.${this.server}`).sort || 'desc'
    this.orderKey = LocalStorage.get.item(`musicfilter.${this.server}`).orderKey || 'musicId'

    this.$nextTick(async () => {
      // await this.getMusicList(this.queryParams, this.server)
      await this.doFilter()
      await this.getBandList(this.server)
      this.bandOption = this.bandList[this.server].map(elem => ({
        label: elem.bandName,
        value: elem.bandId
      }))
      this.isReady = true
    })
  },
  computed: {
    ...mapState('band', [
      'bandList'
    ]),
    server () {
      return this.$route.params.server
    }
  },
  watch: {
    '$route.params.server': function () {
      this.isReady = false
      if (!LocalStorage.get.item(`musicfilter.${this.server}`)) LocalStorage.set(`musicfilter.${this.server}`, {})
      this.selectBandId = LocalStorage.get.item(`musicfilter.${this.server}`).bandId || []
      this.sortParam = LocalStorage.get.item(`musicfilter.${this.server}`).sort || 'desc'
      this.orderKey = LocalStorage.get.item(`musicfilter.${this.server}`).orderKey || 'musicId'
      this.$nextTick(async () => {
        // await this.getMusicList(this.queryParams, this.server)
        await this.doFilter()
        await this.getBandList(this.server)
        this.bandOption = this.bandList[this.server].map(elem => ({
          label: elem.bandName,
          value: elem.bandId
        }))
        this.isReady = true
      })
    }
  },
  methods: {
    ...mapActions('band', [
      'getBandList'
    ]),
    async getMusicList (params, server) {
      // console.log(params)
      this.musicList = this.musicList.concat((await apiDBInfo.getMusic(params, server)).data)
    },
    async doFilter () {
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
        this.musicList = (await apiDBInfo.getMusic(this.queryParams, this.server)).data
      }
      catch (e) {
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
      }
      catch (error) {
        console.log('no more musics')
        this.$refs.musicScroll.stop()
      }
      finally {
        done()
      }
    }
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
