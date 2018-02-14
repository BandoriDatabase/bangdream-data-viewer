<template>
  <div>
    <q-card v-if="cardInfo.cardRes">
      <q-card-title :class="`bg-${getPalette(cardInfo.attr)}`">
        <!-- <q-btn round small flat @click="$router.go(-1)" :class="getPalette(cardInfo.attr)">
          <q-icon name="reply"></q-icon>
        </q-btn> -->
        <img class="avatar" style="width: 48px" v-lazy="`/assets-${server}/thumb/chara/card${cardGroup}_${cardInfo.cardRes}_${cardResType}.png`" />
        <span class="text-white">[{{cardInfo.title}}] {{characterInfo.characterName}}</span>
      </q-card-title>
      <q-card-main class="card-content column gutter">
        <div class="row gutter">
          <div class="card-img-parent col-xl-6 col-lg-6 col-md-6 col-12" v-if="cardImgType === 'card'"
            @click="$preview.open(0, [{
              src: `/assets-${server}/characters/resourceset/${cardInfo.cardRes}_${cardImgType}_${cardResType}.png`,
              title: `[${cardInfo.title}] ${characterInfo.characterName}`,
              w: cardImgType === 'card' ? 1334 : 1120,
              h: cardImgType === 'card' ? 1002 : 1120
            }], {
              fullscreenEl: true,
              zoomEl: true,
              shareEl: true,
              history: false
            })">
            <div class="preview-img card-img-main" v-lazy:background-image="`/assets-${server}/characters/resourceset/${cardInfo.cardRes}_${cardImgType}_${cardResType}.png`" />
            <div :class="`card-img-frame-${getCardFrame()}`" />
            <div v-for="i in Number(cardInfo.rarity)" :class="`card-img-rarity-${cardResType}-${i}`" :key="i"></div>
            <div :class="`card-img-band-${characterInfo.bandId}`"></div>
            <div :class="`card-img-attr-${cardInfo.attr}`"></div>
          </div>
          <div v-else class="card-img-parent col-xl-6 col-lg-6 col-md-6 col-12"
            @click="$preview.open(0, [{
              src: `/assets-${server}/characters/resourceset/${cardInfo.cardRes}_${cardImgType}_${cardResType}.png`,
              title: `[${cardInfo.title}] ${characterInfo.characterName}`,
              w: cardImgType === 'card' ? 1334 : 1120,
              h: cardImgType === 'card' ? 1002 : 1120
            }], {
              fullscreenEl: true,
              zoomEl: true,
              shareEl: true,
              history: false
            })">
            <div class="preview-img card-img-main" v-lazy:background-image="`/assets-${server}/characters/resourceset/${cardInfo.cardRes}_${cardImgType}_${cardResType}.png`" />
          </div>
          <div class="col-xl-6 col-lg-6 col-md-6 col-12">
            <q-btn class="light" style="margin: 5px;" v-if="cardInfo.rarity >= 3 || cardInfo.title !== 'ガルパ杯'"
              @click="$router.push({ name: 'cardDetail', params: { cardId: cardInfo.cardId, isTrained: Number(!isTrained) } })">{{$t('un-trained')}}</q-btn>
            <q-btn class="light" style="margin: 5px;" @click="switchCardImgType()">{{$t('cut-in-normal')}}</q-btn>
            <q-btn class="light" style="margin: 5px;" @click="$preview.open(0, [{
                src: `/assets-${server}/characters/livesd/${cardInfo.live2dRes}_sdchara.png`,
                w: 507,
                h: 507
              }], {
                shareEl: true,
                history: false
              })">{{$t('live-chara')}}</q-btn>
            <div class="column" v-if="cardInfo.episodes">
              <label>
                <q-toggle
                  v-model="isSelfInfoReward"
                ></q-toggle>
                {{$t('self-intro-unlock-reward')}}
              </label>
              <label>
                <q-toggle
                  v-model="isMaxLvReward"
                ></q-toggle>
                {{$t('max-lv-unlock-reward')}}
              </label>
            </div>
          </div>
        </div>
        <div v-if="cardInfo.parameterMap">
          <div class="row">
            <div class="col-xl-3 col-6">
              <h5>Level</h5>
              <q-input
                style="display: inline-block"
                v-model="level"
                type="number"
                :min="1"
                :max="cardResType === 'normal' ? cardInfo.levelLimit : cardInfo.maxLv"
              ></q-input>
            </div>
            <!-- <div class="row col-xl-9 col-lg-9 col-md-6"> -->
              <div class="col-xl-2 col-6">
                Total
                <h5>
                  {{Number(cardInfo.parameterMap[level].performance) +
                  Number(cardInfo.parameterMap[level].technique) +
                  Number(cardInfo.parameterMap[level].visual) +
                  (cardResType === 'after_training' ? Number(cardInfo.training.trainingPerformance) +
                  Number(cardInfo.training.trainingTechnic) +
                  Number(cardInfo.training.trainingVisual) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendPerformance) +
                  Number(cardInfo.episodes.entries[0].appendTechnique) +
                  Number(cardInfo.episodes.entries[0].appendVisual) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendPerformance) +
                  Number(cardInfo.episodes.entries[1].appendTechnique) +
                  Number(cardInfo.episodes.entries[1].appendVisual) : 0)}}
                  <br><small>+{{(cardResType === 'after_training' ? Number(cardInfo.training.trainingPerformance) +
                  Number(cardInfo.training.trainingTechnic) +
                  Number(cardInfo.training.trainingVisual) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendPerformance) +
                  Number(cardInfo.episodes.entries[0].appendTechnique) +
                  Number(cardInfo.episodes.entries[0].appendVisual) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendPerformance) +
                  Number(cardInfo.episodes.entries[1].appendTechnique) +
                  Number(cardInfo.episodes.entries[1].appendVisual) : 0)}}</small>
                </h5>
              </div>
              <div class="col-xl-2 col-lg-3 col-md-3 col-4 text-pink-6">
                Perform
                <h5>
                  {{Number(cardInfo.parameterMap[level].performance) +
                  (cardResType === 'after_training' ? Number(cardInfo.training.trainingPerformance) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendPerformance) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendPerformance) : 0)}}
                  <br><small>+{{(cardResType === 'after_training' ? Number(cardInfo.training.trainingPerformance) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendPerformance) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendPerformance) : 0)}}</small>
                </h5>
              </div>
              <div class="col-xl-2 col-lg-3 col-md-3 col-4 text-indigo-6">
                Technique 
                <h5>
                  {{Number(cardInfo.parameterMap[level].technique) +
                  (cardResType === 'after_training' ? Number(cardInfo.training.trainingTechnic) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendTechnique) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendTechnique) : 0)}}
                  <br><small>+{{(cardResType === 'after_training' ? Number(cardInfo.training.trainingTechnic) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendTechnique) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendTechnique) : 0)}}</small>
                </h5>
              </div>
              <div class="col-xl-2 col-lg-3 col-md-3 col-4 text-orange-8">
                Visual
                <h5>
                  {{Number(cardInfo.parameterMap[level].visual) +
                  (cardResType === 'after_training' ? Number(cardInfo.training.trainingVisual) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendVisual) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendVisual) : 0)}}
                  <br><small>+{{(cardResType === 'after_training' ? Number(cardInfo.training.trainingVisual) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendVisual) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendVisual) : 0)}}</small>
                </h5>
              </div>
            <!-- </div> -->
          </div>

          <q-collapsible icon="trending up" :label="$t('skill.title')">
            <div>
              {{$t('skill.level')}}
              <q-input
                style="display: inline-block"
                v-model="skillLv"
                type="number"
                :min="1"
                :max="skillInfo.skillDetail.length || skillInfo.activateEffect.length || skillInfo.onceEffect.length"
              ></q-input>
              <p>{{skillInfo.skillName}}</p>
              <p>{{skillInfo.skillDetail.find(sd => sd.skillLevel === skillLv).simpleDescription}}</p>
              <p>{{getSkillDesc((skillInfo.skillDetail[skillLv] || skillInfo.skillDetail[Math.floor((skillLv - 1)/2)]).description, skillInfo.activateEffect, skillInfo.onceEffect, skillLv)}}</p>
            </div>
          </q-collapsible>
          <q-collapsible icon="highlight" :label="$t('training.title')">
            <div>
              <div class="row" v-if="cardInfo.rarity >= 3">
                <div v-for="entry in cardInfo.training.costs.entries" class="column col-4 items-center" :key="entry.resourceId">
                  <img class="thumb-training" v-lazy="`/assets/thumb/material_material0${String(entry.resourceId).length === 1 ? `0${entry.resourceId}` : entry.resourceId}.png`">
                  <span>{{entry.quantity}}</span>
                </div>
              </div>
              <div v-else>{{$t('no-train-ava')}}</div>
            </div>
          </q-collapsible>
          <q-collapsible icon="insert comment" :label="$t('story')" v-if="cardInfo.episodes">
            <div v-for="(episode, idx) in cardInfo.episodes.entries" :key="episode.episodeId">
              <p><span v-if="idx">{{$t('story-max-level')}}</span><span v-else>{{$t('story-self-intro')}}</span>{{episode.title}}
                <q-btn small color="pink" round flat
                  @click="$router.push({name: 'scenario', params: {server: server, scenarioType: 'chara', scenarioName: episode.scenarioId}}), $ga.event('card-detail', 'jump', `scenario`)">
                  <q-icon name="launch"></q-icon>
                </q-btn>
              </p>
              <p>{{$t('story-to-unlock')}}</p>
              <div class="row">
                <div v-for="entry in episode.costs.entries" class="column col-4 items-center" :key="entry.resourceId">
                  <img class="thumb-training" v-lazy="`/assets/thumb/material_material0${String(entry.resourceId).length === 1 ? `0${entry.resourceId}` : entry.resourceId}.png`">
                  <span>{{entry.quantity}}</span>
                </div>
              </div>
              <p>{{$t('story-reward')}}</p>
              <div class="row">
                <div v-for="entry in episode.rewards.entries" class="column col-4 items-center" :key="entry.resourceId">
                  <img class="thumb-training" v-lazy="`/assets/thumb/common_${entry.resourceType}.png`">
                  <span>{{entry.quantity}}</span>
                </div>
              </div>
            </div>
          </q-collapsible>
        </div>
      </q-card-main>
    </q-card>
  </div>
