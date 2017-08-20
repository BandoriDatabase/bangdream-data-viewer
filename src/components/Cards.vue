<template>
  <div>
    <router-view></router-view>
    <div v-if="$route.params.cardID === undefined && cardInfoList">
      <div class="block">
        <p>Hint: <span class="desktop-only">Click</span><span class="mobile-only">Touch</span> Thumb/Character/Title to see detail infos. 
          Switch name display: <label><q-toggle v-model="displayName"></q-toggle>{{displayName ? 'Romaji' : 'Kanji'}}</label></p>
        <q-btn color="pink" class="float-right" @click="showFilter">Filter</q-btn>
      </div>
      <q-data-table
        :data="showCardInfoList"
        :config="cardTableConfig"
        :columns="cardColumns">
        <template slot="col-thumb" scope="cell">
          <div class="shadow-1 shadow-transition hoverable-3" :class="`thumb-${getCardThumbFrame(cell.row)}`">
            <img class="thumb-table" v-lazy:background-image="`https://bangdream.ga/assets/thumb/chara/card0000${Math.trunc(Number(cell.row.cardID) / 50)}_${cell.row.cardRes}_normal.png`"
            @click="$router.push({ name: 'cardDetail', params: { cardID: cell.row.cardID } })">
          </div>
        </template>
        <template slot="col-name" scope="cell">
          <div @click="$router.push({ name: 'cardDetail', params: { cardID: cell.row.cardID } })"
            style="cursor: pointer" :class="`text-${getPalette(cell.row.attr)}`">
            {{displayName ? 
              capitalizeFirstLetter(WanaKana.toRomaji(getCharacter(cell.row.characterId).ruby)) : 
              getCharacter(cell.row.characterId).characterName}}
          </div>
        </template>
        <template slot="col-title" scope="cell">
          <div @click="$router.push({ name: 'cardDetail', params: { cardID: cell.row.cardID } })"
            style="cursor: pointer" :class="`text-${getPalette(cell.row.attr)}`">
            {{cell.data}}
          </div>
        </template>
        <template slot="col-maxPerformance" scope="cell">
          {{getMaxAttr(cell.row).performance}}
        </template>
        <template slot="col-maxTechnique" scope="cell">
          {{getMaxAttr(cell.row).technique}}
        </template>
        <template slot="col-maxVisual" scope="cell">
          {{getMaxAttr(cell.row).visual}}
        </template>
        <template slot="col-skillID" scope="cell">
          {{skillMap[cell.data].skillName}}
        </template>
      </q-data-table>
    </div>
  </div>
</template>

<script>
import {
  Platform,
  QDataTable,
  QBtn,
  Dialog
} from 'quasar'
import { mapGetters } from 'vuex'
import WanaKana from 'wanakana'

export default {
  name: 'CardsView',
  data () {
    return {
      WanaKana,
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
        title: 'Card Database',
        messages: {
          noData: '<i>warning</i> No data available to show.',
          noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
        }
      },
      cardColumns: [{
        label: 'ID',
        field: 'cardID',
        width: '6px',
        sort (a, b) {
          return Number(b) - Number(a)
        }
      }, {
        label: 'Thumb',
        field: 'thumb',
        width: '12px'
      }, {
        label: 'Character',
        field: 'name',
        width: '13px'
      }, {
        label: 'Title',
        field: 'title',
        width: '20px'
      }, {
        label: 'Perform',
        field: 'maxPerformance',
        width: '10px',
        sort (a, b) {
          return Number(b) - Number(a)
        }
      }, {
        label: 'Technique',
        field: 'maxTechnique',
        width: '10px',
        sort (a, b) {
          return Number(b) - Number(a)
        }
      }, {
        label: 'Visual',
        field: 'maxVisual',
        width: '10px',
        sort (a, b) {
          return Number(b) - Number(a)
        }
      }, {
        label: 'Skill',
        field: 'skillID',
        width: '15px'
      }],
      selectCharacters: [],
      showCardInfoList: [],
      selectSkills: []
    }
  },
  components: {
    QDataTable,
    QBtn
  },
  computed: {
    ...mapGetters('DB', [
      'cardInfoList',
      'characterInfos',
      'skillMap',
      'skillInfos'
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
    getCharacter (memberID) {
      return this.characterInfos[memberID]
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
        const cardOfSkills = Object.keys(this.skillMap).filter(key => this.selectSkills.indexOf(this.skillMap[key].skillID) !== -1)
        ret = ret.filter(elem => cardOfSkills.indexOf(elem.cardID) !== -1)
      }
      this.showCardInfoList = ret
    },
    showFilter () {
      Dialog.create({
        title: 'Filter options',
        message: 'Two filters are avaliable: Characters and Skills',
        form: {
          header1: {
            type: 'heading',
            label: 'Characters'
          },
          characters: {
            type: 'checkbox',
            model: this.selectCharacters,
            items: Object.keys(this.characterInfos).filter(key => Number(key) <= 25).map(key => ({
              label: this.displayName
                ? this.capitalizeFirstLetter(WanaKana.toRomaji(this.characterInfos[key].ruby))
                : this.characterInfos[key].characterName,
              value: this.characterInfos[key].characterID
            }))
          },
          header2: {
            type: 'heading',
            label: 'Skills'
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
              console.log(data)
              this.selectCharacters = data.characters
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
