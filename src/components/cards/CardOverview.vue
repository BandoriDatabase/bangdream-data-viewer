<template>
  <div>
    <div class="block">
      <p>{{$t('hint[0]')}}<span class="desktop-only">{{$t('hint[1]')}}</span><span class="mobile-only">{{$t('hint[2]')}}</span>{{$t('hint[3]')}}</p>
      <div>
        {{$t('hint[4]')}}<label><q-toggle v-model="displayName"></q-toggle>{{displayName ? $t('hint[5]'):$t('hint[6]')}}</label>
        <q-btn color="pink" @click="isFilterVisible = !isFilterVisible, $ga.event('card-overview', 'filter', `open-close`, Number(isFilterVisible))">{{$t('toolbar.filter')}}</q-btn>
      </div>
      <q-slide-transition>
        <div class="shadow-3" style="padding: 1%;" v-show="isFilterVisible">
          <p>{{$t('filter.title')}}</p>
          <div class="row gutter">
            <q-select class="col-12" multiple chips v-model="selectRarity" :float-label="$t('filter.rarity')"
              :options="rarityOption" color="pink"></q-select>
            <q-select class="col-12" multiple chips v-model="selectAttrs" :float-label="$t('filter.attr')"
              :options="attrOption" color="pink"></q-select>
            <q-select class="col-12" multiple chips v-model="selectCharacters" :float-label="$t('filter.character')"
              :options="charaOption" color="pink"></q-select>
            <q-select class="col-12" multiple chips v-model="selectSkills" :float-label="$t('filter.skill')"
              :options="skillOption" color="pink"></q-select>
          </div>
          <p>{{$t('sort.title')}}</p>
          <div class="row gutter">
            <q-radio color="pink" v-model="sortParam" val="asc" :label="$t('sort.asc')" />
            <q-radio color="pink" v-model="sortParam" val="desc" :label="$t('sort.desc')" />
          </div>
          <br>
          <div class="row gutter">
            <q-radio color="pink" v-model="orderKey" val="cardId" label="ID" />
            <q-radio color="pink" v-model="orderKey" val="rarity" :label="$t('filter.rarity')" />
            <q-radio color="pink" v-model="orderKey" val="maxPerformance" :label="$t('table.label.perform')" />
            <q-radio color="pink" v-model="orderKey" val="maxTechnique" :label="$t('table.label.technic')" />
            <q-radio color="pink" v-model="orderKey" val="maxVisual" :label="$t('table.label.visual')" />
            <q-radio color="pink" v-model="orderKey" val="totalMaxParam" :label="$t('sort.total')" />
          </div>
          <br>
          <div>
            <q-btn color="pink" @click="doFilter(), saveFilter(), $ga.event('card-overview', 'filter', `apply-save`)">{{$t('filter.apply-save')}}</q-btn>
          </div>
        </div>
      </q-slide-transition>
    </div>
    <q-infinite-scroll ref="cardScroll" v-if="isReady" :handler="loadMore">
      <div class="row">
        <div v-for="card in cardList" :key="card.cardId" class="col-12 col-xl-4 col-lg-6 full-height">
          <q-card style="height: 500px; cursor: pointer;">
            <q-card-media class="full-height" style="position: relative;">
              <span :class="`card-img-attr-${card.attr}`"></span>
              <span :class="`card-img-band-${bandCharaList[server][Number(card.characterId) - 1].bandId}`"></span>
              <img v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_normal.png`"
                @click="$router.push({ name: 'cardDetail', params: { cardId: card.cardId, isTrained: 0 } }), $ga.event('card-overview', 'jump', `normal-detail`, card.cardId)"
                v-if="card.rarity < 3" class="one-img-full full-height">
              <img v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_after_training.png`"
                @click="$router.push({ name: 'cardDetail', params: { cardId: card.cardId, isTrained: 1 } }), $ga.event('card-overview', 'jump', `trained-detail`, card.cardId)"
                v-if="card.title === 'ガルパ杯'" class="one-img-full full-height">
              <div v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_normal.png`"
                @click="$router.push({ name: 'cardDetail', params: { cardId: card.cardId, isTrained: 0 } }), $ga.event('card-overview', 'jump', `normal-detail`, card.cardId)"
                v-if="card.rarity >= 3 && card.title !== 'ガルパ杯'" class="two-img-split full-height gt-md"
                :ref="`splitL${card.cardId}`" @mouseover="handleMouseOver(`splitL${card.cardId}`)" @mouseout="handleMouseOut(card.cardId)">
              </div>
              <div v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_after_training.png`"
                @click="$router.push({ name: 'cardDetail', params: { cardId: card.cardId, isTrained: 1 } }), $ga.event('card-overview', 'jump', `trained-detail`, card.cardId)"
                v-if="card.rarity >= 3 && card.title !== 'ガルパ杯'" class="two-img-split full-height gt-md"
                :ref="`splitR${card.cardId}`" @mouseover="handleMouseOver(`splitR${card.cardId}`)" @mouseout="handleMouseOut(card.cardId)">
              </div>
              <div v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_normal.png`"
                @click="$router.push({ name: 'cardDetail', params: { cardId: card.cardId, isTrained: 0 } }), $ga.event('card-overview', 'jump', `normal-detail`, card.cardId)"
                v-if="card.rarity >= 3 && card.title !== 'ガルパ杯'" class="two-img-full full-width lt-md"
                style="height: 50%;">
              </div>
              <div v-lazy:background-image="`/assets/characters/resourceset/${card.cardRes}_card_after_training.png`"
                @click="$router.push({ name: 'cardDetail', params: { cardId: card.cardId, isTrained: 1 } }), $ga.event('card-overview', 'jump', `trained-detail`, card.cardId)"
                v-if="card.rarity >= 3 && card.title !== 'ガルパ杯'" class="two-img-full full-width lt-md"
                style="height: 50%;">
              </div>
              <q-card-title slot="overlay">
                [{{card.title}}] {{displayName ? capitalizeFirstLetter(toRomaji(bandCharaList[server][Number(card.characterId) - 1].ruby)) : bandCharaList[server][Number(card.characterId) - 1].characterName}}
                <span v-for="i in Number(card.rarity)" :key="i">&#x2605;</span><br>
                {{skillList[server].find(elem => elem.skillId === card.skill.skillId).simpleDescription}}<br>
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
      "filter": "Open/Close filter"
    },
    "filter": {
      "title": "Filter options",
      "message": "Following filters are avaliable: Characters, Skills, Rarity",
      "character": "Characters",
      "skill": "Skills",
      "rarity": "Rarity",
      "apply-save": "Save & Apply",
      "attr": "Attribute"
    },
    "attr": {
      "powerful": "Powerful (Red)",
      "pure": "Pure (Green)",
      "cool": "Cool (Blue)",
      "happy": "Happy (Yellow)"
    },
    "sort": {
      "title": "Sort options",
      "asc": "Forward",
      "desc": "Backward",
      "total": "Total"
    }
  },
  "zh-cn": {
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
      "filter": "打开/关闭过滤"
    },
    "filter": {
      "title": "过滤选项",
      "message": "可以按照下列条件过滤：角色名，技能，稀有度",
      "character": "角色名",
      "skill": "技能",
      "rarity": "稀有度",
      "apply-save": "应用和保存过滤选项",
      "attr": "属性"
    },
    "attr": {
      "powerful": "Powerful (红)",
      "pure": "Pure (绿)",
      "cool": "Cool (蓝)",
      "happy": "Happy (黄)"
    },
    "sort": {
      "title": "排序选项",
      "asc": "正序",
      "desc": "倒序",
      "total": "属性之和"
    }
  },
  "zh-tw": {
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
      "filter": "打開/關閉過濾"
    },
    "filter": {
      "title": "過濾選項",
      "message": "可以按照下列條件過濾：角色名，技能，稀有度",
      "character": "角色名",
      "skill": "技能",
      "rarity": "稀有度",
      "apply-save": "應用和保存過濾選項",
      "attr": "屬性"
    },
    "attr": {
      "powerful": "Powerful (紅)",
      "pure": "Pure (綠)",
      "cool": "Cool (藍)",
      "happy": "Happy (黃)"
    },
    "sort": {
      "title": "排序選項",
      "asc": "正序",
      "desc": "倒序",
      "total": "屬性之和"
    }
  },
  "ja": {
    "hint": [
      "ヒント: ジャケット写真を",
      "クリックする",
      "タップする",
      "と詳細情報が表示されます",
      "名前表示方法",
      "ローマ字",
      "日本語"
    ],
    "table": {
      "title": "カード情報一覧",
      "label": {
        "thumb": "アイコン",
        "name": "名前",
        "title": "カード名",
        "perform": "パフォーマンス",
        "technic": "テクニック",
        "visual": "ビジュアル",
        "skill": "スキル"
      }
    },
    "toolbar": {
      "filter": "フィルター"
    },
    "filter": {
      "title": "フィルター設定",
      "message": "これらの項目で「キャラクター、スキル、リアリティ」をフィルタすることができます",
      "character": "キャラクター",
      "skill": "スキル",
      "rarity": "リアリティ"
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
  QSpinner,
  QInnerLoading,
  QInfiniteScroll,
  QSlideTransition,
  QSelect,
  LocalStorage,
  QRadio
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
    QInfiniteScroll,
    QSlideTransition,
    QSelect,
    QRadio
  },
  data () {
    return {
      displayName: false,
      selectCharacters: [],
      selectSkills: [],
      selectRarity: [],
      selectAttrs: [],
      rarityOption: [{
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
      }],
      charaOption: [],
      skillOption: [],
      attrOption: [{
        label: this.$t('attr.powerful'),
        value: 'powerful',
        leftImage: 'statics/icon_powerful.png'
      }, {
        label: this.$t('attr.cool'),
        value: 'cool',
        leftColor: 'indigo-6'
      }, {
        label: this.$t('attr.pure'),
        value: 'pure',
        leftColor: 'green-8'
      }, {
        label: this.$t('attr.happy'),
        value: 'happy',
        color: 'orange-6'
      }],
      cardList: [],
      queryParams: {limit: 12, page: 1},
      toRomaji,
      isReady: false,
      isFilterVisible: false,
      sortParam: 'desc',
      orderKey: 'cardId'
    }
  },
  mounted () {
    if (!LocalStorage.get.item(`cardfilter.${this.server}`)) LocalStorage.set(`cardfilter.${this.server}`, {})
    this.selectCharacters = LocalStorage.get.item(`cardfilter.${this.server}`).charas || []
    this.selectSkills = LocalStorage.get.item(`cardfilter.${this.server}`).skills || []
    this.selectRarity = LocalStorage.get.item(`cardfilter.${this.server}`).rarity || []
    this.selectAttrs = LocalStorage.get.item(`cardfilter.${this.server}`).attrs || []
    this.sortParam = LocalStorage.get.item(`cardfilter.${this.server}`).sort || 'desc'
    this.orderKey = LocalStorage.get.item(`cardfilter.${this.server}`).orderKey || 'cardId'

    this.$nextTick(async () => {
      // await this.getCardList(this.queryParams, this.server)
      await this.doFilter()
      await this.getBandCharaList(this.server)
      await this.getSkillList(this.server)
      this.charaOption = Object.keys(this.bandCharaList[this.server]).filter(key => Number(key) <= 25).map(key => ({
        label: this.displayName
          ? this.capitalizeFirstLetter(toRomaji(this.bandCharaList[this.server][key].ruby))
          : this.bandCharaList[this.server][key].characterName,
        value: this.bandCharaList[this.server][key].characterId
      }))
      this.skillOption = this.skillList[this.server].map(elem => ({
        label: elem.simpleDescription,
        value: elem.skillId
      }))
      this.isReady = true
    })
  },
  computed: {
    ...mapState('card', [
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
      if (!LocalStorage.get.item(`cardfilter.${this.server}`)) LocalStorage.set(`cardfilter.${this.server}`, {})
      this.selectCharacters = LocalStorage.get.item(`cardfilter.${this.server}`).charas || []
      this.selectSkills = LocalStorage.get.item(`cardfilter.${this.server}`).skills || []
      this.selectRarity = LocalStorage.get.item(`cardfilter.${this.server}`).rarity || []
      this.selectAttrs = LocalStorage.get.item(`cardfilter.${this.server}`).attrs || []
      this.sortParam = LocalStorage.get.item(`cardfilter.${this.server}`).sort || 'desc'
      this.orderKey = LocalStorage.get.item(`cardfilter.${this.server}`).orderKey || 'cardId'
      this.$nextTick(async () => {
        // await this.getCardList(this.queryParams, this.server)
        await this.doFilter()
        await this.getBandCharaList(this.server)
        await this.getSkillList(this.server)
        this.charaOption = Object.keys(this.bandCharaList[this.server]).filter(key => Number(key) <= 25).map(key => ({
          label: this.displayName
            ? this.capitalizeFirstLetter(toRomaji(this.bandCharaList[this.server][key].ruby))
            : this.bandCharaList[this.server][key].characterName,
          value: this.bandCharaList[this.server][key].characterId
        }))
        this.skillOption = this.skillList[this.server].map(elem => ({
          label: elem.simpleDescription,
          value: elem.skillId
        }))
        this.isReady = true
      })
    }
  },
  methods: {
    ...mapActions('card', [
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
    async getCardList (params, server) {
      this.cardList = this.cardList.concat((await apiDBInfo.getCard(params, server)).data)
    },
    async doFilter () {
      this.isReady = false
      this.queryParams = {
        limit: 12,
        page: 1,
        rarity: this.selectRarity,
        charaId: this.selectCharacters,
        attr: this.selectAttrs,
        skill: this.selectSkills,
        sort: this.sortParam,
        orderKey: this.orderKey
      }
      if (this.$refs.cardScroll) this.$refs.cardScroll.reset()
      try {
        this.cardList = (await apiDBInfo.getCard(this.queryParams, this.server)).data
      }
      catch (e) {
        this.cardList = []
      }
      this.isReady = true
    },
    saveFilter () {
      LocalStorage.set(`cardfilter.${this.server}`, {
        rarity: this.selectRarity,
        charas: this.selectCharacters,
        attrs: this.selectAttrs,
        skills: this.selectSkills,
        sort: this.sortParam,
        orderKey: this.orderKey
      })
    },
    async loadMore (index, done) {
      try {
        this.queryParams.page += 1
        await this.getCardList(this.queryParams, this.server)
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