</template>

<i18n>
{
  "en": {
    "un-trained": "(un)trained",
    "cut-in-normal": "Transparent / Normal",
    "live-chara": "Live Character",
    "self-intro-unlock-reward": "Self intro unlock reward",
    "max-lv-unlock-reward": "Max Lv story unlock reward",
    "skill": {
      "title": "Skill Info",
      "level": "Skill Level"
    },
    "training": {
      "title": "Training items"
    },
    "no-train-ava": "No training avaliable",
    "story": "Story episodes",
    "story-self-intro": "Self intro: ",
    "story-to-unlock": "To unlock:",
    "story-max-level": "Max Level Story: ",
    "story-none": "No story avaliable",
    "story-reward": "Story read reward"
  },
  "zh-cn": {
    "un-trained": "切换觉醒",
    "cut-in-normal": "切换有/无背景",
    "live-chara": "Live角色图",
    "self-intro-unlock-reward": "自我介绍解锁奖励属性",
    "max-lv-unlock-reward": "满级剧情解锁奖励属性",
    "skill": {
      "title": "技能信息",
      "level": "技能等级"
    },
    "training": {
      "title": "觉醒材料"
    },
    "no-train-ava": "无法觉醒",
    "story": "卡牌剧情",
    "story-self-intro": "自我介绍：",
    "story-to-unlock": "解锁材料",
    "story-max-level": "满级剧情：",
    "story-none": "该卡牌没有剧情",
    "story-reward": "剧情阅读奖励"
  },
  "zh-tw": {
    "un-trained": "切換覺醒",
    "cut-in-normal": "切換有/無背景",
    "live-chara": "Live角色圖",
    "self-intro-unlock-reward": "自我介紹解鎖獎勵屬性",
    "max-lv-unlock-reward": "滿級劇情解鎖獎勵屬性",
    "skill": {
      "title": "技能信息",
      "level": "技能等级"
    },
    "training": {
      "title": "覺醒材料"
    },
    "no-train-ava": "無法覺醒",
    "story": "卡牌劇情",
    "story-self-intro": "自我介紹：",
    "story-to-unlock": "解鎖材料",
    "story-max-level": "滿級劇情：",
    "story-none": "該卡牌沒有劇情",
    "story-reward": "劇情閱讀獎勵"
  },
  "ja": {
    "un-trained": "特訓前後切替",
    "cut-in-normal": "背景有無切替",
    "live-chara": "SDキャラクター",
    "self-intro-unlock-reward": "エピソード達成ボーナス",
    "max-lv-unlock-reward": "メモリアルエピソード達成ボーナス",
    "skill": {
      "title": "スキル情報",
      "level": "スキルレベル"
    },
    "training": {
      "title": "特訓素材"
    },
    "no-train-ava": "このカードは特訓できません",
    "story": "カードエピソード",
    "story-self-intro": "エピソード：",
    "story-to-unlock": "解放に必要なアイテム",
    "story-max-level": "メモリアルエピソード：",
    "story-none": "このカードにエピソードはありません"
  }
}
</i18n>

