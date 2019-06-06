<template>
  <q-page padding>
    <div>
      <div style="margin-bottom: 30px;">
        <span class="q-display-2 text-bold">{{$t('left.card')}}</span>
        <q-btn :label="$t('common.filter')" style="margin-left: 10px;" class="float-right" @click="isFilterVisible = true"></q-btn>
      </div>
      <q-modal v-model="isFilterVisible" :content-css="{padding: '15px', maxWidth: '500px'}">
        <div>
          <div class="row">
            <p class="col-12">{{$t('common.rarity')}}</p>
            <q-checkbox color="pink" class="col-3" v-model="selectRarity" v-for="opt in rarityOption" :key="opt.value" :val="opt.value" :label="opt.label"></q-checkbox>
          </div>
          <div class="row q-mt-md">
            <p class="col-12">{{$t('common.attr')}}</p>
            <q-checkbox color="pink" class="col-md-3 col-6" v-model="selectAttrs" v-for="opt in attrOption" :key="opt.value" :val="opt.value" :label="opt.label"></q-checkbox>
          </div>
          <div class="row q-mt-md">
            <p class="col-12">{{$t('common.character')}}</p>
            <q-checkbox color="pink" class="col-md-3 col-6" v-model="selectCharacters" v-for="opt in charaOption" :key="opt.value" :val="opt.value" :label="opt.label"></q-checkbox>
          </div>
          <div class="row q-mt-md">
            <p class="col-12">{{$t('common.skill')}}</p>
            <q-checkbox color="pink" class="col-12" v-model="selectSkills" v-for="opt in skillOption" :key="opt.value" :val="opt.value" :label="opt.label"></q-checkbox>
          </div>
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
          <q-radio color="pink" v-model="orderKey" val="simpleParams.max.performance" :label="$t('common.perform')" />
          <q-radio color="pink" v-model="orderKey" val="simpleParams.max.technique" :label="$t('common.technic')" />
          <q-radio color="pink" v-model="orderKey" val="simpleParams.max.visual" :label="$t('common.visual')" />
          <q-radio color="pink" v-model="orderKey" val="simpleParams.max.total" :label="$t('common.total')" />
        </div>
        <br>
        <div>
          <q-btn color="pink" @click="doFilter(server), saveFilter(), isFilterVisible = false, $ga.event('card-overview', 'filter', `apply-save`)">
            {{$t('common.apply-save')}}
          </q-btn>
        </div>
      </q-modal>
      <q-infinite-scroll ref="cardScroll" v-if="isReady" :handler="loadMore">
        <div class="row gutter-sm">
          <div v-for="card in cardList" :key="card.cardId" class="col-12 col-xl-3 col-md-4 full-height">
            <q-card>
              <q-card-main>
                <div style="text-align: center;">
                  <p class="q-subheading" :class="`text-${paletteMap[card.attr]}`">{{card.title}}</p>
                  <p class="q-headline">{{displayName ?
                    capitalizeFirstLetter(toRomaji(bandCharaList[server][Number(card.characterId) - 1].ruby)) :
                    bandCharaList[server][Number(card.characterId) - 1].characterName}}</p>
                </div>
                <div class="row items-center justify-center" style="padding-bottom: 10px;">
                  <card-thumb :card="card" :server="server" :trained="false" v-if="card.title !== 'ガルパ杯'"></card-thumb>
                  <card-thumb :card="card" :server="server" :trained="true" v-if="(card.rarity >= 3 && card.title !== 'ガルパ杯') || card.title === 'ガルパ杯'"></card-thumb>
                </div><!--
                <div style="text-align: center;">
                  <p class="q-body-1">[{{card.skill.skillName}}]<br>{{skillList[server].find(elem => elem.skillId === card.skill.skillId).simpleDescription}}</p>
                  <p class="q-body-1 card-list-param">Lv {{card.simpleParams.min.level}}:
                    <q-chip small color="pink-6">{{card.simpleParams.min.performance}}</q-chip>
                    <q-chip small color="indigo-6">{{card.simpleParams.min.technique}}</q-chip>
                    <q-chip small color="orange-8">{{card.simpleParams.min.visual}}</q-chip>
                    <q-chip small color="gray" class="text-black">{{card.simpleParams.min.total}}</q-chip>
                  </p>
                  <p class="q-body-1 card-list-param">Lv {{card.simpleParams.max.level}}:
                    <q-chip small color="pink-6">{{card.simpleParams.max.performance}}</q-chip>
                    <q-chip small color="indigo-6">{{card.simpleParams.max.technique}}</q-chip>
                    <q-chip small color="orange-8">{{card.simpleParams.max.visual}}</q-chip>
                    <q-chip small color="gray" class="text-black">{{card.simpleParams.max.total}}</q-chip>
                  </p>
                </div>-->
              </q-card-main>
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
import { toRomaji } from 'wanakana'
import { mapState, mapActions } from 'vuex'
import CardThumb from 'components/common/card-thumb'

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
      queryParams: { limit: 12, page: 1 },
      toRomaji,
      isReady: false,
      isFilterVisible: false,
      sortParam: 'desc',
      orderKey: 'cardId',
      paletteMap: {
        happy: 'orange-8',
        cool: 'indigo-6',
        pure: 'green-8',
        powerful: 'pink-6'
      }
    }
  },
  mounted () {
    this.updateData(this.server)
  },
  components: {
    CardThumb
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
      if (!this.$q.localStorage.getItem(`cardfilter.${server}`)) this.$q.localStorage.set(`cardfilter.${server}`, {})
      this.selectCharacters = this.$q.localStorage.getItem(`cardfilter.${server}`).charas || []
      this.selectSkills = this.$q.localStorage.getItem(`cardfilter.${server}`).skills || []
      this.selectRarity = this.$q.localStorage.getItem(`cardfilter.${server}`).rarity || []
      this.selectAttrs = this.$q.localStorage.getItem(`cardfilter.${server}`).attrs || []
      this.sortParam = this.$q.localStorage.getItem(`cardfilter.${server}`).sort || 'desc'
      this.orderKey = this.$q.localStorage.getItem(`cardfilter.${server}`).orderKey || 'cardId'
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
      this.$q.localStorage.set(`cardfilter.${this.server}`, {
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
    }
    // getCardImg (cardId, cardRes, type) {
    //   if (this.$specialCardList[this.server].indexOf(cardId) !== -1) {
    //     return `/assets-${this.server}/characters/resourceset/${cardRes}_card_${type}.png`
    //   }
    //   return `/assets/characters/resourceset/${cardRes}_card_${type}.png`
    // },
    // getCardThumb (card, type) {
    //   let groupId = Math.trunc(card.cardId / 50).toString()
    //   groupId = `${'0'.repeat(5 - groupId.length)}${groupId}`
    //   if (this.$specialCardList[this.server].indexOf(card.cardId) !== -1) {
    //     return `/assets-${this.server}/thumb/chara/card${groupId}_${card.cardRes}_${type}.png`
    //   }
    //   return `/assets/thumb/chara/card${groupId}_${card.cardRes}_${type}.png`
    // }
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
  background-size: 100% auto
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

.card-img-rarity-normal-1
  position absolute
  bottom 78%
  right 6.5%
  width 35px
  height 35px
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

.card-img-rarity-normal-2
  position absolute
  bottom 71%
  right 6.5%
  width 35px
  height 35px
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

.card-img-rarity-normal-3
  position absolute
  bottom 64%
  right 6.5%
  width 35px
  height 35px
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

.card-img-rarity-normal-4
  position absolute
  bottom 57%
  right 6.5%
  width 35px
  height 35px
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

p.card-list-param > div
  margin 0 2px
</style>
