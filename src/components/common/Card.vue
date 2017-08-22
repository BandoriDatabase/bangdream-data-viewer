<template>
  <q-card v-if="cardInfo.cardRes">
    <q-card-title :class="`bg-${getPalette(cardInfo.attr)}`">
      <!-- <q-btn round small flat @click="$router.go(-1)" :class="getPalette(cardInfo.attr)">
        <q-icon name="reply"></q-icon>
      </q-btn> -->
      <img class="avatar" style="width: 48px" v-lazy="`https://bangdream.ga/assets/thumb/chara/card0000${cardGroup}_${cardInfo.cardRes}_${cardResType}.png`" />
      {{characterInfo.characterName}}
      <span class="text-white">{{cardInfo.title}}</span>
    </q-card-title>
    <q-card-main class="card-content column gutter">
      <div>
        <div class="card-img-parent">
          <img class="preview-img card-img-main" v-lazy="`https://bangdream.ga/assets/characters/resourceset/${cardInfo.cardRes}_${cardImgType}_${cardResType}.png`"
            @click="$preview.open(0, [{
              src: `https://bangdream.ga/assets/characters/resourceset/${cardInfo.cardRes}_${cardImgType}_${cardResType}.png`,
              w: cardImgType === 'card' ? 1334 : 1120,
              h: cardImgType === 'card' ? 1002 : 1120
            }], {
              fullscreenEl: true,
              zoomEl: true,
              shareEl: true
            })">
          <img class="card-img-frame" :src="`statics/frame_${getCardFrame()}.png`" v-if="cardImgType === 'card'"
            @click="$preview.open(0, [{
              src: `https://bangdream.ga/assets/characters/resourceset/${cardInfo.cardRes}_${cardImgType}_${cardResType}.png`,
              w: cardImgType === 'card' ? 1334 : 1120,
              h: cardImgType === 'card' ? 1002 : 1120
            }], {
              fullscreenEl: true,
              zoomEl: true,
              shareEl: true
            })">
          <div :class="`card-img-attr-${cardInfo.attr}`" v-if="cardImgType === 'card'"></div>
          <div v-for="i in Number(cardInfo.rarity)" :class="`card-img-rarity-${cardResType}-${i}`" v-if="cardImgType === 'card'" :key="i"></div>
        </div>
        <div style="float: left">
          <q-btn class="light" style="margin: 5px;" v-if="cardInfo.rarity >= 3" @click="switchCardResType()">{{$t('un-trained')}}</q-btn>
          <q-btn class="light" style="margin: 5px;" @click="switchCardImgType()">{{$t('cut-in-normal')}}</q-btn>
          <q-btn class="light" style="margin: 5px;" @click="$preview.open(0, [{
              src: `https://bangdream.ga/assets/characters/livesd/${cardInfo.live2dRes}_sdchara.png`,
              w: 507,
              h: 507
            }], {
              shareEl: true
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
          <div class="col-md-6 col-xl-3 col-lg-3">
            <h5>Level</h5>
            <q-input
              style="display: inline-block"
              v-model="level"
              type="number"
              :min="1"
              :max="Number(cardInfo.parameterMap[cardInfo.maxLevel].level)"
            ></q-input>
          </div>
          <div class="row col-xl-9 col-lg-9 col-md-6">
            <div class="col-xl-3 col-lg-3 col-md-6 col-12">
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
            <div class="col-xl-3 col-lg-3 col-md-6 col-4 text-pink-6">
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
            <div class="col-xl-3 col-lg-3 col-md-6 col-4 text-indigo-6">
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
            <div class="col-xl-3 col-lg-3 col-md-6 col-4 text-orange-8">
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
          </div>
        </div>
        <div class="row sm-column">
          <div class="col-6">
            {{$t('skill-level')}}
            <q-input
              style="display: inline-block"
              v-model="skillLv"
              type="number"
              :min="1"
              :max="skillEffect.length"
            ></q-input>
            <p>{{skillName}}</p>
            <p>{{skillInfo.simpleDescription}}</p>
            <p>{{getSkillDesc(skillInfo.description, skillEffect, judgeList, skillLv)}}</p>
          </div>
          <div class="col-6">
            {{$t('train-item')}}
            <div class="row" v-if="cardInfo.rarity >= 3">
              <div v-for="entry in cardInfo.training.costs.entries" class="column col-md-4 col-xs-12 items-center" :key="entry.resourceID">
                <img class="thumb-training" v-lazy="`https://bangdream.ga/assets/thumb/material_material0${entry.resourceID.length === 1 ? `0${entry.resourceID}` : entry.resourceID}.png`">
                <span>{{entry.quantity}}</span>
              </div>
            </div>
            <div v-else>{{$t('no-train-ava')}}</div>
          </div>
        </div>
        <p>{{$t('story')}}</p>
        <div class="row sm-column md-column" v-if="cardInfo.episodes">
          <div class="col-6">
            <p>{{$t('story-self-intro')}}{{cardInfo.episodes.entries[0].title}} <q-btn small color="pink" round flat><q-icon name="launch"></q-icon></q-btn>
              <p>{{$t('story-to-unlock')}}</p>
              <div class="row">
                <div v-for="entry in cardInfo.episodes.entries[0].costs.entries" class="column col-md-4 col-xs-12 items-center" :key="entry.resourceID">
                  <img class="thumb-training" v-lazy="`https://bangdream.ga/assets/thumb/material_material0${entry.resourceID.length === 1 ? `0${entry.resourceID}` : entry.resourceID}.png`">
                  <span>{{entry.quantity}}</span>
                </div>
              </div>
            </p>
          </div>
          <div class="col-6">
            <p>{{$t('story-max-level')}}{{cardInfo.episodes.entries[1].title}} <q-btn small color="pink" round flat><q-icon name="launch"></q-icon></q-btn>
              <p>{{$t('story-to-unlock')}}</p> 
              <div class="row">
                <div v-for="entry in cardInfo.episodes.entries[1].costs.entries" class="column col-md-4 col-xs-12 items-center" :key="entry.resourceID">
                  <img class="thumb-training" v-lazy="`https://bangdream.ga/assets/thumb/material_material0${entry.resourceID.length === 1 ? `0${entry.resourceID}` : entry.resourceID}.png`">
                  <span>{{entry.quantity}}</span>
                </div>
              </div>
            </p>
          </div>
        </div>
        <div class="row sm-column md-column" v-else>
          {{$t('story-none')}}
        </div>
      </div>
    </q-card-main>
  </q-card>
</template>

<i18n>
{
  "en": {
    "un-trained": "(un)trained",
    "cut-in-normal": "Cut In / Normal",
    "live-chara": "Live Character",
    "self-intro-unlock-reward": "Self intro unlock reward",
    "max-lv-unlock-reward": "Max Lv story unlock reward",
    "skill-level": "Skill Level",
    "train-item": "Training items",
    "no-train-ava": "No training avaliable",
    "story": "Story episodes",
    "story-self-intro": "Self intro: ",
    "story-to-unlock": "To unlock:",
    "story-max-level": "Max Level Story: ",
    "story-none": "No story avaliable"
  },
  "zh-CN": {
    "un-trained": "切换觉醒",
    "cut-in-normal": "切换卡面/立绘",
    "live-chara": "Live角色图",
    "self-intro-unlock-reward": "自我介绍解锁奖励属性",
    "max-lv-unlock-reward": "满级剧情解锁奖励属性",
    "skill-level": "技能等级",
    "train-item": "觉醒材料",
    "no-train-ava": "无法觉醒",
    "story": "卡牌剧情",
    "story-self-intro": "自我介绍：",
    "story-to-unlock": "解锁材料",
    "story-max-level": "满级剧情：",
    "story-none": "该卡牌没有剧情"
  },
  "zh-TW": {
    "un-trained": "切換覺醒",
    "cut-in-normal": "切換卡面/立繪",
    "live-chara": "Live角色圖",
    "self-intro-unlock-reward": "自我介紹解鎖獎勵屬性",
    "max-lv-unlock-reward": "滿級劇情解鎖獎勵屬性",
    "skill-level": "技能等級",
    "train-item": "覺醒材料",
    "no-train-ava": "無法覺醒",
    "story": "卡牌劇情",
    "story-self-intro": "自我介紹：",
    "story-to-unlock": "解鎖材料",
    "story-max-level": "滿級劇情：",
    "story-none": "該卡牌沒有劇情"
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
  QToggle
} from 'quasar'
import { mapGetters } from 'vuex'

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
    skillId: {
      type: Number,
      required: true
    },
    skillName: {
      type: String,
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
    QToggle
  },
  computed: {
    ...mapGetters('DB', [
      'skillInfos',
      'skillMap',
      'skillEffects',
      'judgeLists'
    ]),
    cardGroup () {
      return Math.trunc(this.cardInfo.cardID / 50)
    },
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
  mounted () {
    this.level = Number(this.cardInfo.parameterMap[this.cardInfo.maxLevel].level)
    this.skillLv = this.skillEffect.length
  },
  methods: {
    switchCardResType () {
      if (this.cardResType === 'normal') {
        this.cardResType = 'after_training'
      }
      else if (this.cardResType === 'after_training') {
        this.cardResType = 'normal'
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
      console.log(judgeLists, this.skillId)
      if (judgeLists.length && skillEffect) {
        const judgeEffect = judgeLists[skillLv - 1]
        return skillDesc.replace(/\{0\}/, judgeEffect.judgeName).replace(/\{1\}/, skillEffect.valueDescription)
      }
      else if (skillEffect) {
        return skillDesc.replace(/\{0\}/, skillEffect.valueDescription)
      }
      else if (judgeLists.length) {
        const judgeEffect = judgeLists[skillLv - 1]
        return skillDesc.replace(/\{0\}/, judgeEffect.judgeName)
      }
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
  float left
  position relative

.card-img-main
  cursor: pointer
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

div.row
  padding: 5px
</style>
