<template>
  <div>
    <router-view></router-view>
    <section v-if="$route.params.musicID === undefined && musicList">
      <div class="block">
        <p>{{$t('hint[0]')}}<span class="desktop-only">{{$t('hint[1]')}}</span><span class="mobile-only">{{$t('hint[2]')}}</span>{{$t('hint[3]')}}</p>
      </div>
      <q-data-table v-if="musicList"
        :data="musicList"
        :config="musicTableConfig"
        :columns="musicColumns">
        <template slot="col-jacketImage" scope="cell">
          <img class="thumb-table shadow-1 shadow-transition hoverable-3" v-lazy="`/assets/musicjacket/${cell.row.jacketImage}_thumb.png`"
            @click="$router.push({ name: 'musicDetail', params: { musicID: cell.row.id } })">
        </template>
        <template slot="col-bandID" scope="cell">
          <div v-if="Number(cell.data) > 5">{{bandMap[cell.data].bandName}}</div>
          <img height="60px" width="90px" v-if="Number(cell.data) <= 5" v-lazy="`/assets/band/logo/00${cell.data}_logoL.png`" :alt="bandMap[cell.data].bandName">
        </template>
        <template slot="col-tag" scope="cell">
          {{$t(cell.row.tag)}}
        </template>
        <template slot="col-diff" scope="cell">
          {{getDifficulty(cell.row.id)[0].level}} /
          {{getDifficulty(cell.row.id)[3].level}} /
          {{getDifficulty(cell.row.id)[2].level}} /
          {{getDifficulty(cell.row.id)[1].level}}
        </template>
      </q-data-table>
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
  QDataTable
} from 'quasar'
import { mapGetters } from 'vuex'

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
        label: 'ID',
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
        field: 'bandID',
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
      }]
    }
  },
  components: {
    QDataTable
  },
  computed: {
    ...mapGetters('DB', [
      'musicList',
      'bandMap',
      'musicDifficultyList'
    ])
  },
  methods: {
    getDifficulty (musicID) {
      return this.musicDifficultyList.filter(elem => elem.musicID === musicID)
    }
  }
}
</script>

<style lang="stylus" scoped>
.thumb-table
  width 64px
  height 64px
  cursor pointer
  background-size cover
</style>
