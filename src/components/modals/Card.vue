<template>
  <q-modal ref="cardModal" :content-css="{maxWidth: '415px', padding: '5px'}">
    <div id="basic-info column gutter">
      <div>
        <h6 :class="`text-${getPalette(cardInfo.attr)}`">{{characterInfo.characterName}} - {{cardInfo.title}}</h6>
      </div>
      <div class="card-img-parent" @click="$router.push({ name: 'cardDetail', params: { cardId: cardInfo.cardId } })">
        <img class="preview-img card-img-main" v-lazy="`/assets/characters/resourceset/${cardInfo.cardRes}_card_normal.png`">
        <img class="card-img-frame" :src="`statics/frame_${getCardFrame()}.png`">
        <div :class="`card-img-attr-${cardInfo.attr}`"></div>
        <div v-for="i in Number(cardInfo.rarity)" :class="`card-img-rarity-normal-${i}`" :key="i"></div>
      </div>
      <div class="max-attr">
        <p>Max Attributes</p>
        <div class="row gutter">
          <div class="col-3">
            Total
            <h5>
              {{Number(cardInfo.parameterMap[cardInfo.maxLevel].performance) +
              Number(cardInfo.parameterMap[cardInfo.maxLevel].technique) +
              Number(cardInfo.parameterMap[cardInfo.maxLevel].visual) +
              (Number(cardInfo.rarity >= 3) ? Number(cardInfo.training.trainingPerformance) +
              Number(cardInfo.training.trainingTechnic) +
              Number(cardInfo.training.trainingVisual) : 0) +
              Number(cardInfo.episodes.entries[0].appendPerformance) +
              Number(cardInfo.episodes.entries[0].appendTechnique) +
              Number(cardInfo.episodes.entries[0].appendVisual) +
              Number(cardInfo.episodes.entries[1].appendPerformance) +
              Number(cardInfo.episodes.entries[1].appendTechnique) +
              Number(cardInfo.episodes.entries[1].appendVisual)}}
            </h5>
          </div>
          <div class="col-3 text-pink-6">
            Perform
            <h5>
              {{Number(cardInfo.parameterMap[cardInfo.maxLevel].performance) +
              (Number(cardInfo.rarity >= 3) ? Number(cardInfo.training.trainingPerformance) : 0) +
              Number(cardInfo.episodes.entries[0].appendPerformance) +
              Number(cardInfo.episodes.entries[1].appendPerformance)}}
            </h5>
          </div>
          <div class="col-3 text-indigo-6">
            Technique
            <h5>
              {{Number(cardInfo.parameterMap[cardInfo.maxLevel].technique) +
              (Number(cardInfo.rarity >= 3) ? Number(cardInfo.training.trainingTechnic) : 0) +
              Number(cardInfo.episodes.entries[0].appendTechnique) +
              Number(cardInfo.episodes.entries[1].appendTechnique)}}
            </h5>
          </div>
          <div class="col-3 text-orange-8">
            Visual
            <h5>
              {{Number(cardInfo.parameterMap[cardInfo.maxLevel].visual) +
              (Number(cardInfo.rarity >= 3) ? Number(cardInfo.training.trainingVisual) : 0) +
              Number(cardInfo.episodes.entries[0].appendVisual) +
              Number(cardInfo.episodes.entries[1].appendVisual)}}
            </h5>
          </div>
        </div>
      </div>
      <div class="skill">
        Skill (Level {{skillLv}})
        <p>{{skillName}}</p>
        <p>{{skillInfo.simpleDescription}}</p>
        <p>{{getSkillDesc(skillInfo.description, skillEffect, judgeList, skillLv)}}</p>
      </div>
    </div>
    <div class="action-buttons">
      <q-btn color="primary" @click="$router.push({ name: 'cardDetail', params: { cardId: cardInfo.cardId } })">Detail page</q-btn>
      <q-btn color="negative" @click="$refs.cardModal.close()">Close</q-btn>
    </div>
  </q-modal>
</template>

