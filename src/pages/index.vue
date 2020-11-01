<template>
  <q-page padding>
    <!-- <p style="text-align: center;" v-if="!$q.platform.is.desktop">{{$t('mobile.click-expansion-item')}}</p> -->
    <!-- {{supportWebp}} -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6">
        <q-card class="full-height">
          <q-card-section>{{$t('common.birthday.title')}}</q-card-section>
          <q-separator></q-separator>
          <q-card-section class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-badge>{{$t('common.birthday.today')}}</q-badge>
              <div
                class="row q-gutter-md"
                v-if="birthdayInfo"
              >
                <div
                  class="row items-center"
                  v-for="todayInfo in birthdayInfo.today"
                  :key="todayInfo.chara.characterId"
                >
                  <img
                    class="q-mr-md"
                    :src="`chara/chara_icon_${todayInfo.chara.characterId}.png`"
                    style="width: 48px; height: 48px"
                  >
                  <span>{{todayInfo.chara.characterName}}<br>{{todayInfo.birthday.month}}/{{todayInfo.birthday.day}}</span>
                </div>
                <p v-if="birthdayInfo.today.length === 0">{{$t('common.birthday.notoday')}}</p>
              </div>
              <div
                v-else
                class="row q-gutter-md"
              >
                <q-skeleton
                  type="circle"
                  size="48px"
                ></q-skeleton>
                <q-skeleton
                  type="text"
                  width="80px"
                ></q-skeleton>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <q-badge>{{$t('common.birthday.next')}}</q-badge>
              <div
                class="row q-gutter-md"
                v-if="birthdayInfo"
              >
                <div
                  class="row items-center"
                  v-for="nextInfo in birthdayInfo.next"
                  :key="nextInfo.chara.characterId"
                >
                  <img
                    class="q-mr-md"
                    :src="`chara/chara_icon_${nextInfo.chara.characterId}.png`"
                    style="width: 48px; height: 48px"
                  >
                  <span>{{nextInfo.chara.characterName}}<br>{{nextInfo.birthday.month}}/{{nextInfo.birthday.day}}</span>
                </div>
              </div>
              <div
                v-else
                class="row q-gutter-md"
              >
                <q-skeleton
                  type="circle"
                  size="48px"
                ></q-skeleton>
                <q-skeleton
                  type="text"
                  width="80px"
                ></q-skeleton>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!-- <div class="col-12 col-sm-4">
        <q-card class="full-height">
          <q-card-section>Version Info</q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <div v-for="(server, idx) in $servers" :key="`server-${idx}`" class="row q-my-sm justify-between">
              <span>
                {{$t(`common.${server}`)}}
              </span>
              <q-badge>
                {{resVer[server] || '0.0.0.0'}}
              </q-badge>
            </div>
          </q-card-section>
        </q-card>
      </div> -->
      <div class="col-12 col-sm-6">
        <q-card class="full-height">
          <q-card-section>Shortcuts</q-card-section>
          <q-separator></q-separator>
          <q-card-actions
            align="evenly"
            class="q-gutter-md"
          >
            <q-btn
              icon="picture_in_picture"
              @click="$router.push({ name: 'cardList', params: { server: $dataLang } })"
            >{{$t('left.card')}}</q-btn>
            <q-btn
              icon="account_box"
              @click="$router.push({ name: 'charaList', params: { server: $dataLang } })"
            >{{$t('left.chara')}}</q-btn>
            <q-btn
              icon="library_music"
              @click="$router.push({ name: 'musicList', params: { server: $dataLang } })"
            >{{$t('left.music')}}</q-btn>
            <q-btn
              icon="record_voice_over"
              @click="$router.push({ name: 'live2d', params: { server: $dataLang } })"
            >{{$t('left.Live2d')}}</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-xs">
      <div
        v-for="server in servers"
        :key="server"
        class="col-12"
      >
        <event-card :server="server"></event-card>
      </div>
    </div>
    <!-- <q-expansion-item :label="$t('common.gacha')" v-model="isGachaOpen">
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
    <gacha-modal ref="gachaModal"></gacha-modal> -->
  </q-page>
</template>

<style>
</style>

<script>
import { mapState, mapActions } from 'vuex'
import { detectWebpSupport } from 'webp-hero'

import EventCard from 'components/card/event'
// import GachaCard from 'components/card/gacha'
// import GachaModal from 'components/modals/gacha'

export default {
  name: 'PageIndex',
  components: {
    EventCard
    // GachaCard,
    // GachaModal
  },
  mounted () {
    this.$api.getBirthday(this.$q.localStorage.getItem('dataLang') || 'jp')
      .then(res => {
        this.birthdayInfo = res
      })
    // this.getResourceVersion()
    detectWebpSupport().then(state => {
      this.supportWebp = state
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
      }, {}),
      supportWebp: false
    }
  },
  computed: {
    ...mapState('gacha', [
      'currentGachaList'
    ]),
    ...mapState('version', [
      'resVer'
    ]),
    servers () {
      return this.$servers.filter(elem => elem !== 'kr')
    },
    birthdayTodayCharaName () {
      let names = this.birthdayInfo.today.map(elem => elem.chara.characterName)

      return names.join(' & ')
    },
    birthdayNextCharaName () {
      let names = this.birthdayInfo.next.map(elem => elem.chara.characterName)

      return names.join(' & ')
    }
  },
  methods: {
    ...mapActions('gacha', [
      'getGachaCurrent'
    ]),
    // ...mapActions('version', [
    //   'getResourceVersion'
    // ]),
    loadGachaData (server) {
      this.$nextTick(async () => {
        await this.getGachaCurrent(server)
        this.isGcahaReady[server] = true
      })
    }
  }
}
</script>
