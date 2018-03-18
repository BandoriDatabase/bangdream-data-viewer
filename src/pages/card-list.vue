<template>
  <q-page padding>
    <div>
      <div class="block">
        <div>
          {{$t('card.name-display[0]')}}<label><q-toggle v-model="displayName" color="pink"></q-toggle>
          {{displayName ? $t('card.name-display[1]'):$t('card.name-display[2]')}}</label>
        </div>
        <q-collapsible :label="$t('common.filter')" v-model="isFilterVisible">
          <div class="shadow-3" style="padding: 1%;">
            <div class="row gutter">
              <q-select class="col-12" multiple chips v-model="selectRarity" :float-label="$t('common.rarity')"
                :options="rarityOption" color="pink"></q-select>
              <q-select class="col-12" multiple chips v-model="selectAttrs" :float-label="$t('common.attr')"
                :options="attrOption" color="pink"></q-select>
              <q-select class="col-12" multiple chips v-model="selectCharacters" :float-label="$t('common.character')"
                :options="charaOption" color="pink"></q-select>
              <q-select class="col-12" multiple chips v-model="selectSkills" :float-label="$t('common.skill')"
                :options="skillOption" color="pink"></q-select>
            </div>
            <p>{{$t('common.sort.title')}}</p>
            <div class="row gutter">
              <q-radio color="pink" v-model="sortParam" val="asc" :label="$t('common.sort.asc')" />
              <q-radio color="pink" v-model="sortParam" val="desc" :label="$t('common.sort.desc')" />
            </div>
            <br>
            <div class="row gutter">
              <q-radio color="pink" v-model="orderKey" val="cardId" label="ID" />
              <q-radio color="pink" v-model="orderKey" val="rarity" :label="$t('common.rarity')" />
              <q-radio color="pink" v-model="orderKey" val="maxPerformance" :label="$t('common.perform')" />
              <q-radio color="pink" v-model="orderKey" val="maxTechnique" :label="$t('common.technic')" />
              <q-radio color="pink" v-model="orderKey" val="maxVisual" :label="$t('common.visual')" />
              <q-radio color="pink" v-model="orderKey" val="totalMaxParam" :label="$t('common.total')" />
            </div>
            <br>
            <div>
              <q-btn color="pink" @click="doFilter(server), saveFilter(), $ga.event('card-overview', 'filter', `apply-save`)">
                {{$t('common.apply-save')}}
              </q-btn>
            </div>
          </div>
        </q-collapsible>
      </div>
      <q-infinite-scroll ref="cardScroll" v-if="isReady" :handler="loadMore">
        <div class="row gutter-sm">
          <div v-for="card in cardList" :key="card.cardId" class="col-12 col-xl-4 col-lg-6 full-height">
            <q-card style="height: 500px; cursor: pointer;">
              <q-card-media class="full-height" style="position: relative;">
                <span :class="`card-img-attr-${card.attr}`"></span>
                <span :class="`card-img-band-${bandCharaList[server][Number(card.characterId) - 1].bandId}`"></span>
                <img v-lazy:background-image="getCardImg(card.cardId, card.cardRes, 'normal')"
                  @click="$router.push(`/card/${server}/${card.cardId}/0`), $ga.event('card-overview', 'jump', `normal-detail`)"
                  v-if="card.rarity < 3" class="one-img-full full-height">
                <img v-lazy:background-image="getCardImg(card.cardId, card.cardRes, 'after_training')"
                  @click="$router.push(`/card/${server}/${card.cardId}/1`), $ga.event('card-overview', 'jump', `trained-detail`)"
                  v-if="card.title === 'ガルパ杯'" class="one-img-full full-height">
                <div v-lazy:background-image="getCardImg(card.cardId, card.cardRes, 'normal')"
                  @click="$router.push(`/card/${server}/${card.cardId}/0`), $ga.event('card-overview', 'jump', `normal-detail`)"
                  v-if="card.rarity >= 3 && card.title !== 'ガルパ杯'" class="two-img-split full-height gt-md"
                  :ref="`splitL${card.cardId}`" @mouseover="handleMouseOver(`splitL${card.cardId}`)" @mouseout="handleMouseOut(card.cardId)">
                </div>
                <div v-lazy:background-image="getCardImg(card.cardId, card.cardRes, 'after_training')"
                  @click="$router.push(`/card/${server}/${card.cardId}/1`), $ga.event('card-overview', 'jump', `trained-detail`)"
                  v-if="card.rarity >= 3 && card.title !== 'ガルパ杯'" class="two-img-split full-height gt-md"
                  :ref="`splitR${card.cardId}`" @mouseover="handleMouseOver(`splitR${card.cardId}`)" @mouseout="handleMouseOut(card.cardId)">
                </div>
                <div v-lazy:background-image="getCardImg(card.cardId, card.cardRes, 'normal')"
                  @click="$router.push(`/card/${server}/${card.cardId}/0`), $ga.event('card-overview', 'jump', `normal-detail`)"
                  v-if="card.rarity >= 3 && card.title !== 'ガルパ杯'" class="two-img-full full-width lt-md"
                  style="height: 50%;">
                </div>
                <div v-lazy:background-image="getCardImg(card.cardId, card.cardRes, 'after_training')"
                  @click="$router.push(`/card/${server}/${card.cardId}/1`), $ga.event('card-overview', 'jump', `trained-detail`)"
                  v-if="card.rarity >= 3 && card.title !== 'ガルパ杯'" class="two-img-full full-width lt-md"
                  style="height: 50%;">
                </div>
                <q-card-title slot="overlay">
                  [{{card.title}}] {{displayName ?
                    capitalizeFirstLetter(toRomaji(bandCharaList[server][Number(card.characterId) - 1].ruby)) :
                    bandCharaList[server][Number(card.characterId) - 1].characterName}}
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
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
import { toRomaji } from 'wanakana'
import { mapState, mapActions } from 'vuex'

