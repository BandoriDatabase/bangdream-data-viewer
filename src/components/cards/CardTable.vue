<template>
  <div v-if="cardInfoList">
    <div class="block">
      <p>{{$t('hint[0]')}}<span class="desktop-only">{{$t('hint[1]')}}</span><span class="mobile-only">{{$t('hint[2]')}}</span>{{$t('hint[3]')}}</p>
      <p>{{$t('hint[4]')}}<label><q-toggle v-model="displayName"></q-toggle>{{displayName ? $t('hint[5]'):$t('hint[6]')}}</label></p>
      <q-btn color="pink" class="float-right" @click="showFilter">{{$t('table.filter')}}</q-btn>
    </div>
    <q-data-table
      :data="showCardInfoList"
      :config="cardTableConfig"
      :columns="cardColumns">
      <template slot="col-thumb" slot-scope="cell">
        <!-- <div class="shadow-1 shadow-transition hoverable-3" :class="`thumb-${getCardThumbFrame(cell.row)}`">
          <img class="thumb-table" v-lazy:background-image="`/assets/thumb/chara/card0000${Math.trunc(Number(cell.row.cardId) / 50)}_${cell.row.cardRes}_normal.png`"
          @click="$router.push({ name: 'cardDetail', params: { cardId: cell.row.cardId } })">
        </div> -->
        <card-thumb :cardInfo="cell.row"></card-thumb>
      </template>
      <template slot="col-name" slot-scope="cell">
        <div @click="$router.push({ name: 'cardDetail', params: { cardId: cell.row.cardId } })"
          style="cursor: pointer" :class="`text-${getPalette(cell.row.attr)}`">
          {{displayName ? 
            capitalizeFirstLetter(toRomaji(getCharacter(cell.row.characterId).ruby)) : 
            getCharacter(cell.row.characterId).characterName}}
        </div>
      </template>
      <template slot="col-title" slot-scope="cell">
        <div @click="$router.push({ name: 'cardDetail', params: { cardId: cell.row.cardId } })"
          style="cursor: pointer" :class="`text-${getPalette(cell.row.attr)}`">
          {{cell.data}}
        </div>
      </template>
      <template slot="col-characterId" slot-scope="cell">
        <!-- <div v-if="Number(getCharacter(cell.data).bandId) > 5">{{bandMap[getCharacter(cell.data).bandId].bandName}}</div> -->
        <img height="60px" width="90px" v-if="Number(getCharacter(cell.data).bandId) <= 5" v-lazy="`/assets/band/logo/00${getCharacter(cell.data).bandId}_logoL.png`" :alt="bandMap[getCharacter(cell.data).bandId].bandName">
      </template>
      <!-- <template slot="col-maxPerformance" slot-scope="cell">
        {{getMaxAttr(cell.row).performance}}
      </template>
      <template slot="col-maxTechnique" slot-scope="cell">
        {{getMaxAttr(cell.row).technique}}
      </template>
      <template slot="col-maxVisual" slot-scope="cell">
        {{getMaxAttr(cell.row).visual}}
      </template> -->
      <!-- <template slot="col-totalAttr" slot-scope="cell">
        {{Number(getMaxAttr(cell.row).performance) +
          Number(getMaxAttr(cell.row).technique) +
          Number(getMaxAttr(cell.row).visual)}}
      </template> -->
      <template slot="col-skillId" slot-scope="cell">
        {{skillMap[cell.data].skillName}}
      </template>
    </q-data-table>
  </div>
</template>

