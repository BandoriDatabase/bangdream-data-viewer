<template>
  <div>
    <p>{{$t('hint[0]')}}<span class="desktop-only">{{$t('hint[1]')}}</span><span class="mobile-only">{{$t('hint[2]')}}</span> {{$t('hint[3]')}}</p>
    <card v-if="isReady" :cardInfo="cardMap[$route.params.server][$route.params.cardId]" :characterInfo="charaInfo"
      :skillInfo="skillMap[$route.params.server][$route.params.cardId]" :isTrained="Boolean(Number($route.params.isTrained))"></card>
    <q-card v-else>
      <q-card-title class="bg-grey text-white">
        {{$t('fetch-card-data')}}
        <!-- <span slot="subtitle" class="text-white">{{$t('fetch-card-data')}}</span> -->
      </q-card-title>
      <q-card-main>
        <q-spinner color="pink-6" size="48px"></q-spinner>
      </q-card-main>
    </q-card>
  </div>
</template>

<i18n>
{
  "en": {
    "hint": [
      "Hint: ",
      "Click",
      "Touch",
      "card image to show full screen image."
    ],
    "fetch-card-data": "Fetching Card Data..."
  },
  "zh-cn": {
    "hint": [
      "提示: ",
      "点击",
      "触摸",
      "卡牌图片可放大显示"
    ],
    "fetch-card-data": "获取卡牌数据中"
  },
  "zh-tw": {
    "hint": [
      "提示: ",
      "點擊",
      "觸摸",
      "卡牌圖片可放大顯示"
    ],
    "fetch-card-data": "獲取卡牌數據中"
  },
  "ja": {
    "hint": [
      "ヒント: ジャケット写真を",
      "クリックする",
      "タップする",
      "と全画面イメージが表示されます"
    ],
    "fetch-card-data": "カードデータを取得中..."
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
