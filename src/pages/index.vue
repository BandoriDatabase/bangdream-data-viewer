<template>
  <q-page padding class="column gutter-sm">
    <p style="text-align: center;" v-if="!$q.platform.is.desktop">{{$t('mobile.click-collapsible')}}</p>
    <div v-if="birthdayInfo" class="row items-center gutter-sm">
      <div v-if="birthdayInfo.today.length">{{$t('common.birthday.today')}}</div>
      <div v-if="birthdayInfo.today.length">
        <img v-for="todayInfo in birthdayInfo.today" :key="todayInfo.chara.characterId" :src="`statics/chara_icon_${todayInfo.chara.characterId}.png`">
      </div>
      <div>{{$t('common.birthday.next')}} {{`${birthdayInfo.next[0].birthday.month}/${birthdayInfo.next[0].birthday.day}`}}</div>
      <div>
        <img v-for="nextInfo in birthdayInfo.next" :key="nextInfo.chara.characterId" :src="`statics/chara_icon_${nextInfo.chara.characterId}.png`">
      </div>
    </div>
    <q-collapsible :label="$t('common.event')" v-model="isEventOpen">
      <div class="row col-12 gutter-sm">
        <div v-for="server in servers" :key="server" class="col-lg-4 col-md-6 col-12">
          <event-card :server="server"></event-card>
        </div>
      </div>
    </q-collapsible>
    <q-collapsible :label="$t('common.gacha')" v-model="isGachaOpen">
      <q-collapsible :label="$t('common.jp')" v-model="isOpen.jp">
        <lazy-component @show="loadGachaData('jp')">
          <div class="row col-12 gutter-sm">
            <div v-if="isGcahaReady.jp" class="row col-12 gutter-sm">
              <gacha-card server="jp" class="col-xl-3 col-lg-4 col-md-6 col-12" v-for="gacha in currentGachaList.jp" :key="gacha.seq" :data="gacha" @open-modal="$refs.gachaModal.open(gacha, 'jp')"></gacha-card>
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
            <div v-if="isGcahaReady.tw" class="row col-12 gutter-sm">
              <gacha-card server="tw" class="col-xl-3 col-lg-4 col-md-6 col-12" v-for="gacha in currentGachaList.tw" :key="gacha.seq" :data="gacha" @open-modal="$refs.gachaModal.open(gacha, 'tw')"></gacha-card>
            </div>
            <div v-if="!isGcahaReady.tw" class="col-12">
              <q-spinner color="pink" size="48px"></q-spinner>
            </div>
          </div>
        </lazy-component>
      </q-collapsible>
      <q-collapsible :label="$t('common.en')" v-model="isOpen.en">
        <lazy-component @show="loadGachaData('en')">
          <div class="row col-12 gutter-sm">
            <div v-if="isGcahaReady.en" class="row col-12 gutter-sm">
              <gacha-card server="en" class="col-xl-3 col-lg-4 col-md-6 col-12" v-for="gacha in currentGachaList.en" :key="gacha.seq" :data="gacha" @open-modal="$refs.gachaModal.open(gacha, 'en')"></gacha-card>
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
    ]),
    servers () {
      return this.$servers.filter(elem => elem !== 'kr')
    }
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
