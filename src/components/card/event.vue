<template>
  <div>
    <q-card v-if="isReady">
      <q-card-section class="bg-pink text-white">
        <div class="text-subtitle1">{{currentEvent[server].eventName}}</div>
        <div class="text-caption">
          {{$t('event-srv', { srv: $t(`common.${server}`) }) }} - {{currentEvent[server].eventType}}
        </div>
      </q-card-section>
      <q-img contain class="event-card-img" v-if="server === 'kr'"
            :src="`/assets-${server}/homebanner_rip/banner_event${padEventId(currentEvent[server].eventId)}.png`"></q-img>
      <q-img contain class="event-card-img" v-else-if="server !== 'en'"
            :src="`/assets-${server}/homebanner_rip/banner_event${padEventId(currentEvent[server].eventId)}${currentEvent[server].eventId >= 13 ? '' : '_open'}.png`"></q-img>
      <q-img contain class="event-card-img" v-else-if="server === 'en' && currentEvent[server].eventId >= 3"
            :src="`/assets-${server}/homebanner_rip/banner_event${padEventId(currentEvent[server].eventId)}${currentEvent[server].eventId >= 13 ? '' : '_open'}.png`"></q-img>
      <q-img contain class="event-card-img" v-else-if="server === 'en'"
            :src="`/assets-${server}/homebanner_rip/banner-0${14 + currentEvent[server].eventId * 2}.png`"></q-img>
      <q-card-section>
        <div class="row items-center justify-center">
          <div class="col-6"
               @click="$ga.event('event-card', 'jump', `normal-${server}`)">
            <card-thumb :cardId="Number(eventNormalCardId)"
                        :server="server" />
          </div>
          <div class="col-6"
               @click="$ga.event('event-card', 'jump', `sr-${server}`)">
            <card-thumb :cardId="Number(eventSpecialCardId)"
                        :server="server" />
          </div>
          <div class="col-12"
               v-if="Number(currentEvent[server].startAt) > Date.now()">
            <h5 class="q-my-xs">{{$t('not-started')}}<br>{{(new Date(Number(currentEvent[server].startAt))).toLocaleString()}}</h5>
          </div>
          <count-down class="col-12"
                      :target-time="Number(currentEvent[server].endAt)"
                      v-else-if="Number(currentEvent[server].endAt) > Date.now()"></count-down>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions vertical>
        <q-btn flat
               class="text-pink"
               @click="$router.push(`/currevent/${server}`), $ga.event('event-detail', 'jump', server)"
               icon="launch">{{$t('gacha.open-detail')}}</q-btn>
      </q-card-actions>
    </q-card>
    <q-card v-else>
      <q-card-section class="bg-pink text-white">
        <div class="text-subtitle1">{{$t('fetch-data', { type: $t('common.event') })}}</div>
        <div class="text-caption">
          {{$t('fetch-data', { type: $t('common.event') })}}
        </div>
      </q-card-section>
      <q-card-section>
        <q-spinner color="pink" size="48px"></q-spinner>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CountDown from 'components/common/countdown'
import CardThumb from 'components/common/card-thumb'

export default {
  // name: 'ComponentName',
  props: ['server'],
  data () {
    return {
      isReady: false,
      eventNormalCardId: null,
      eventSpecialCardId: null
    }
  },
  components: {
    CountDown,
    CardThumb
  },
  computed: {
    ...mapState('event', ['currentEvent'])
  },
  mounted () {
    this.loadData()
  },
  methods: {
    ...mapActions('event', ['getCurrentEvent']),
    padEventId (evtId) {
      return String(evtId).length === 1 ? `0${String(evtId)}` : String(evtId)
    },
    loadData () {
      this.$nextTick(async () => {
        await this.getCurrentEvent(this.server)
        const eventCards = this.currentEvent[this.server].pointRewards.filter(
          elem => elem.rewardType === 'situation'
        )
        this.eventNormalCardId = eventCards[0].rewardId
        this.eventSpecialCardId = eventCards[1].rewardId
        this.isReady = true
      })
    }
  }
}
</script>

<style scoped>
.event-card-img {
  max-height: 140px;
}
</style>
