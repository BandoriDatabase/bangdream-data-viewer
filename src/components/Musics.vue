<template>
  <section>
    <div class="block">
      <p>Hint: <span class="desktop-only">Click</span><span class="mobile-only">Touch</span> Jacket/Title/Band to see detail infos. </p>
    </div>
    <q-data-table v-if="musicList"
      :data="musicList"
      :config="musicTableConfig"
      :columns="musicColumns">
      <template slot="col-jacketImage" scope="cell">
        <img class="thumb-table shadow-1 shadow-transition hoverable-3" v-lazy="`https://bangdream.ga/assets/musicjacket/${cell.row.jacketImage}_thumb.png`"
          @click="">
      </template>
      <template slot="col-bandID" scope="cell">
        <div v-if="Number(cell.data) > 5">{{bandMap[cell.data].bandName}}</div>
        <img height="60px" width="90px" v-if="Number(cell.data) <= 5" v-lazy="`https://bangdream.ga/assets/band/logo/00${cell.data}_logoL.png`">
      </template>
      <template slot="col-diff" scope="cell">
        {{getDifficulty(cell.row.id)[0].level}} /
        {{getDifficulty(cell.row.id)[3].level}} /
        {{getDifficulty(cell.row.id)[2].level}} /
        {{getDifficulty(cell.row.id)[1].level}}
      </template>
    </q-data-table>
  </section>
</template>

<script>
import { Platform } from 'quasar'
import { mapGetters } from 'vuex'
import aPlayer from 'vue-aplayer'

export default {
  name: 'musicList',
  components: {
    aPlayer
  },
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
        title: 'Music Database',
        messages: {
          noData: '<i>warning</i> No data available to show.',
          noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
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
        label: 'Jacket',
        field: 'jacketImage',
        width: '10px'
      }, {
        label: 'Title',
        field: 'title',
        width: '15px',
        sort: true
      }, {
        label: 'Type',
        field: 'tag',
        width: '5px',
        sort: true
      }, {
        label: 'Band',
        field: 'bandID',
        width: '10px',
        sort: true
      }, {
        label: 'How to get',
        field: 'howToGet',
        width: '20px'
      }, {
        label: 'Difficulty',
        field: 'diff',
        width: '10px'
      }]
    }
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
