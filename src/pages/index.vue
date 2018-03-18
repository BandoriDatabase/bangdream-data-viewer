<template>
  <q-page padding class="column gutter-sm">
    <p style="text-align: center;" v-if="!$q.platform.is.desktop">{{$t('mobile.click-collapsible')}}</p>
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
  data () {
    return {
      isOpen: {
        jp: this.$q.platform.is.desktop,
        tw: this.$q.platform.is.desktop
      }
    }
  }
}
</script>