<i18n>
{
  "en": {
    "hint": [
      "Hint: ",
      "Click",
      "Touch",
      " Thumb/Character/Title to see detail infos.",
      "Switch name display: ",
      "Romaji",
      "Kanji"
    ],
    "table": {
      "title": "Card Database",
      "columns": "Columns",
      "filter": "Filter",
      "label": {
        "thumb": "Thumb",
        "name": "Name",
        "title": "Title",
        "band": "Band",
        "perform": "Perform",
        "technic": "Technique",
        "visual": "Visual",
        "total": "Total",
        "skill": "Skill"
      }
    },
    "filter": {
      "title": "Filter options",
      "messgae": "Folling filters are avaliable: Characters, Skills, Rarity",
      "heading1": "Characters",
      "heading2": "Skills",
      "heading3": "Rarity"
    }
  },
  "zh-cn": {
    "hint": [
      "提示: ",
      "点击",
      "触摸",
      "头像/角色名/卡牌标题可查看详细信息",
      "切换姓名显示",
      "罗马字",
      "汉字"
    ],
    "table": {
      "title": "卡牌数据库",
      "columns": "选择列",
      "filter": "过滤",
      "label": {
        "thumb": "头像",
        "name": "角色名",
        "title": "卡牌标题",
        "band": "乐队",
        "perform": "Perform",
        "technic": "Technique",
        "visual": "Visual",
        "total": "总和",
        "skill": "技能"
      }
    },
    "filter": {
      "title": "过滤选项",
      "messgae": "可以按照下列条件过滤：角色名，技能，稀有度",
      "heading1": "角色名",
      "heading2": "技能",
      "heading3": "稀有度"
    }
  },
  "zh-tw": {
    "hint": [
      "提示: ",
      "點擊",
      "觸摸",
      "頭像/角色名/卡牌標題可查看詳細信息",
      "切換姓名顯示",
      "羅馬字",
      "漢字"
    ],
    "table": {
      "title": "卡牌數據庫",
      "columns": "選擇列",
      "filter": "過濾",
      "label": {
        "thumb": "頭像",
        "name": "角色名",
        "title": "卡牌標題",
        "band": "樂隊",
        "perform": "Perform",
        "technic": "Technique",
        "visual": "Visual",
        "total": "加和",
        "skill": "技能"
      }
    },
    "filter": {
      "title": "過濾選項",
      "messgae": "可以按照下列條件過濾：角色名，技能，稀有度",
      "heading1": "角色名",
      "heading2": "技能",
      "heading3": "稀有度"
    }
  }
}
</i18n>

<script>
import {
  Platform,
  QDataTable,
  QBtn,
  Dialog,
  QToggle
} from 'quasar'
import { mapGetters } from 'vuex'
import { toRomaji } from 'wanakana'
import cardThumb from '../common/CardThumb'

