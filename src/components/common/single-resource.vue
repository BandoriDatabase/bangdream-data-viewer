<template>
  <div
    class="text-center"
    v-if="isReady"
  >
    <my-q-img
      contain
      v-if="data[typeName] === 'practice_ticket' && data[idName] <=4"
      class="resource-img"
      :src="`/assets/jp/thumb/common_rip/practiceticket${data[idName]}.webp`"
    />
    <my-q-img
      contain
      v-else-if="data[typeName] === 'practice_ticket'"
      class="resource-img"
      :src="`/assets/jp/thumb/common_rip/skillticket_${data[idName]}.webp`"
    />
    <my-q-img
      contain
      v-else-if="data[typeName] === 'item'"
      class="resource-img"
      :src="`/assets/jp/thumb/material_rip/material${String(data[idName]).padStart(3, '0')}.webp`"
    />
    <my-q-img
      contain
      v-else-if="data[typeName] === 'stamp'"
      class="stamp-img"
      :src="`/assets/${server}/stamp/01_rip/${stampMap[server][data[idName]].imageName}.webp`"
    />
    <card-thumb
      v-else-if="data[typeName] === 'situation'"
      mini
      :situationId="Number(data[idName])"
      :server="server"
    ></card-thumb>
    <my-q-img
      contain
      v-else
      class="resource-img"
      :src="`/assets/jp/thumb/common_rip/${data[typeName]}.webp`"
    />
    <p class="text-subtitle2 q-mb-xs">x{{data[quantityName]}}</p>
  </div>
  <div
    v-else
    class="resource-img"
  >
    <q-spinner></q-spinner>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CardThumb from './card-thumb'

export default {
  name: 'singleResourceComponent',
  props: {
    server: String,
    data: Object,
    typeName: {
      type: String,
      default: 'resourceType'
    },
    idName: {
      type: String,
      default: 'resourceId'
    },
    quantityName: {
      type: String,
      default: 'quantity'
    }
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
    if (this.data[this.typeName] === 'stamp') {
      this.getStampById({
        server: this.server,
        id: this.data[this.idName]
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
.resource-img {
  width: 60px;
  height: 60px;
}

.stamp-img {
  width: 96px;
  height: 96px;
}
</style>
