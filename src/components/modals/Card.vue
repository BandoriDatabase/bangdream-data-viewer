<template>
  <q-modal ref="cardModal" :content-css="{maxWidth: '415px', padding: '5px'}">
    <div id="basic-info column gutter">
      <div>
        <h6 :class="`text-${getPalette(cardInfo.attr)}`">{{characterInfo.characterName}} - {{cardInfo.title}}</h6>
      </div>
      <div class="card-img-parent" @click="$router.push({ name: 'cardDetail', params: { cardId: cardInfo.cardId } })">
        <div class="card-img-main" v-lazy:background-image="`/assets/characters/resourceset/${cardInfo.cardRes}_card_normal.png`" />
        <div :class="`card-img-frame-${getCardFrame()}`" />
        <div :class="`card-img-attr-${cardInfo.attr}`" />
        <div v-for="i in Number(cardInfo.rarity)" :class="`card-img-rarity-normal-${i}`" :key="i" />
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
      <div class="skill" v-if="skillInfo">
        Skill (Level {{skillLv}})
        <p>{{skillInfo.skillName}}</p>
        <p>{{skillInfo.skillDetail[skillLv - 1].simpleDescription}}</p>
        <p>{{getSkillDesc(skillInfo.skillDetail[skillLv - 1].description, skillInfo.skillEffect, skillInfo.judgeEffect, skillLv)}}</p>
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
    skillInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    QModal,
    QBtn,
    QIcon
  },
  data () {
    return {
      skillLv: 1
    }
  },
  mounted () {
    this.skillLv = this.skillInfo.skillEffect.length || this.skillInfo.judgeEffect.length
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
          return 'rainbow'
        case '3':
          return 'gold'
        case '2':
          return 'silver'
        default:
          return `${this.cardInfo.attr}`
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
  width 402px
  height 280px
  position relative
  cursor pointer

.card-img-main
  position absolute
  width 390px
  height 268px
  background-size cover
  background-repeat no-repeat
  background-position center center
  left 6px
  top 6px

.card-img-attr-powerful
  position absolute
  top 1.7%
  right 1%
  width 45px
  height 45px
  background url('/statics/icon_powerful.png') no-repeat
  background-size 100% 100%

.card-img-attr-cool
  position absolute
  top 1.7%
  right 1%
  width 45px
  height 45px
  background url('/statics/icon_cool.png') no-repeat
  background-size 100% 100%

.card-img-attr-happy
  position absolute
  ttop 1.7%
  right 1%
  width 45px
  height 45px
  background url('/statics/icon_happy.png') no-repeat
  background-size 100% 100%

.card-img-attr-pure
  position absolute
  top 1.7%
  right 1%
  width 45px
  height 45px
  background url('/statics/icon_pure.png') no-repeat
  background-size 100% 100%

.card-img-rarity-normal-1
  position absolute
  top 86%
  left 1%
  width 35px
  height 35px
  background url('/statics/star_untrained.png') no-repeat
  background-size 100% 100%

.card-img-rarity-normal-2
  position absolute
  top 76%
  left 1%
  width 35px
  height 35px
  background url('/statics/star_untrained.png') no-repeat
  background-size 100% 100%

.card-img-rarity-normal-3
  position absolute
  top 66%
  left 1%
  width 35px
  height 35px
  background url('/statics/star_untrained.png') no-repeat
  background-size 100% 100%

.card-img-rarity-normal-4
  position absolute
  top 56%
  left 1%
  width 35px
  height 35px
  background url('/statics/star_untrained.png') no-repeat
  background-size 100% 100%

.card-img-rarity-trained-1
  position absolute
  top 86%
  left 1%
  width 35px
  height 35px
  background url('/statics/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-rarity-trained-2
  position absolute
  top 76%
  left 1%
  width 35px
  height 35px
  background url('/statics/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-rarity-trained-3
  position absolute
  top 66%
  left 1%
  width 35px
  height 35px
  background url('/statics/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-rarity-trained-4
  position absolute
  top 56%
  left 1%
  width 35px
  height 35px
  background url('/statics/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-frame-rainbow
  position: absolute
  width 402px
  height 280px
  background url('/statics/frame_ss_rainbow.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-gold
  position: absolute
  width 402px
  height 280px
  background url('/statics/frame_s_gold.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-silver
  position: absolute
  width 402px
  height 280px
  background url('/statics/frame_r_silver.png') no-repeat
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-pure
  position: absolute
  width 402px
  height 280px
  background url('/statics/frame_n_pure.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-powerful
  position: absolute
  width 402px
  height 280px
  background url('/statics/frame_n_powerful.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-happy
  position: absolute
  width 402px
  height 280px
  background url('/statics/frame_n_happy.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-cool
  position: absolute
  width 402px
  height 280px
  background url('/statics/frame_n_cool.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0
</style>
