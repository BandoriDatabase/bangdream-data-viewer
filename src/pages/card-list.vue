<template>
  <q-page padding>
    <div>
      <div class="q-mb-lg">
        <span class="text-h3 text-bold">{{$t('left.card')}}</span>
        <q-btn :label="$t('common.filter')" class="float-right q-ml-sm" @click="isFilterVisible = true">
          <q-badge color="pink-6" floating v-if="filterInUse">{{$t('common.filter-applied')}}</q-badge>
        </q-btn>
      </div>
      <q-dialog v-model="isFilterVisible">
        <q-card>
          <q-card-section>
            <div class="row">
              <p class="q-ml-sm col-12">{{$t('common.rarity')}}</p>
              <q-checkbox color="pink" class="col-3" v-model="selectRarity" v-for="opt in rarityOption" :key="`rarity-${opt.value}`" :val="opt.value" :label="opt.label"></q-checkbox>
            </div>
            <div class="row q-mt-md">
              <p class="q-ml-sm col-12">{{$t('common.attr')}}</p>
              <q-checkbox color="pink" class="col-md-3 col-6" v-model="selectAttrs" v-for="opt in attrOption" :key="`attr-${opt.value}`" :val="opt.value" :label="opt.label"></q-checkbox>
            </div>
            <div class="row q-mt-md">
              <p class="q-ml-sm col-12">{{$t('common.character')}}</p>
              <q-checkbox color="pink" class="col-md-3 col-6" v-model="selectCharacters" v-for="opt in charaOption" :key="`chara-${opt.value}`" :val="opt.value" :label="opt.label"></q-checkbox>
            </div>
            <div class="q-mt-md">
              <q-expansion-item
                :label="$t('common.skill')"
              >
                <div class="row">
                  <q-checkbox color="pink" class="col-12" v-model="selectSkills" v-for="opt in skillOption" :key="`skill-${opt.value}`" :val="opt.value" :label="opt.label"></q-checkbox>
                </div>
              </q-expansion-item>
            </div>
          </q-card-section>
          <q-card-section>
            <p class="q-ml-sm">{{$t('common.sort.title')}}</p>
            <div class="row gutter">
              <q-radio color="pink" v-model="sortParam" val="asc" :label="$t('common.sort.asc')" />
              <q-radio color="pink" v-model="sortParam" val="desc" :label="$t('common.sort.desc')" />
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row gutter">
              <q-radio color="pink" v-model="orderKey" val="situationId" label="ID" />
              <q-radio color="pink" v-model="orderKey" val="rarity" :label="$t('common.rarity')" />
              <q-radio color="pink" v-model="orderKey" val="simpleParams.max.performance" :label="$t('common.perform')" />
              <q-radio color="pink" v-model="orderKey" val="simpleParams.max.technique" :label="$t('common.technic')" />
              <q-radio color="pink" v-model="orderKey" val="simpleParams.max.visual" :label="$t('common.visual')" />
              <q-radio color="pink" v-model="orderKey" val="simpleParams.max.total" :label="$t('common.total')" />
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn color="secondary" @click="resetFilter()">
              {{$t('common.reset-filter')}}
            </q-btn>
            <q-btn color="pink" @click="doFilter(server), saveFilter(), isFilterVisible = false, $ga.event('card-overview', 'filter', `apply-save`)">
              {{$t('common.apply-save')}}
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-infinite-scroll ref="cardScroll" v-if="isReady" @load="loadMore">
        <div class="row q-col-gutter-md">
          <div v-for="card in cardList" :key="`card-${card.situationId}`" class="col-12 col-md-6">
            <q-card class="full-height">
              <q-card-section class="q-pb-sm">
                <div class="text-center">
                  <p class="text-h5 q-my-none" :class="`text-${paletteMap[card.attribute]}`">{{card.prefix}}</p>
                  <div class="row items-center justify-center">
                    <img
                      :src="`chara/chara_icon_${bandCharaList[server][Number(card.characterId) - 1].characterId}.png`"
                      style="width: 36px; height: 36px"
                    >
                    <p class="text-subtitle1 q-my-none col-4">{{bandCharaList[server][Number(card.characterId) - 1].characterName}}</p>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div class="row items-center justify-center q-col-gutter-md">
                  <card-thumb :card="card" :server="server" :trained="false" v-if="card.prefix !== 'ガルパ杯'"></card-thumb>
                  <card-thumb :card="card" :server="server" :trained="true" v-if="(card.rarity >= 3 && card.prefix !== 'ガルパ杯') || card.prefix === 'ガルパ杯'"></card-thumb>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-py-sm">
                <p class="q-mb-xs text-center">{{card.skill.skillName}}</p>
                <p class="q-mb-xs" style="min-height: 2.5rem;">{{card.skill.skillDetail.simpleDescription}}</p>
              </q-card-section>
              <q-separator />
              <q-card-actions align="evenly">
                <!-- <q-btn class="text-primary" flat icon="more_horiz">Detail</q-btn> -->
                <q-btn class="text-primary" flat icon="account_box">Profile</q-btn>
                <q-btn class="text-primary" flat icon="record_voice_over">Live 2D</q-btn>
              </q-card-actions>
              <!-- <q-card-actions align="evenly">
                <q-btn class="text-secondary" flat icon="slideshow">Scenario 1</q-btn>
                <q-btn class="text-secondary" flat icon="slideshow">Scenario 2</q-btn>
              </q-card-actions> -->
            </q-card>
          </div>
        </div>
        <template v-slot:loading>
          <div v-if="!infiniteLoading" class="row q-col-gutter-md">
            <div v-for="i in 1" :key="`skel-${i}`" class="col-12 col-md-6">
              <q-card>
                <q-card-section>
                  <q-skeleton type="text" height="32px" />
                  <q-skeleton type="text" height="24px" />
                </q-card-section>
                <q-card-section>
                  <div class="row items-center justify-center q-col-gutter-md">
                    <q-skeleton width="120px" height="120px" />
                    <q-skeleton width="120px" height="120px" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div v-if="infiniteLoading" class="row q-col-gutter-md">
            <div v-for="i in 4" :key="`skel-${i}`" class="col-12 col-md-6">
              <q-card>
                <q-card-section>
                  <q-skeleton type="text" height="32px" />
                  <q-skeleton type="text" height="24px" />
                </q-card-section>
                <q-card-section>
                  <div class="row items-center justify-center q-col-gutter-md">
                    <q-skeleton width="120px" height="120px" />
                    <q-skeleton width="120px" height="120px" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </template>
      </q-infinite-scroll>
      <div v-if="!isReady">
        <div class="row q-col-gutter-md">
          <div v-for="i in 12" :key="`skel-${i}`" class="col-12 col-md-6">
            <q-card>
              <q-card-section>
                <q-skeleton type="text" height="32px" />
                <q-skeleton type="text" height="24px" />
              </q-card-section>
              <q-card-section>
                <div class="row items-center justify-center q-col-gutter-md">
                  <q-skeleton width="120px" height="120px" />
                  <q-skeleton width="120px" height="120px" />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
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
      // displayName: false,
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
      orderKey: 'situationId',
      paletteMap: {
        happy: 'orange-8',
        cool: 'indigo-6',
        pure: 'green-8',
        powerful: 'pink-6'
      },
      infiniteLoading: false
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
    },
    filterInUse () {
      return this.selectCharacters.length || this.selectSkills.length || this.selectRarity.length ||
        this.selectAttrs.length || this.sortParam !== 'desc' || this.orderKey !== 'situationId'
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
      this.orderKey = this.$q.localStorage.getItem(`cardfilter.${server}`).orderKey || 'situationId'
      await this.doFilter(server)
      await this.getBandCharaList(server)
      await this.getSkillList(server)
      this.charaOption = Object.keys(this.bandCharaList[server]).filter(key => Number(key) <= 25).map(key => ({
        label: this.bandCharaList[server][key].characterName,
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
    handleMouseOut (situationId) {
      this.$refs[`splitL${situationId}`][0].className = 'two-img-split full-height gt-md'
      this.$refs[`splitR${situationId}`][0].className = 'two-img-split full-height gt-md'
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
        this.infiniteLoading = true
        this.queryParams.page += 1
        await this.getCardList(this.queryParams, this.server)
        this.infiniteLoading = false
      } catch (error) {
        console.log('no more cards', error)
        this.$refs.cardScroll.stop()
      } finally {
        done()
      }
    },
    resetFilter () {
      this.selectCharacters = []
      this.selectSkills = []
      this.selectRarity = []
      this.selectAttrs = []
      this.sortParam = 'desc'
      this.orderKey = 'situationId'
    }
    // getCardImg (situationId, resourceSetName, type) {
    //   if (this.$specialCardList[this.server].indexOf(situationId) !== -1) {
    //     return `/assets/${this.server}/characters/resourceset/${resourceSetName}_card_${type}.webp`
    //   }
    //   return `/assets/characters/resourceset/${resourceSetName}_card_${type}.webp`
    // },
    // getCardThumb (card, type) {
    //   let groupId = Math.trunc(card.situationId / 50).toString()
    //   groupId = `${'0'.repeat(5 - groupId.length)}${groupId}`
    //   if (this.$specialCardList[this.server].indexOf(card.situationId) !== -1) {
    //     return `/assets/${this.server}/thumb/chara/card${groupId}_${card.resourceSetName}_${type}.webp`
    //   }
    //   return `/assets/thumb/chara/card${groupId}_${card.resourceSetName}_${type}.webp`
    // }
  },
  beforeRouteUpdate (to, from, next) {
    this.updateData(to.params.server)
    next()
  }
}
</script>

<style lang="stylus" scoped>
// .two-img-split
//   width: 50%
//   height: 100%
//   float: left
//   background-size: auto 100%
//   background-repeat: no-repeat
//   transition: width 0.75s

// .two-img-split:nth-child(even)
//   background-position: 45%

// .two-img-split:nth-child(odd)
//   background-position: 60%

// .two-img-split.show-full
//   width: 100%
//   background-size: auto 100%

// .two-img-split.hide
//   width: 0%
//   background-size: auto 100%

// .one-img-full
//   background-size: auto 100%
//   background-repeat: no-repeat
//   background-position: center

// .two-img-full
//   background-size: 100% auto
//   background-repeat: no-repeat
//   background-position: center

// .card-img-attr-powerful
//   position: absolute
//   top: 2%
//   right: 5%
//   width: 50px
//   height: 50px
//   background url('~assets/icon_powerful.png') no-repeat
//   background-size cover

// .card-img-attr-cool
//   position: absolute
//   top: 2%
//   right: 5%
//   width: 50px
//   height: 50px
//   background url('~assets/icon_cool.png') no-repeat
//   background-size cover

// .card-img-attr-happy
//   position: absolute
//   top: 2%
//   right: 5%
//   width: 50px
//   height: 50px
//   background url('~assets/icon_happy.png') no-repeat
//   background-size cover

// .card-img-attr-pure
//   position: absolute
//   top: 2%
//   right: 5%
//   width: 50px
//   height: 50px
//   background url('~assets/icon_pure.png') no-repeat
//   background-size cover

// .card-img-band-1
//   position: absolute
//   top: 2%
//   left: 5%
//   width: 50px
//   height: 50px
//   background: url('~assets/band_icon_1.png') no-repeat

// .card-img-band-2
//   position: absolute
//   top: 2%
//   left: 5%
//   width: 50px
//   height: 50px
//   background: url('~assets/band_icon_2.png') no-repeat

// .card-img-band-3
//   position: absolute
//   top: 2%
//   left: 5%
//   width: 50px
//   height: 50px
//   background: url('~assets/band_icon_3.png') no-repeat

// .card-img-band-4
//   position: absolute
//   top: 2%
//   left: 5%
//   width: 50px
//   height: 50px
//   background: url('~assets/band_icon_4.png') no-repeat

// .card-img-band-5
//   position: absolute
//   top: 2%
//   left: 5%
//   width: 50px
//   height: 50px
//   background: url('~assets/band_icon_5.png') no-repeat

// .card-img-band-18
//   position: absolute
//   top: 2%
//   left: 5%
//   width: 50px
//   height: 50px
//   background: url('~assets/band_icon_18.png') no-repeat

// .card-img-band-21
//   position: absolute
//   top: 2%
//   left: 5%
//   width: 50px
//   height: 50px
//   background: url('~assets/band_icon_21.png') no-repeat

// .card-img-rarity-normal-1
//   position absolute
//   bottom 78%
//   right 6.5%
//   width 35px
//   height 35px
//   background url('~assets/star_untrained.png') no-repeat
//   background-size 100% 100%

// .card-img-rarity-normal-2
//   position absolute
//   bottom 71%
//   right 6.5%
//   width 35px
//   height 35px
//   background url('~assets/star_untrained.png') no-repeat
//   background-size 100% 100%

// .card-img-rarity-normal-3
//   position absolute
//   bottom 64%
//   right 6.5%
//   width 35px
//   height 35px
//   background url('~assets/star_untrained.png') no-repeat
//   background-size 100% 100%

// .card-img-rarity-normal-4
//   position absolute
//   bottom 57%
//   right 6.5%
//   width 35px
//   height 35px
//   background url('~assets/star_untrained.png') no-repeat
//   background-size 100% 100%

p.card-list-param > div
  margin 0 2px
</style>