export default {
  name: 'CardTableComponent',
  data () {
    return {
      toRomaji,
      displayName: false,
      cardTableConfig: {
        pagination: {
          rowsPerPage: 10,
          options: [10, 20, 50, 100]
        },
        responsive: true,
        bodyStyle: {
          maxHeight: Platform.is.mobile ? '60vh' : '85vh'
        },
        columnPicker: true,
        title: this.$t('table.title'),
        messages: {
          noData: 'No data available to show.',
          noDataAfterFiltering: 'No results. Please refine your search terms.'
        },
        labels: {
          columns: this.$t('table.columns')
        }
      },
      cardColumns: [{
        label: 'id',
        field: 'cardId',
        width: '6px',
        sort (a, b) {
          return Number(b) - Number(a)
        }
      }, {
        label: this.$t('table.label.thumb'),
        field: 'thumb',
        width: '12px'
      }, {
        label: this.$t('table.label.name'),
        field: 'name',
        width: '13px'
      }, {
        label: this.$t('table.label.title'),
        field: 'title',
        width: '20px'
      }, {
        label: this.$t('table.label.band'),
        field: 'characterId',
        width: '10px',
        sort: true
      }, {
        label: this.$t('table.label.perform'),
        field: 'maxPerformance',
        width: '10px',
        sort (a, b) {
          return Number(b) - Number(a)
        }
      }, {
        label: this.$t('table.label.technic'),
        field: 'maxTechnique',
        width: '10px',
        sort (a, b) {
          return Number(b) - Number(a)
        }
      }, {
        label: this.$t('table.label.visual'),
        field: 'maxVisual',
        width: '10px',
        sort (a, b) {
          return Number(b) - Number(a)
        }
      }, {
        label: this.$t('table.label.total'),
        field: 'totalAttr',
        width: '10px',
        sort (a, b) {
          return Number(b) - Number(a)
        }
      }, {
        label: this.$t('table.label.skill'),
        field: 'skillId',
        width: '15px'
      }],
      selectCharacters: [],
      showCardInfoList: [],
      selectSkills: [],
      selectRarity: []
    }
  },
  components: {
    QDataTable,
    QBtn,
    QToggle,
    cardThumb
  },
  computed: {
    ...mapGetters('DB', [
      'cardInfoList',
      'characterInfos',
      'skillMap',
      'skillInfos',
      'bandMap'
    ])
  },
  mounted () {
    if (this.cardInfoList) {
      this.doFilter()
    }
  },
  watch: {
    cardInfoList (newVal) {
      if (newVal) {
        this.showCardInfoList = newVal.slice().reverse()
      }
    }
  },
  methods: {
    getCharacter (memberid) {
      return this.characterInfos[memberid]
    },
    getMaxAttr (card) {
      return card.parameterMap[card.maxLevel]
    },
    getMinAttr (card) {
      return card.parameterMap[1]
    },
    getLimitAttr (card) {
      if (!card.levelLimit) return null
      return card.parameterMap[card.levelLimit]
    },
    getPalette (type) {
      switch (type) {
        case 'happy':
          return 'orange-8'
        case 'cool':
          return 'indigo-6'
        case 'pure':
          return 'green-8'
        case 'powerful':
          return 'pink-6'
        default:
          return 'primary'
      }
    },
    getCardThumbFrame (cardInfo) {
      switch (Number(cardInfo.rarity)) {
        case 1:
          return `normal-${cardInfo.attr}`
        case 2:
          return 'rare'
        case 3:
          return 'super-rare'
        case 4:
          return 'ss-rare'
      }
    },
    capitalizeFirstLetter (str) {
      return str.split(' ')
        .map(elem => elem.charAt(0).toUpperCase() + elem.slice(1))
        .join(' ')
    },
    doFilter () {
      let ret = this.cardInfoList.slice().reverse()
      if (this.selectCharacters.length) {
        ret = ret.filter(elem => this.selectCharacters.indexOf(elem.characterId) !== -1)
      }
      if (this.selectSkills.length) {
        const cardOfSkills = Object.keys(this.skillMap).filter(key => this.selectSkills.indexOf(this.skillMap[key].skillId) !== -1)
        ret = ret.filter(elem => cardOfSkills.indexOf(elem.cardId) !== -1)
      }
      if (this.selectRarity.length) {
        ret = ret.filter(elem => this.selectRarity.indexOf(elem.rarity) !== -1)
      }
      this.showCardInfoList = ret
    },
    showFilter () {
      Dialog.create({
        title: this.$t('filter.title'),
        message: this.$t('filter.messgae'),
        form: {
          header3: {
            type: 'heading',
            label: this.$t('filter.heading3')
          },
          rarity: {
            type: 'checkbox',
            model: this.selectRarity,
            items: [{
              label: '\u2605\u2605\u2605\u2605',
              value: '4'
            }, {
              label: '\u2605\u2605\u2605',
              value: '3'
            }, {
              label: '\u2605\u2605',
              value: '2'
            }, {
              label: '\u2605',
              value: '1'
            }]
          },
          header1: {
            type: 'heading',
            label: this.$t('filter.heading1')
          },
          characters: {
            type: 'checkbox',
            model: this.selectCharacters,
            items: Object.keys(this.characterInfos).filter(key => Number(key) <= 25).map(key => ({
              label: this.displayName
                ? this.capitalizeFirstLetter(toRomaji(this.characterInfos[key].ruby))
                : this.characterInfos[key].characterName,
              value: this.characterInfos[key].characterId
            }))
          },
          header2: {
            type: 'heading',
            label: this.$t('filter.heading2')
          },
          skills: {
            type: 'checkbox',
            model: this.selectSkills,
            items: this.skillInfos.reduce((prev, curr) => {
              if (prev.find(elem2 => elem2.skillId === curr.skillId)) return prev
              prev.push(curr)
              return prev
            }, []).map(elem => ({
              label: elem.simpleDescription,
              value: elem.skillId
            }))
          }
        },
        buttons: [
          'Cancel',
          {
            label: 'OK',
            handler: (data) => {
              // console.log(data)
              this.doFilter()
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.thumb-table
  width 54px
  height 54px
  cursor pointer
  background-size cover
  margin 3px 3px
</style>