<script>
import {
  QCard,
  QBtn,
  QIcon,
  QCardTitle,
  QCardMain,
  QInput,
  QToggle,
  QCollapsible
} from 'quasar'

export default {
  name: 'cardComponent',
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
    },
    isTrained: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      cardResType: 'normal',
      cardImgType: 'card',
      level: 1,
      isSelfInfoReward: true,
      isMaxLvReward: true,
      skillLv: 1
    }
  },
  components: {
    QCard,
    QBtn,
    QIcon,
    QCardTitle,
    QCardMain,
    QInput,
    QToggle,
    QCollapsible
  },
  created () {
    if (this.isTrained) {
      this.switchCardResType()
    }
  },
  mounted () {
    this.level = Number(this.cardInfo.maxLevel) - 10
    this.skillLv = this.skillInfo.skillDetail.length || this.skillInfo.activateEffect.length || this.skillInfo.onceEffect.length
  },
  computed: {
    cardGroup () {
      const groupId = Math.trunc(this.cardInfo.cardId / 50).toString()
      return `${'0'.repeat(5 - groupId.length)}${groupId}`
    },
    server () {
      return this.$route.params.server
    }
  },
  watch: {
    isTrained (newVal) {
      console.log(newVal)
      this.switchCardResType()
    }
  },
  methods: {
    switchCardResType () {
      if (this.cardResType === 'normal') {
        this.cardResType = 'after_training'
        this.level = Number(this.cardInfo.maxLevel)
      }
      else if (this.cardResType === 'after_training') {
        this.cardResType = 'normal'
        this.level = Number(this.cardInfo.maxLevel) - 10
      }
    },
    switchCardImgType () {
      if (this.cardImgType === 'card') {
        this.cardImgType = 'trim'
      }
      else if (this.cardImgType === 'trim') {
        this.cardImgType = 'card'
      }
    },
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
        case 4:
          return 'rainbow'
        case 3:
          return 'gold'
        case 2:
          return 'silver'
        default:
          return this.cardInfo.attr
      }
    },
    getSkillDesc (skillDesc, activateEffects, onceEffectList, skillLv) {
      const activateEffect = activateEffects ? activateEffects.find(af => af.skillLevel === skillLv) : this.skillInfo.skillDetail.find(sd => sd.skillLevel === skillLv)
      if (onceEffectList && onceEffectList.length && activateEffect) {
        const onceEffect = onceEffectList.find(oe => oe.skillLv === skillLv)
        return skillDesc.replace(/\{0\}/, onceEffect.onceEffectValue).replace(/\{1\}/, activateEffect.valueDescription)
      }
      else if (activateEffect) {
        return skillDesc.replace(/\{0\}/, activateEffect.valueDescription || activateEffect.duration)
      }
      else if (onceEffectList && onceEffectList.length) {
        const onceEffect = onceEffectList.find(oe => oe.skillLv === skillLv)
        return skillDesc.replace(/\{0\}/, `${onceEffect.onceEffectValue}`)
      }
      return ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.thumb
  width 60px
  height 60px

img
  width 100%

.thumb-training
  width 72px
  height 72px

.card-img-parent
  width 100%
  height 280px
  max-width 420px
  position relative
  cursor pointer

.card-img-main
  position absolute
  width 97.5%
  height 268px
  max-width 408px
  background-size cover
  background-repeat no-repeat
  background-position center center
  left 6px
  top 6px

.card-img-attr-powerful
  position absolute
  top 1.7%
  right 1.5%
  width 45px
  height 45px
  background url('/statics/icon_powerful.png') no-repeat
  background-size 100% 100%

.card-img-attr-cool
  position absolute
  top 1.7%
  right 1.5%
  width 45px
  height 45px
  background url('/statics/icon_cool.png') no-repeat
  background-size 100% 100%

.card-img-attr-happy
  position absolute
  top 1.7%
  right 1.5%
  width 45px
  height 45px
  background url('/statics/icon_happy.png') no-repeat
  background-size 100% 100%

.card-img-attr-pure
  position absolute
  top 1.7%
  right 1.5%
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

.card-img-rarity-after_training-1
  position absolute
  top 86%
  left 1%
  width 35px
  height 35px
  background url('/statics/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-rarity-after_training-2
  position absolute
  top 76%
  left 1%
  width 35px
  height 35px
  background url('/statics/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-rarity-after_training-3
  position absolute
  top 66%
  left 1%
  width 35px
  height 35px
  background url('/statics/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-rarity-after_training-4
  position absolute
  top 56%
  left 1%
  width 35px
  height 35px
  background url('/statics/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-frame-rainbow
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('/statics/frame_ss_rainbow.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-gold
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('/statics/frame_s_gold.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-silver
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('/statics/frame_r_silver.png') no-repeat
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-pure
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('/statics/frame_n_pure.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-powerful
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('/statics/frame_n_powerful.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-happy
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('/statics/frame_n_happy.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-cool
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('/statics/frame_n_cool.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

div.row
  padding 5px

.card-img-band-1
  position absolute
  top 2%
  left 1%
  width 50px
  height 50px
  background url('/statics/band_icon_1.png') no-repeat

.card-img-band-2
  position absolute
  top 2%
  left 1%
  width 50px
  height 50px
  background url('/statics/band_icon_2.png') no-repeat

.card-img-band-3
  position absolute
  top 2%
  left 1%
  width 50px
  height 50px
  background url('/statics/band_icon_3.png') no-repeat

.card-img-band-4
  position absolute
  top 2%
  left 1%
  width 50px
  height 50px
  background url('/statics/band_icon_4.png') no-repeat

.card-img-band-5
  position absolute
  top 2%
  left 1%
  width 50px
  height 50px
  background url('/statics/band_icon_5.png') no-repeat
</style>
