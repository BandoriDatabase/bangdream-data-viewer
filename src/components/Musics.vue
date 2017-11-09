<template>
  <div>
    <section v-if="$route.params.musicId === undefined">
      <div class="block">
        <p>{{$t('hint[0]')}}<span class="desktop-only">{{$t('hint[1]')}}</span><span class="mobile-only">{{$t('hint[2]')}}</span>{{$t('hint[3]')}}</p>
      </div>
      <q-infinite-scroll ref="musicScroll" v-if="isReady" :handler="loadMore">
        <div class="row">
          <div v-for="music in musicList" :key="music.cardId" class="col-6 col-xl-3 col-lg-4 full-height">
            <q-card style="height: 500px; cursor: pointer;" @click="$router.push({ name: 'musicDetail', params: { musicId: music.id } })">
              <q-card-media class="full-height" style="position: relative;">
                <span :class="`music-img-band-${music.bandId}`"></span>
                <div v-lazy:background-image="music.jacket" class="full-height one-img-full" />
                <q-card-title slot="overlay">
                  {{music.title}}
                </q-card-title>
              </q-card-media>
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
    "table": {
      "title": "Music Database",
      "jacket": "Jacket",
      "coltitle": "Title",
      "type": "Type",
      "band": "Band",
      "how-to-get": "How to get",
      "diffi": "Difficulty",
      "columns": "Columns"
    },
    "normal": "Normal",
    "anime": "Anime"
  },
  "zh-CN": {
    "hint": [
      "提示: ",
      "点击",
      "触摸",
      "歌曲封面来查看详细信息"
    ],
    "table": {
      "title": "歌曲数据库",
      "jacket": "封面",
      "coltitle": "标题",
      "type": "类型",
      "band": "乐队",
      "how-to-get": "获得方式",
      "diffi": "难度",
      "columns": "选择列"
    },
    "normal": "原创",
    "anime": "动画翻唱"
  },
  "zh-TW": {
    "hint": [
      "提示: ",
      "點擊",
      "觸摸",
      "歌曲封面來查看詳細信息"
    ],
    "table": {
      "title": "歌曲數據庫",
      "jacket": "封面",
      "coltitle": "標題",
      "type": "類型",
      "band": "樂隊",
      "how-to-get": "獲得方式",
      "diffi": "難度",
      "columns": "選擇列"
    }
  }
}
</i18n>

<script>
import {
  Platform,
  QInfiniteScroll,
  QSpinner,
  QCard,
  QCardTitle,
  QCardMedia,
  QCardMain,
  QInnerLoading
} from 'quasar'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'musicList',
  data () {
    return {
      musicTableConfig: {
        pagination: {
          rowsPerPage: 10,
          options: [10, 20]
        },
        responsive: true,
        bodyStyle: {
          maxHeight: Platform.is.mobile ? '60vh' : '70vh'
        },
        columnPicker: true,
        title: this.$t('table.title'),
        messages: {
          noData: '<i>warning</i> No data available to show.',
          noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
        },
        labels: {
          columns: this.$t('table.columns')
        }
      },
      musicColumns: [{
        label: 'id',
        field: 'id',
        width: '4px',
        sort (a, b) {
          return Number(b) - Number(a)
        }
      }, {
        label: this.$t('table.jacket'),
        field: 'jacketImage',
        width: '10px'
      }, {
        label: this.$t('table.coltitle'),
        field: 'title',
        width: '15px',
        sort: true
      }, {
        label: this.$t('table.type'),
        field: 'tag',
        width: '5px',
        sort: true
      }, {
        label: this.$t('table.band'),
        field: 'bandId',
        width: '10px',
        sort: true
      }, {
        label: this.$t('table.how-to-get'),
        field: 'howToGet',
        width: '20px'
      }, {
        label: this.$t('table.diffi'),
        field: 'diff',
        width: '10px'
      }],
      isReady: false
    }
  },
  components: {
    QInfiniteScroll,
    QSpinner,
    QCard,
    QCardTitle,
    QCardMedia,
    QCardMain,
    QInnerLoading
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getMusicList({ limit: 12, page: 1 })
      // this.doFilter()
      this.isReady = true
    })
  },
  computed: {
    ...mapState('music', [
      'musicList'
    ])
  },
  methods: {
    ...mapActions('music', [
      'getMusicList'
    ]),
    async loadMore (index, done) {
      try {
        await this.getMusicList({ limit: 12, page: index + 1 })
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
