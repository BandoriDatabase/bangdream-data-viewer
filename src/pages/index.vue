<template>
  <q-page padding class="column q-gutter-sm">
    <!-- <p style="text-align: center;" v-if="!$q.platform.is.desktop">{{$t('mobile.click-expansion-item')}}</p> -->
    <div v-if="birthdayInfo" class="row items-center q-gutter-sm">
      <div v-if="birthdayInfo.today.length">{{$t('common.birthday.today')}}</div>
      <div v-if="birthdayInfo.today.length">
        <img v-for="todayInfo in birthdayInfo.today" :key="todayInfo.chara.characterId" :src="`statics/chara_icon_${todayInfo.chara.characterId}.png`">
      </div>
      <div>{{$t('common.birthday.next')}} {{`${birthdayInfo.next[0].birthday.month}/${birthdayInfo.next[0].birthday.day}`}}</div>
      <div>
        <img v-for="nextInfo in birthdayInfo.next" :key="nextInfo.chara.characterId" :src="`statics/chara_icon_${nextInfo.chara.characterId}.png`">
      </div>
    </div>
    <q-expansion-item :label="$t('common.event')" v-model="isEventOpen">
      <div class="row col-12 q-col-gutter-sm q-mx-sm">
        <div v-for="server in servers" :key="server" class="col-xl-3 col-md-6 col-12">
          <event-card :server="server"></event-card>
        </div>
      </div>
    </q-expansion-item>
    <q-expansion-item :label="$t('common.gacha')" v-model="isGachaOpen">
      <q-expansion-item v-for="server in servers" :key="server" :label="$t(`common.${server}`)"
        v-model="isOpen[server]" class="q-mx-xs">
        <lazy-component @show="loadGachaData(server)">
          <div class="row col-12 q-col-gutter-sm q-mx-sm">
            <div v-if="isGcahaReady[server]" class="row col-12 q-col-gutter-sm">
              <gacha-card :server="server" class="col-xl-3 col-lg-4 col-md-6 col-12"
              v-for="gacha in currentGachaList[server]" :key="gacha.seq" :data="gacha"
              @open-modal="$refs.gachaModal.open(gacha, server)"></gacha-card>
            </div>
            <div v-if="!isGcahaReady[server]" class="col-12">
              <q-spinner color="pink" size="48px"></q-spinner>
            </div>
          </div>
        </lazy-component>
      </q-expansion-item>
    </q-expansion-item>
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
