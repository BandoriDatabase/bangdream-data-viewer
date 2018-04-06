<template>
  <q-page padding class="column gutter-sm">
    <p style="text-align: center;" v-if="!$q.platform.is.desktop">{{$t('mobile.click-collapsible')}}</p>
    <div v-if="birthdayInfo" class="row items-center gutter-sm">
      <div v-if="birthdayInfo.today">{{$t('common.birthday.today')}}</div>
      <div v-if="birthdayInfo.today"><img :src="`statics/chara_icon_${birthdayInfo.today.chara.characterId}.png`"></div>
      <div>{{$t('common.birthday.next')}} {{`${birthdayInfo.next.birthday.month}/${birthdayInfo.next.birthday.day}`}}</div>
      <div><img :src="`statics/chara_icon_${birthdayInfo.next.chara.characterId}.png`"></div>
    </div>
    <q-collapsible :label="$t('common.jp')" v-model="isOpen.jp">
      <div class="row col-12 gutter-sm">
        <event-card class="col-lg-4 col-12" server="jp"></event-card>
        <gacha-card server="jp" class="col-lg-8 col-12" @open-modal="evt => $refs.gachaModal.open(evt, 'jp')"></gacha-card>
      </div>
    </q-collapsible>
    <q-collapsible :label="$t('common.tw')" v-model="isOpen.tw">
      <div class="row col-12 gutter-sm">
        <event-card class="col-lg-4 col-12" server="tw"></event-card>
        <gacha-card server="tw" class="col-lg-8 col-12" @open-modal="evt => $refs.gachaModal.open(evt, 'tw')"></gacha-card>
      </div>
    </q-collapsible>
    <q-collapsible :label="$t('common.kr')" v-model="isOpen.kr">
      <div class="row col-12 gutter-sm">
        <event-card class="col-lg-4 col-12" server="kr"></event-card>
        <gacha-card server="kr" class="col-lg-8 col-12" @open-modal="evt => $refs.gachaModal.open(evt, 'kr')"></gacha-card>
      </div>
    </q-collapsible>
    <q-collapsible :label="$t('common.en')" v-model="isOpen.en">
      <div class="row col-12 gutter-sm">
        <event-card class="col-lg-4 col-12" server="en"></event-card>
        <gacha-card server="en" class="col-lg-8 col-12" @open-modal="evt => $refs.gachaModal.open(evt, 'en')"></gacha-card>
      </div>
    </q-collapsible>
    <gacha-modal ref="gachaModal"></gacha-modal>
  </q-page>
</template>

<style>
</style>

<script>
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
      isOpen: {
        jp: this.$q.platform.is.desktop,
        tw: this.$q.platform.is.desktop,
        kr: this.$q.platform.is.desktop,
        en: this.$q.platform.is.desktop
      },
      birthdayInfo: null
    }
  }
}
</script>
