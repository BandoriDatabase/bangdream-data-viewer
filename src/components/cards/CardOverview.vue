<template>
  <div v-if="cardInfoList">
    <div class="block">
      <p>{{$t('hint[0]')}}<span class="desktop-only">{{$t('hint[1]')}}</span><span class="mobile-only">{{$t('hint[2]')}}</span>{{$t('hint[3]')}}</p>
      <p>{{$t('hint[4]')}}<label><q-toggle v-model="displayName"></q-toggle>{{displayName ? $t('hint[5]'):$t('hint[6]')}}</label></p>
    </div>
    <div>
      <q-btn color="pink" @click="showFilter">{{$t('toolbar.filter')}}</q-btn>
      <!-- <q-btn color="pink" @click="showFilter">{{$t('toolbar.next-page')}}</q-btn> -->
    </div>
    <div class="row">
      <div v-for="card in showCardInfoList" :key="card.cardID" class="col-12 col-xl-4 col-lg-6 full-height">
        <q-card style="height: 500px; cursor: pointer;" @click="$router.push({ name: 'cardDetail', params: { cardID: card.cardID } })">
          <q-card-media class="full-height" style="position: relative;">
            <span :class="`card-img-attr-${card.attr}`"></span>
            <img v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_normal.png`" v-if="card.rarity < 3" class="one-img-full full-height">
            <div v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_normal.png`" v-if="card.rarity >= 3" class="two-img-split full-height gt-md"
              :ref="`splitL${card.cardID}`" @mouseover="handleMouseOver(`splitL${card.cardID}`)" @mouseout="handleMouseOut(card.cardID)">
            </div>
            <div v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_after_training.png`" v-if="card.rarity >= 3" class="two-img-split full-height gt-md"
              :ref="`splitR${card.cardID}`" @mouseover="handleMouseOver(`splitR${card.cardID}`)" @mouseout="handleMouseOut(card.cardID)">
            </div>
            <div v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_normal.png`" v-if="card.rarity >= 3" class="two-img-full full-width lt-md"
              style="height: 50%;">
            </div>
            <div v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_after_training.png`" v-if="card.rarity >= 3" class="two-img-full full-width lt-md"
              style="height: 50%;">
            </div>
            <q-card-title slot="overlay">
              [{{card.title}}] {{displayName ? capitalizeFirstLetter(toRomaji(characterInfos[card.characterID].ruby)) : characterInfos[card.characterID].characterName}}
              <span v-for="i in Number(card.rarity)" :key="i">🟊</span>
            </q-card-title>
          </q-card-media>
        </q-card>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "hint": [
      "Hint: ",
      "Click",
      "Touch",
      " Card to see detail infos.",
      "Switch name display: ",
      "Romaji",
      "Kanji"
    ],
    "table": {
      "title": "Card Database",
      "columns": "Columns",
      "label": {
        "thumb": "Thumb",
        "name": "Name",
        "title": "Title",
        "perform": "Perform",
        "technic": "Technique",
        "visual": "Visual",
        "skill": "Skill"
      }
    },
    "toolbar": {
      "filter": "Filter"
    },
    "filter": {
      "title": "Filter options",
      "messgae": "Folling filters are avaliable: Characters, Skills, Rarity",
      "heading1": "Characters",
      "heading2": "Skills",
      "heading3": "Rarity"
    }
  },
  "zh-CN": {
    "hint": [
      "提示: ",
      "点击",
      "触摸",
      "卡牌可查看详细信息",
      "切换姓名显示",
      "罗马字",
      "汉字"
    ],
    "table": {
      "title": "卡牌数据库",
      "columns": "选择列",
      "label": {
        "thumb": "头像",
        "name": "角色名",
        "title": "卡牌标题",
        "perform": "Perform",
        "technic": "Technique",
        "visual": "Visual",
        "skill": "技能"
      }
    },
    "toolbar": {
      "filter": "过滤"
    },
    "filter": {
      "title": "过滤选项",
      "messgae": "可以按照下列条件过滤：角色名，技能，稀有度",
      "heading1": "角色名",
      "heading2": "技能",
      "heading3": "稀有度"
    }
  },
  "zh-TW": {
    "hint": [
      "提示: ",
      "點擊",
      "觸摸",
      "卡牌可查看詳細信息",
      "切換姓名顯示",
      "羅馬字",
      "漢字"
    ],
    "table": {
      "title": "卡牌數據庫",
      "columns": "選擇列",
      "label": {
        "thumb": "頭像",
        "name": "角色名",
        "title": "卡牌標題",
        "perform": "Perform",
        "technic": "Technique",
        "visual": "Visual",
        "skill": "技能"
      }
    },
    "toolbar": {
      "filter": "過濾"
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
  QCard,
  QCardTitle,
  QCardMedia,
  QCardMain,
  QIcon,
  QBtn,
  QToggle,
  Dialog
} from 'quasar'
import { toRomaji } from 'wanakana'
import { mapGetters } from 'vuex'

export default {
  name: 'CardOverviewComponent',
  components: {
    QCard,
    QCardTitle,
    QCardMedia,
    QCardMain,
    QIcon,
    QBtn,
    QToggle
  },
  data () {
    return {
      displayName: false,
      selectCharacters: [],
      showCardInfoList: [],
      selectSkills: [],
      selectRarity: [],
      toRomaji
    }
  },
  mounted () {
    if (this.cardInfoList) {
      this.doFilter()
    }
  },
  computed: {
    ...mapGetters('DB', [
      'cardInfoList',
      'characterInfos',
      'skillInfos'
    ])
  },
  watch: {
    cardInfoList (newVal) {
      if (newVal) {
        this.showCardInfoList = newVal.slice().reverse()
      }
    }
  },
  methods: {
    handleMouseOver (ref) {
      if (ref.indexOf('L') !== -1) {
        this.$refs[ref.replace(/L/, 'R')][0].className += ' hide'
      }
      else if (ref.indexOf('R') !== -1) {
        this.$refs[ref.replace(/R/, 'L')][0].className += ' hide'
      }
      this.$refs[ref][0].className += ' show-full'
    },
    handleMouseOut (cardID) {
      this.$refs[`splitL${cardID}`][0].className = 'two-img-split full-height gt-md'
      this.$refs[`splitR${cardID}`][0].className = 'two-img-split full-height gt-md'
    },
    capitalizeFirstLetter (str) {
      return str.split(' ')
        .map(elem => elem.charAt(0).toUpperCase() + elem.slice(1))
        .join(' ')
    },
    doFilter () {
      let ret = this.cardInfoList.slice().reverse()
      if (this.selectCharacters.length) {
        ret = ret.filter(elem => this.selectCharacters.indexOf(elem.characterID) !== -1)
      }
      if (this.selectSkills.length) {
        const cardOfSkills = Object.keys(this.skillMap).filter(key => this.selectSkills.indexOf(this.skillMap[key].skillID) !== -1)
        ret = ret.filter(elem => cardOfSkills.indexOf(elem.cardID) !== -1)
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
              label: '🟊🟊🟊🟊',
              value: '4'
            }, {
              label: '🟊🟊🟊',
              value: '3'
            }, {
              label: '🟊🟊',
              value: '2'
            }, {
              label: '🟊',
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
              value: this.characterInfos[key].characterID
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
              if (prev.find(elem2 => elem2.skillID === curr.skillID)) return prev
              prev.push(curr)
              return prev
            }, []).map(elem => ({
              label: elem.simpleDescription,
              value: elem.skillID
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
.two-img-split
  width: 50%
  height: 100%
  float: left
  background-size: auto 100%
  background-repeat: no-repeat
  transition: width 0.75s

.two-img-split:nth-child(even)
  background-position: 45%

.two-img-split:nth-child(odd)
  background-position: 60%

.two-img-split.show-full
  width: 100%
  background-size: auto 100%

.two-img-split.hide
  width: 0%
  background-size: auto 100%

.one-img-full
  background-size: auto 100%
  background-repeat: no-repeat
  background-position: center

.two-img-full
  background-size: auto 120%
  background-repeat: no-repeat
  background-position: center

.card-img-attr-powerful
  position: absolute
  top: 2%
  right: 5%
  width: 50px
  height: 50px
  background: url('~assets/MenuAtlas.png') no-repeat -1448px -211px

.card-img-attr-cool
  position: absolute
  top: 2%
  right: 5%
  width: 50px
  height: 50px
  background: url('~assets/MenuAtlas.png') no-repeat -1448px -55px

.card-img-attr-happy
  position: absolute
  top: 2%
  right: 5%
  width: 50px
  height: 50px
  background: url('~assets/MenuAtlas.png') no-repeat -1448px -263px

.card-img-attr-pure
  position: absolute
  top: 2%
  right: 5%
  width: 50px
  height: 50px
  background: url('~assets/MenuAtlas.png') no-repeat -1448px -159px
</style>