<script>
import {
  QModal,
  QBtn,
  QIcon
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'cardModal',
  props: {
    cardInfo: {
      type: Object,
      required: true
    },
    characterInfo: {
      type: Object,
      required: true
    },
    skillId: {
      type: Number,
      required: true
    },
    skillName: {
      type: String,
      required: true
    }
  },
  components: {
    QModal,
    QBtn,
    QIcon
  },
  computed: {
    ...mapGetters('DB', [
      'skillInfos',
      'skillMap',
      'skillEffects',
      'judgeLists'
    ]),
    skillInfo () {
      return this.skillInfos.find(elem => Number(elem.skillId) === this.skillId)
    },
    skillEffect () {
      return this.skillEffects.filter(elem => Number(elem.skillId) === this.skillId && elem.u3 === '1')
    },
    judgeList () {
      return this.judgeLists.filter(elem => Number(elem.skillId) === this.skillId)
    }
  },
  data () {
    return {
      skillLv: 1
    }
  },
  mounted () {
    this.skillLv = this.skillEffect.length || this.judgeList.length
  },
  methods: {
    getPalette (type) {
      switch (type) {
        case 'happy':
          return 'orange-8'
        case 'cool':
          return 'indigo-6'
        case 'pure':
          return 'green-8'
        case 'powerful':
          return 'pink-6'
        default:
          return 'primary'
      }
    },
    getCardFrame () {
      switch (this.cardInfo.rarity) {
        case '4':
          return 'ss_rainbow'
        case '3':
          return 's_gold'
        case '2':
          return 'r_silver'
        default:
          return `n_${this.cardInfo.attr}`
      }
    },
    getSkillDesc (skillDesc, skillEffects, judgeLists, skillLv) {
      const skillEffect = skillEffects[skillLv - 1]
      if (judgeLists.length && skillEffect) {
        const judgeEffect = judgeLists[skillLv - 1]
        return skillDesc.replace(/\{0\}/, judgeEffect.judgeName).replace(/\{1\}/, skillEffect.valueDescription)
      }
      else if (skillEffect) {
        return skillDesc.replace(/\{0\}/, skillEffect.valueDescription)
      }
      else if (judgeLists.length) {
        const judgeEffect = judgeLists[skillLv - 1]
        return skillDesc.replace(/\{0\}/, `${judgeEffect.judgeName}(${judgeEffect.judgeEffectValue})`)
      }
    },
    open () {
      this.$refs.cardModal.open()
    }
  }
}
</script>

<style lang="stylus" scoped>
.card-img-parent
  float left
  position relative

.card-img-main
  max-width: 402px

.card-img-frame
  width 100%
  height 100%
  position absolute
  cursor pointer
  left 0
  top 0

.card-img-attr-powerful
  position: absolute
  top: 2%
  left: 87%
  width: 50px
  height: 50px
  background: url('~assets/MenuAtlas.png') no-repeat -1448px -211px

.card-img-attr-cool
  position: absolute
  top: 2%
  left: 87%
  width: 50px
  height: 50px
  background: url('~assets/MenuAtlas.png') no-repeat -1448px -55px

.card-img-attr-happy
  position: absolute
  top: 2%
  left: 87%
  width: 50px
  height: 50px
  background: url('~assets/MenuAtlas.png') no-repeat -1448px -263px

.card-img-attr-pure
  position: absolute
  top: 2%
  left: 87%
  width: 50px
  height: 50px
  background: url('~assets/MenuAtlas.png') no-repeat -1448px -159px

.card-img-rarity-normal-1
  position: absolute
  top: 86%
  left: 1%
  width: 38px
  height: 38px
  background: url('~assets/MenuAtlas.png') no-repeat -1308px -3px

.card-img-rarity-normal-2
  position: absolute
  top: 75%
  left: 1%
  width: 38px
  height: 38px
  background: url('~assets/MenuAtlas.png') no-repeat -1308px -3px

.card-img-rarity-normal-3
  position: absolute
  top: 65%
  left: 1%
  width: 38px
  height: 38px
  background: url('~assets/MenuAtlas.png') no-repeat -1308px -3px

.card-img-rarity-normal-4
  position: absolute
  top: 54%
  left: 1%
  width: 38px
  height: 38px
  background: url('~assets/MenuAtlas.png') no-repeat -1308px -3px

.card-img-rarity-after_training-1
  position: absolute
  top: 86%
  left: 1%
  width: 38px
  height: 38px
  background: url('~assets/MenuAtlas.png') no-repeat -1906px -451px

.card-img-rarity-after_training-2
  position: absolute
  top: 75%
  left: 1%
  width: 38px
  height: 38px
  background: url('~assets/MenuAtlas.png') no-repeat -1906px -451px

.card-img-rarity-after_training-3
  position: absolute
  top: 65%
  left: 1%
  width: 38px
  height: 38px
  background: url('~assets/MenuAtlas.png') no-repeat -1906px -451px

.card-img-rarity-after_training-4
  position: absolute
  top: 54%
  left: 1%
  width: 38px
  height: 38px
  background: url('~assets/MenuAtlas.png') no-repeat -1906px -451px
</style>
