<template>
  <div>
    <p>Hint: <span class="desktop-only">Click</span><span class="mobile-only">Touch</span> card image to show full screen image.</p>
    <card v-if="isReady" :cardInfo="cardMap[$route.params.server][$route.params.cardId]" :characterInfo="charaInfo"
      :skillInfo="skillMap[$route.params.server][$route.params.cardId]"></card>
    <q-card v-else>
      <q-card-title class="bg-pink text-white">
        {{$t('fetch-card-data')}}
        <!-- <span slot="subtitle" class="text-white">{{$t('fetch-card-data')}}</span> -->
      </q-card-title>
      <q-card-main>
        <q-spinner color="pink" size="48px"></q-spinner>
      </q-card-main>
    </q-card>
  </div>
</template>

<i18n>
{
  "en": {
    "fetch-card-data": "Fetching Card Data..."
  },
  "zh-CN": {
    "fetch-card-data": "获取卡牌数据中"
  },
  "zh-TW": {
    "fetch-card-data": "獲取卡牌數據中"
  }
}
</i18n>

<script>
import {
  QCard,
  QCardTitle,
  QCardMain,
  QSpinner
} from 'quasar'
import { mapState, mapActions } from 'vuex'
import Card from './common/Card'

export default {
  name: 'CardDetailComponent',
  components: {
    Card,
    QCard,
    QCardTitle,
    QCardMain,
    QSpinner
  },
  data () {
    return {
      isReady: false,
      charaInfo: null
    }
  },
  mounted () {
    this.$nextTick(async () => {
      const card = await this.getCardById({cardId: this.$route.params.cardId, server: this.$route.params.server})
      await this.getSkillById({cardId: card.cardId, server: this.$route.params.server})
      this.charaInfo = await this.getCharaById({charaId: card.characterId, server: this.$route.params.server})
      this.isReady = true
    })
  },
  computed: {
    ...mapState('card', [
      'cardMap',
      'skillMap'
    ]),
    ...mapState('chara', [
      'charaMap'
    ])
  },
  methods: {
    ...mapActions('card', [
      'getCardById',
      'getSkillById'
    ]),
    ...mapActions('chara', [
      'getCharaById'
    ])
  }
}
</script>

<style lang="stylus" scoped>

</style>
