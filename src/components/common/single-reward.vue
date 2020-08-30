<template>
  <div class="text-center" v-if="isReady">
    <q-img contain v-if="data.rewardType === 'practice_ticket' && data.rewardId <=4" class="reward-img"
    :src="`/assets/thumb/common_rip/practiceTicket${data.rewardId}.webp`"></q-img>
    <q-img contain v-else-if="data.rewardType === 'practice_ticket'" class="reward-img"
    :src="`/assets/thumb/common_rip/skillticket_${data.rewardId}.webp`"></q-img>
    <q-img contain v-else-if="data.rewardType === 'item'" class="reward-img"
    :src="`/assets/thumb/material_rip/material${String(data.rewardId).padStart(3, '0')}.webp`"></q-img>
    <q-img contain v-else-if="data.rewardType === 'stamp'" class="reward-img"
    :src="`/assets/${server}/stamp/01_rip/${stampMap[server][data.rewardId].imageName}.webp`"></q-img>
    <card-thumb v-else-if="data.rewardType === 'situation'" mini
    :situationId="Number(data.rewardId)" :server="server"></card-thumb>
    <q-img contain v-else class="reward-img"
    :src="`/assets/thumb/common_rip/${data.rewardType}.webp`"></q-img>
    <p class="text-subtitle2 q-mb-xs">x{{data.rewardQuantity}}</p>
  </div>
  <div v-else class="reward-img">
    <q-spinner></q-spinner>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CardThumb from './card-thumb'

export default {
  name: 'singleRewardComponent',
  props: {
    server: String,
    data: Object
  },
  components: {
    CardThumb
  },
  data () {
    return {
      isReady: false
    }
  },
  mounted () {
    if (this.data.rewardType === 'stamp') {
      this.getStampById({
        server: this.server,
        id: this.data.rewardId
      }).then(() => {
        this.isReady = true
      })
    } else {
      this.isReady = true
    }
  },
  methods: {
    ...mapActions('stamp', [
      'getStampById'
    ])
  },
  computed: {
    ...mapState('stamp', [
      'stampMap'
    ])
  }
}
</script>

<style lang="stylus" scoped>
.reward-img
  width 60px
  height 60px
</style>