export default {
  // name: 'PageName',
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
        label: this.$t('card.attr.powerful'),
        value: 'powerful',
        color: 'negative'
      }, {
        label: this.$t('card.attr.cool'),
        value: 'cool',
        color: 'indigo'
      }, {
        label: this.$t('card.attr.pure'),
        value: 'pure',
        color: 'green'
      }, {
        label: this.$t('card.attr.happy'),
        value: 'happy',
        color: 'orange'
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
    this.updateData(this.server)
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
  methods: {
    ...mapActions('card', [
      'getSkillList'
    ]),
    ...mapActions('chara', [
      'getBandCharaList'
    ]),
    async updateData (server) {
      this.isReady = false
      if (!LocalStorage.get.item(`cardfilter.${server}`)) LocalStorage.set(`cardfilter.${server}`, {})
      this.selectCharacters = LocalStorage.get.item(`cardfilter.${server}`).charas || []
      this.selectSkills = LocalStorage.get.item(`cardfilter.${server}`).skills || []
      this.selectRarity = LocalStorage.get.item(`cardfilter.${server}`).rarity || []
      this.selectAttrs = LocalStorage.get.item(`cardfilter.${server}`).attrs || []
      this.sortParam = LocalStorage.get.item(`cardfilter.${server}`).sort || 'desc'
      this.orderKey = LocalStorage.get.item(`cardfilter.${server}`).orderKey || 'cardId'
      await this.doFilter(server)
      await this.getBandCharaList(server)
      await this.getSkillList(server)
      this.charaOption = Object.keys(this.bandCharaList[server]).filter(key => Number(key) <= 25).map(key => ({
        label: this.displayName
          ? this.capitalizeFirstLetter(toRomaji(this.bandCharaList[server][key].ruby))
          : this.bandCharaList[server][key].characterName,
        value: this.bandCharaList[server][key].characterId
      }))
      this.skillOption = this.skillList[server].map(elem => ({
        label: elem.simpleDescription,
        value: elem.skillId
      }))
      this.isReady = true
    },
    handleMouseOver (ref) {
      if (ref.indexOf('L') !== -1) {
        this.$refs[ref.replace(/L/, 'R')][0].className += ' hide'
      } else if (ref.indexOf('R') !== -1) {
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
      this.cardList = this.cardList.concat((await this.$api.getCard(params, server)).data)
    },
    async doFilter (server) {
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
        this.cardList = (await this.$api.getCard(this.queryParams, server)).data
      } catch (e) {
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
      } catch (error) {
        console.log('no more cards', error)
        this.$refs.cardScroll.stop()
      } finally {
        done()
      }
    },
    getCardImg (cardId, cardRes, type) {
      if (this.$specialCardList[this.server].indexOf(cardId) !== -1) {
        return `/assets-${this.server}/characters/resourceset/${cardRes}_card_${type}.png`
      }
      return `/assets/characters/resourceset/${cardRes}_card_${type}.png`
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.updateData(to.params.server)
    next()
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
  background url('~assets/icon_powerful.png') no-repeat
  background-size cover

.card-img-attr-cool
  position: absolute
  top: 2%
  right: 5%
  width: 50px
  height: 50px
  background url('~assets/icon_cool.png') no-repeat
  background-size cover

.card-img-attr-happy
  position: absolute
  top: 2%
  right: 5%
  width: 50px
  height: 50px
  background url('~assets/icon_happy.png') no-repeat
  background-size cover

.card-img-attr-pure
  position: absolute
  top: 2%
  right: 5%
  width: 50px
  height: 50px
  background url('~assets/icon_pure.png') no-repeat
  background-size cover

.card-img-band-1
  position: absolute
  top: 2%
  left: 5%
  width: 50px
  height: 50px
  background: url('~assets/band_icon_1.png') no-repeat

.card-img-band-2
  position: absolute
  top: 2%
  left: 5%
  width: 50px
  height: 50px
  background: url('~assets/band_icon_2.png') no-repeat

.card-img-band-3
  position: absolute
  top: 2%
  left: 5%
  width: 50px
  height: 50px
  background: url('~assets/band_icon_3.png') no-repeat

.card-img-band-4
  position: absolute
  top: 2%
  left: 5%
  width: 50px
  height: 50px
  background: url('~assets/band_icon_4.png') no-repeat

.card-img-band-5
  position: absolute
  top: 2%
  left: 5%
  width: 50px
  height: 50px
  background: url('~assets/band_icon_5.png') no-repeat
</style>
