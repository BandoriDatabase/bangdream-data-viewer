<template>
  <div>
    <div class="block">
      <p>{{$t('hint[0]')}}<span class="desktop-only">{{$t('hint[1]')}}</span><span class="mobile-only">{{$t('hint[2]')}}</span>{{$t('hint[3]')}}</p>
      <p>{{$t('hint[4]')}}<label><q-toggle v-model="displayName"></q-toggle>{{displayName ? $t('hint[5]'):$t('hint[6]')}}</label></p>
    </div>
    <div>
      <q-btn color="pink" @click="showFilter">{{$t('toolbar.filter')}}</q-btn>
      <!-- <q-btn color="pink" @click="showFilter">{{$t('toolbar.next-page')}}</q-btn> -->
    </div>
    <q-infinite-scroll ref="cardScroll" v-if="isReady" :handler="loadMore">
      <div class="row">
        <div v-for="card in showCardInfoList" :key="card.cardId" class="col-12 col-xl-4 col-lg-6 full-height">
          <q-card style="height: 500px; cursor: pointer;" @click="$router.push({ name: 'cardDetail', params: { cardId: card.cardId } })">
            <q-card-media class="full-height" style="position: relative;">
              <span :class="`card-img-attr-${card.attr}`"></span>
              <span :class="`card-img-band-${bandCharaList[server][Number(card.characterId) - 1].bandId}`"></span>
              <img v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_normal.png`" v-if="card.rarity < 3" class="one-img-full full-height">
              <div v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_normal.png`" v-if="card.rarity >= 3" class="two-img-split full-height gt-md"
                :ref="`splitL${card.cardId}`" @mouseover="handleMouseOver(`splitL${card.cardId}`)" @mouseout="handleMouseOut(card.cardId)">
              </div>
              <div v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_after_training.png`" v-if="card.rarity >= 3" class="two-img-split full-height gt-md"
                :ref="`splitR${card.cardId}`" @mouseover="handleMouseOver(`splitR${card.cardId}`)" @mouseout="handleMouseOut(card.cardId)">
              </div>
              <div v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_normal.png`" v-if="card.rarity >= 3" class="two-img-full full-width lt-md"
                style="height: 50%;">
              </div>
              <div v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_after_training.png`" v-if="card.rarity >= 3" class="two-img-full full-width lt-md"
                style="height: 50%;">
              </div>
              <q-card-title slot="overlay">
                [{{card.title}}] {{displayName ? capitalizeFirstLetter(toRomaji(bandCharaList[server][Number(card.characterId) - 1].ruby)) : bandCharaList[server][Number(card.characterId) - 1].characterName}}
                <span v-for="i in Number(card.rarity)" :key="i">&#x2605;</span><br>
                {{skillList[server][card.skill.skillId - 1].simpleDescription}}<br>
                Lv {{card.maxLevel}}: {{card.maxPerformance}}/{{card.maxTechnique}}/{{card.maxVisual}}/{{card.totalMaxParam}}
              </q-card-title>
            </q-card-media>
          </q-card>
        </div>
      </div>
      
      <div slot="message" class="row justify-center items-center" style="margin-bottom: 50px;">
        <q-spinner color="pink" size="48px"></q-spinner>
        Loading more cards...
      </div>
    </q-infinite-scroll>
    <q-inner-loading :visible="!isReady">
      <q-spinner color="pink" size="48px"></q-spinner>
    </q-inner-loading>
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
  Dialog,
  QSpinner,
  QInnerLoading,
  QInfiniteScroll
} from 'quasar'
import { toRomaji } from 'wanakana'
import { mapState, mapActions } from 'vuex'
import apiDBInfo from 'api/dbinfo'

export default {
  name: 'CardOverviewComponent',
  components: {
    QCard,
    QCardTitle,
    QCardMedia,
    QCardMain,
    QIcon,
    QBtn,
    QToggle,
    QSpinner,
    QInnerLoading,
    QInfiniteScroll
  },
  data () {
    return {
      displayName: false,
      selectCharacters: [],
      showCardInfoList: [],
      selectSkills: [],
      selectRarity: [],
      toRomaji,
      isReady: false
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getCardList({ params: {limit: 12, page: 1}, server: this.server })
      await this.getBandCharaList(this.server)
      await this.getSkillList(this.server)
      this.doFilter()
      this.isReady = true
    })
  },
  computed: {
    ...mapState('card', [
      'cardList',
      'skillList'
    ]),
    ...mapState('chara', [
      'bandCharaList'
    ]),
    server () {
      return this.$route.params.server
    }
  },
  watch: {
    '$route.params.server': function () {
      this.isReady = false
      this.$nextTick(async () => {
        await this.getCardList({ params: {limit: 12, page: 1}, server: this.server })
        await this.getBandCharaList(this.server)
        await this.getSkillList(this.server)
        this.doFilter()
        this.isReady = true
      })
    }
  },
  methods: {
    ...mapActions('card', [
      'getCardList',
      'getSkillList'
    ]),
    ...mapActions('chara', [
      'getBandCharaList'
    ]),
    handleMouseOver (ref) {
      if (ref.indexOf('L') !== -1) {
        this.$refs[ref.replace(/L/, 'R')][0].className += ' hide'
      }
      else if (ref.indexOf('R') !== -1) {
        this.$refs[ref.replace(/R/, 'L')][0].className += ' hide'
      }
      this.$refs[ref][0].className += ' show-full'
    },
    handleMouseOut (cardId) {
      this.$refs[`splitL${cardId}`][0].className = 'two-img-split full-height gt-md'
      this.$refs[`splitR${cardId}`][0].className = 'two-img-split full-height gt-md'
    },
    capitalizeFirstLetter (str) {
      return str.split(' ')
        .map(elem => elem.charAt(0).toUpperCase() + elem.slice(1))
        .join(' ')
    },
    async doFilter () {
      let ret = this.cardList[this.server].slice()
      if (this.selectCharacters.length) {
        ret = ret.filter(elem => this.selectCharacters.indexOf(elem.characterId) !== -1)
      }
      if (this.selectSkills.length) {
        let tempRet = []
        for (let skillId of this.selectSkills) {
          const cardOfSkills = await apiDBInfo.getCardsBySkillId(skillId)
          tempRet = tempRet.concat(ret.filter(elem => cardOfSkills.indexOf(elem.cardId) !== -1))
        }
        ret = tempRet
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
              value: 4
            }, {
              label: '\u2605\u2605\u2605',
              value: 3
            }, {
              label: '\u2605\u2605',
              value: 2
            }, {
              label: '\u2605',
              value: 1
            }]
          },
          header1: {
            type: 'heading',
            label: this.$t('filter.heading1')
          },
          characters: {
            type: 'checkbox',
            model: this.selectCharacters,
            items: Object.keys(this.bandCharaList[this.server]).filter(key => Number(key) <= 25).map(key => ({
              label: this.displayName
                ? this.capitalizeFirstLetter(toRomaji(this.bandCharaList[this.server][key].ruby))
                : this.bandCharaList[this.server][key].characterName,
              value: this.bandCharaList[this.server][key].characterId
            }))
          },
          header2: {
            type: 'heading',
            label: this.$t('filter.heading2')
          },
          skills: {
            type: 'checkbox',
            model: this.selectSkills,
            items: this.skillList[this.server].map(elem => ({
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
    },
    async loadMore (index, done) {
      try {
        await this.getCardList({ params: {limit: 12, page: index + 1}, server: this.server })
        this.doFilter()
      }
      catch (error) {
        console.log('no more cards')
        this.$refs.cardScroll.stop()
      }
      finally {
        done()
      }
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
  background url('/statics/icon_powerful.png') no-repeat
  background-size cover

.card-img-attr-cool
  position: absolute
  top: 2%
  right: 5%
  width: 50px
  height: 50px
  background url('/statics/icon_cool.png') no-repeat
  background-size cover

.card-img-attr-happy
  position: absolute
  top: 2%
  right: 5%
  width: 50px
  height: 50px
  background url('/statics/icon_happy.png') no-repeat
  background-size cover

.card-img-attr-pure
  position: absolute
  top: 2%
  right: 5%
  width: 50px
  height: 50px
  background url('/statics/icon_pure.png') no-repeat
  background-size cover

.card-img-band-1
  position: absolute
  top: 2%
  left: 5%
  width: 50px
  height: 50px
  background: url('/statics/band_icon_1.png') no-repeat

.card-img-band-2
  position: absolute
  top: 2%
  left: 5%
  width: 50px
  height: 50px
  background: url('/statics/band_icon_2.png') no-repeat

.card-img-band-3
  position: absolute
  top: 2%
  left: 5%
  width: 50px
  height: 50px
  background: url('/statics/band_icon_3.png') no-repeat

.card-img-band-4
  position: absolute
  top: 2%
  left: 5%
  width: 50px
  height: 50px
  background: url('/statics/band_icon_4.png') no-repeat

.card-img-band-5
  position: absolute
  top: 2%
  left: 5%
  width: 50px
  height: 50px
  background: url('/statics/band_icon_5.png') no-repeat
</style>

