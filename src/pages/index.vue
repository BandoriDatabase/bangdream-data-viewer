<template>
  <q-page padding class="column gutter-sm">
    <p style="text-align: center;" v-if="!$q.platform.is.desktop">{{$t('mobile.click-collapsible')}}</p>
    <div v-if="birthdayInfo" class="row items-center gutter-sm">
      <div v-if="birthdayInfo.today">{{$t('common.birthday.today')}}</div>
      <div v-if="birthdayInfo.today"><img :src="`statics/chara_icon_${birthdayInfo.today.chara.characterId}.png`"></div>
      <div>{{$t('common.birthday.next')}} {{`${birthdayInfo.next.birthday.month}/${birthdayInfo.next.birthday.day}`}}</div>
      <div><img :src="`statics/chara_icon_${birthdayInfo.next.chara.characterId}.png`"></div>
    </div>
    <q-collapsible :label="$t('common.event')" v-model="isEventOpen">
      <div class="row col-12 gutter-sm">
        <event-card v-for="server in $servers" :key="server" v-if="server !== 'kr'" class="col-lg-4 col-md-6 col-12" :server="server"></event-card>
      </div>
    </q-collapsible>
    <q-collapsible :label="$t('common.gacha')" v-model="isGachaOpen">
      <q-collapsible :label="$t('common.jp')" v-model="isOpen.jp">
        <lazy-component @show="loadGachaData('jp')">
          <div class="row col-12 gutter-sm">
            <div v-if="isGcahaReady.jp" class="col-xl-3 col-lg-4 col-md-6 col-12" v-for="gacha in currentGachaList.jp" :key="gacha.seq">
              <gacha-card server="jp" :data="gacha" @open-modal="$refs.gachaModal.open(gacha, 'jp')"></gacha-card>
            </div>
            <div v-if="!isGcahaReady.jp" class="col-12">
              <q-spinner color="pink" size="48px"></q-spinner>
            </div>
          </div>
        </lazy-component>
      </q-collapsible>
      <q-collapsible :label="$t('common.tw')" v-model="isOpen.tw">
        <lazy-component @show="loadGachaData('tw')">
          <div class="row col-12 gutter-sm">
            <div v-if="isGcahaReady.tw" class="col-xl-3 col-lg-4 col-md-6 col-12" v-for="gacha in currentGachaList.tw" :key="gacha.seq">
              <gacha-card server="tw" :data="gacha" @open-modal="$refs.gachaModal.open(gacha, 'tw')"></gacha-card>
            </div>
            <div v-if="!isGcahaReady.tw" class="col-12">
              <q-spinner color="pink" size="48px"></q-spinner>
            </div>
          </div>
        </lazy-component>
      </q-collapsible>
      <!-- <q-collapsible :label="$t('common.kr')" v-model="isOpen.kr">
        <lazy-component @show="loadGachaData('kr')">
          <div class="row col-12 gutter-sm">
            <div v-if="isGcahaReady.kr" class="col-xl-3 col-lg-4 col-md-6 col-12" v-for="gacha in currentGachaList.kr" :key="gacha.seq">
              <gacha-card server="kr" :data="gacha" @open-modal="$refs.gachaModal.open(gacha, 'kr')"></gacha-card>
            </div>
            <div v-if="!isGcahaReady.kr" class="col-12">
              <q-spinner color="pink" size="48px"></q-spinner>
            </div>
          </div>
        </lazy-component>
      </q-collapsible> -->
      <q-collapsible :label="$t('common.en')" v-model="isOpen.en">
        <lazy-component @show="loadGachaData('en')">
          <div class="row col-12 gutter-sm">
            <div v-if="isGcahaReady.en" class="col-xl-3 col-lg-4 col-md-6 col-12" v-for="gacha in currentGachaList.en" :key="gacha.seq">
              <gacha-card server="en" :data="gacha" @open-modal="$refs.gachaModal.open(gacha, 'en')"></gacha-card>
            </div>
            <div v-if="!isGcahaReady.en" class="col-12">
              <q-spinner color="pink" size="48px"></q-spinner>
            </div>
          </div>
        </lazy-component>
      </q-collapsible>
    </q-collapsible>
    <gacha-modal ref="gachaModal"></gacha-modal>
  </q-page>
</template>

<style>
</style>

<script>
import { mapState, mapActions } from 'vuex'

import EventCard from 'components/card/event'
import GachaCard from 'components/card/gacha'
import GachaModal from 'components/modals/gacha'

export default {
  name: 'PageIndex',
  components: {
    EventCard,
    GachaCard,
    GachaModal
  },
  mounted () {
    this.$api.getBirthday('jp')
      .then(res => {
        this.birthdayInfo = res
      })
  },
  data () {
    return {
      isOpen: this.$servers.reduce((sum, curr) => {
        sum[curr] = false
        return sum
      }, {}),
      isEventOpen: this.$q.platform.is.desktop,
      isGachaOpen: false,
      birthdayInfo: null,
      isGcahaReady: this.$servers.reduce((sum, curr) => {
        sum[curr] = false
        return sum
      }, {})
    }
  },
  computed: {
    ...mapState('gacha', [
      'currentGachaList'
    ])
  },
  methods: {
    ...mapActions('gacha', [
      'getGachaCurrent'
    ]),
    loadGachaData (server) {
      this.$nextTick(async () => {
        await this.getGachaCurrent(server)
        this.isGcahaReady[server] = true
      })
    }
  }
}
</script>
