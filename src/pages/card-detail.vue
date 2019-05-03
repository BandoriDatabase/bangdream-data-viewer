<template>
  <q-page padding>
    <div v-if="isReady">
      <div class="row gutter-sm">
        <div class="column col-xl-4 col-lg-6 col-md-6 col-12">
          <div class="row items-center card-title">
            <div class="col-8 text-white q-title" style="text-align: center;margin:0 auto;">
              <span style="font-size:15px;font-weight 800;">{{cardInfo.title}}</span><br>{{charaInfo.characterName}}
            </div>
            <div class="col-4 card-img-band" :class="`img-band-${charaInfo.bandId}`"></div>
          </div>
          <viewer @inited="handleInited" :options="{navbar: false, toolbar: false}">
            <div class="main-div" style="position:static;">
              <div class="img-div" v-if="cardImgType === 'card'">
                <img :src="getCardImage()" alt="" class="card-img">
                <div class="card-img-parent"  @click="$viewer.show()">
                  <div :class="`card-img-frame-${frameMap[cardInfo.rarity] || cardInfo.attr}`" />
                  <div v-for="i in Number(cardInfo.rarity)" :class="`card-img-rarity-${cardResType}-${i}`" :key="i"></div>
                  <!--<div :class="`card-img-band-${charaInfo.bandId}`"></div>-->
                  <div :class="`card-img-attr-${cardInfo.attr}`"></div>
                </div>
              </div>
              <div class="img-div" v-else style="padding-bottom:66%">
                <div class="card-img-parent" @click="$viewer.show()">
                  <img :src="getCardImage()" alt="" class="card-img" style="margin-top:-20%;">
                </div>
              </div>
            </div>
          </viewer>
          <div style="margin-top: 66.6%">
            <div v-if="cardInfo.costumeId" style="text-align:center">
              <q-btn class="light img-btn" v-if="cardInfo.title !== 'ガルパ杯'"
                @click="openURL(getCardLivesd())">{{$t('card.live-chara')}}</q-btn>
              <q-btn class="light img-btn" @click="$router.push({ name:'live2d', params: { server: $route.params.server, costumeId: cardInfo.costumeId }})">
                <q-icon name="person" />{{$t('live2d.costume')}}  -  {{costumeInfo.description}} & {{$t('card.jump-to-live2d-costume')}}</q-btn>
            </div>
          </div>
          <q-card style="margin-top: 5px;">
            <q-card-main>
              <p style="font-size: 16px;float:left;line-height:62px;margin:0;">
                <q-icon name="highlight" />
                {{$t('card.training-title')}}
              </p>
              <div class="row" v-if="cardInfo.rarity >= 3" style="padding-bottom:0">
                <div v-for="entry in cardInfo.training.costs.entries" class="column col-4 items-center" :key="entry.resourceId">
                  <img class="thumb-training" v-lazy="`/assets/thumb/material_rip/material0${String(entry.resourceId).length === 1 ? `0${entry.resourceId}` : entry.resourceId}.png`">
                  <span>{{entry.quantity}}</span>
                </div>
              </div>
              <div v-else>{{$t('card.no-train-ava')}}</div>
            </q-card-main>
          </q-card>
        </div>
        <div class="column col-xl-4 col-lg-6 col-md-6 col-12">
          <q-btn class="light" style="margin: 0 0 15px 0;height:40px" @click="$router.push({ name: 'cardList', params: { server } })">{{$t('common.back-to-list')}}</q-btn>
          <div v-if="cardInfo.episodes">
            <q-btn class="light switch-btn" v-if="cardResType === 'normal'" @click="$router.push(`/card/${server}/${cardId}/${Number(!isTrained)}`)"
              style="border:1px solid red;margin-right:2%;">
               {{$t('card.un-trained')}}</q-btn>
            <q-btn class="light switch-btn" v-if="cardResType === 'after_training'" @click="$router.push(`/card/${server}/${cardId}/${Number(!isTrained)}`)"
              style="border:1px solid green;margin-right:2%;">
               {{$t('card.un-trained')}}</q-btn>
            <q-btn class="light switch-btn" v-if="cardImgType === 'trim'" @click="switchCardImgType()"
               style="border:1px solid red;margin-left:2%;">
              {{$t('card.cut-in-normal')}}</q-btn>
            <q-btn class="light switch-btn" v-if="cardImgType === 'card'" @click="switchCardImgType()"
               style="border:1px solid green;margin-left:2%;">
              {{$t('card.cut-in-normal')}}</q-btn>
          </div>
          <div v-if="cardInfo.episodes">
            <q-btn class="light switch-btn" v-if="isSelfInfoReward===false" @click="setSelfInfoReward()"
              style="border:1px solid red;margin-right:2%;">
               {{$t('card.self-intro-unlock-reward')}}</q-btn>
            <q-btn class="light switch-btn" v-if="isSelfInfoReward===true" @click="setSelfInfoReward()"
              style="border:1px solid green;margin-right:2%;">
               {{$t('card.self-intro-unlock-reward')}}</q-btn>
            <q-btn class="light switch-btn" v-if="isMaxLvReward===false" @click="setMaxLvReward()"
               style="border:1px solid red;margin-left:2%;">
              {{$t('card.max-lv-unlock-reward')}}</q-btn>
            <q-btn class="light switch-btn" v-if="isMaxLvReward===true" @click="setMaxLvReward()"
               style="border:1px solid green;margin-left:2%;">
              {{$t('card.max-lv-unlock-reward')}}</q-btn>
          </div>
          <q-card>
            <q-card-main class="row">
              <p style="width:100%;font-size:18px;height:30px;float:left;line-height:30px;padding:0 10px;margin:10px auto;">
                {{$t('common.level')}} : {{level}}</p>
              <div style="float:left;width:100%;margin:0 10px">
                <input
                    class="lInput"
                    v-model="level"
                    type="range"
                    :min="1"
                    value="1"
                    step="1"
                    :max="cardResType === 'normal' ? cardInfo.levelLimit : cardInfo.simpleParams.max.level"
                >
                <div style="margin-top:35px;margin-right:10px;font-weight:600;">
                  <p style="margin-bottom:20px;"><span style="font-size:16px;margin-left:16px;color:rgb(254,60,115)">{{$t('common.total')}}</span>
                  <span style="font-size:18px;float:right;">
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
                  <!---->
                  ({{(cardResType === 'after_training' ? Number(cardInfo.training.trainingPerformance) +
                  Number(cardInfo.training.trainingTechnic) +
                  Number(cardInfo.training.trainingVisual) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendPerformance) +
                  Number(cardInfo.episodes.entries[0].appendTechnique) +
                  Number(cardInfo.episodes.entries[0].appendVisual) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendPerformance) +
                  Number(cardInfo.episodes.entries[1].appendTechnique) +
                  Number(cardInfo.episodes.entries[1].appendVisual) : 0)}})
                  </span>
                  </p>
                  <hr />
                  <p style="margin-top:20px;"><q-chip color="pink-2" style="font-size:14px;width:120px;text-align:center;">
                  <span style="color:#000;">{{$t('common.perform')}}</span></q-chip>
                  <span style="font-size:15px;float:right;margin-top:5px;">
                  {{Number(cardInfo.parameterMap[level].performance) +
                  (cardResType === 'after_training' ? Number(cardInfo.training.trainingPerformance) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendPerformance) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendPerformance) : 0)}}
                  ({{(cardResType === 'after_training' ? Number(cardInfo.training.trainingPerformance) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendPerformance) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendPerformance) : 0)}})
                  </span>
                  </p>
                  <p><q-chip color="blue-2" style="font-size:14px;width:120px;text-align:center;">
                  <span style="color:#000;">{{$t('common.technic')}}</span></q-chip>
                  <span style="font-size:15px;float:right;margin-top:5px;">
                  {{Number(cardInfo.parameterMap[level].technique) +
                  (cardResType === 'after_training' ? Number(cardInfo.training.trainingTechnic) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendTechnique) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendTechnique) : 0)}}
                  ({{(cardResType === 'after_training' ? Number(cardInfo.training.trainingTechnic) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendTechnique) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendTechnique) : 0)}})
                  </span>
                  </p>
                  <p><q-chip color="orange-2" style="font-size:14px;width:120px;text-align:center;">
                  <span style="color:#000;">{{$t('common.visual')}}</span></q-chip>
                  <span style="font-size:15px;float:right;margin-top:5px;">
                  {{Number(cardInfo.parameterMap[level].visual) +
                  (cardResType === 'after_training' ? Number(cardInfo.training.trainingVisual) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendVisual) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendVisual) : 0)}}
                  ({{(cardResType === 'after_training' ? Number(cardInfo.training.trainingVisual) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendVisual) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendVisual) : 0)}})
                  </span>
                  </p>
                </div>
              </div>
            </q-card-main>
          </q-card>
          <q-card style="margin-top: 15px;">
            <q-card-main>
              <p style="font-size: 18px;">
                <q-icon name="trending up" />
                {{skillInfo.skillName}}  {{$t('card.skill-level')}} : {{skillLv}}
              </p>
              <p>
              </p>
              <input
              class="lInput"
                v-model="skillLv"
                type="range"
                :min="1"
                step="1"
                :max="skillInfo.skillDetail.length || skillInfo.activateEffect.length || skillInfo.onceEffect.length"
              >
              <!--
              <p style="margin-top:30px;font-size:16px;">{{skillInfo.skillDetail[skillLv - 1].simpleDescription}}</p>-->
              <p style="margin-top:30px;font-size:16px;">{{getSkillDesc((skillInfo.skillDetail[skillLv - 1] ||
                skillInfo.skillDetail[skillLv - 1]).description,
                skillInfo.activateEffect, skillInfo.onceEffect, skillLv-1)}}</p>
              <!---->
            </q-card-main>
          </q-card>
        </div>
        <div class="column col-xl-4 col-12" v-if="cardInfo.episodes">
          <p style="font-size: 18px;">
            <q-icon name="insert comment" />
            {{$t('card.story')}}
          </p>
          <div class="row gutter-md">
            <div v-for="(episode, idx) in cardInfo.episodes.entries" :key="episode.episodeId"
              class="col-xl-12 col-md-6 col-12"
            >
              <q-card>
                <q-card-title>
                  {{episode.title}}
                  <q-btn small color="pink" round flat
                    @click="$router.push(`/scenario/${server}/${cardInfo.cardRes}/${episode.scenarioId}`), $ga.event('card-detail', 'jump', `scenario`)">
                    <q-icon name="launch"></q-icon>
                  </q-btn>
                  <span v-if="idx" slot="subtitle">{{$t('card.story-max-level')}}</span>
                  <span v-else slot="subtitle">{{$t('card.story-self-intro')}}</span>
                </q-card-title>
                <q-card-separator />
                <q-card-main>
                  <div class="row items-center">
                    <p class="col-3">{{$t('card.story-to-unlock')}}</p>
                    <div class="row col-9">
                      <div v-for="entry in episode.costs.entries" class="column col-4 items-center" :key="entry.resourceId">
                        <img class="thumb-training" v-lazy="`/assets/thumb/material_rip/material0${String(entry.resourceId).length === 1 ? `0${entry.resourceId}` : entry.resourceId}.png`">
                        <span>{{entry.quantity}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="row items-center">
                    <p class="col-3">{{$t('card.story-reward')}}</p>
                    <div class="row col-9">
                      <div v-for="entry in episode.rewards.entries" class="column col-4 items-center" :key="entry.resourceId">
                        <img class="thumb-training" v-lazy="`/assets/thumb/common_rip/${entry.resourceType}.png`">
                        <span>{{entry.quantity}}</span>
                      </div>
                    </div>
                  </div>
                </q-card-main>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="isError">
      {{$t('card.not-exist', { server: $t(`common.${server}`), cardId })}}
    </div>
    <div v-else>
      {{$t('card.fetch-card-data')}}
      <q-spinner color="pink-6" size="48px"></q-spinner>
    </div>
  </q-page>
</template>

<script>
import { openURL } from 'quasar'
import { mapState, mapActions } from 'vuex'

export default {
  // name: 'PageName',
  data () {
    return {
      isReady: false,
      isError: false,
      charaInfo: null,
      paletteMap: {
        happy: 'orange-8',
        cool: 'indigo-6',
        pure: 'green-8',
        powerful: 'pink-6'
      },
      frameMap: {
        4: 'rainbow',
        3: 'gold',
        2: 'silver'
      },
      cardResType: 'normal',
      cardImgType: 'card',
      level: 1,
      isSelfInfoReward: true,
      isMaxLvReward: true,
      skillLv: 1
    }
  },
  async mounted () {
    try {
      const card = await this.getCardById({ cardId: this.$route.params.cardId, server: this.$route.params.server })
      await this.getSkillById({ cardId: card.cardId, server: this.$route.params.server })
      this.charaInfo = await this.getCharaById({ charaId: card.characterId, server: this.$route.params.server })
      if (card.costumeId) this.costumeInfo = await this.$api.getCostumeById(this.$route.params.server, card.costumeId)
      this.isReady = true
      this.level = Number(this.cardInfo.levelLimit)
      this.skillLv = this.skillInfo.skillDetail.slice(-1)[0].skillLevel

      if (this.isTrained) this.switchCardResType()
    } catch (error) {
      this.isError = true
    }
  },
  computed: {
    ...mapState('card', [
      'cardMap',
      'skillMap'
    ]),
    ...mapState('chara', [
      'charaMap'
    ]),
    cardId () {
      return Number(this.$route.params.cardId)
    },
    cardInfo () {
      if (!this.isReady) return {}
      return this.cardMap[this.server][this.cardId]
    },
    skillInfo () {
      if (!this.isReady) return {}
      return this.skillMap[this.server][this.cardId]
    },
    isTrained () {
      return Boolean(Number(this.$route.params.isTrained))
    },
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
      this.switchCardResType()
    }
  },
  methods: {
    ...mapActions('card', [
      'getCardById',
      'getSkillById'
    ]),
    ...mapActions('chara', [
      'getCharaById'
    ]),
    openURL,
    getCardThumb () {
      // if (this.$specialCardList[this.server].indexOf(this.cardId) !== -1) {
      return `/assets-${this.server}/thumb/chara/card${this.cardGroup}_rip/${this.cardInfo.cardRes}_${this.cardResType}.png`
      // }
      // return `/assets/thumb/chara/card${this.cardGroup}_rip/${this.cardInfo.cardRes}_${this.cardResType}.png`
    },
    getCardImage () {
      // if (this.$specialCardList[this.server].indexOf(this.cardId) !== -1) {
      return `/assets-${this.server}/characters/resourceset/${this.cardInfo.cardRes}_rip/${this.cardImgType}_${this.cardResType}.png`
      // }
      // return `/assets/characters/resourceset/${this.cardInfo.cardRes}_rip/${this.cardImgType}_${this.cardResType}.png`
    },
    getCardLivesd () {
      // if (this.$specialCardList[this.server].indexOf(this.cardId) !== -1) {
      return `/assets-${this.server}/characters/livesd/${this.cardInfo.live2dRes}_rip/sdchara.png`
      // }
      // return `/assets-${this.server}/characters/livesd/${this.cardInfo.live2dRes}_rip/sdchara.png`
    },
    setSelfInfoReward () {
      if (this.isSelfInfoReward === true) {
        this.isSelfInfoReward = false
      } else if (this.isSelfInfoReward === false) {
        this.isSelfInfoReward = true
      }
    },
    setMaxLvReward () {
      if (this.isMaxLvReward === true) {
        this.isMaxLvReward = false
      } else if (this.isMaxLvReward === false) {
        this.isMaxLvReward = true
      }
    },
    switchCardResType () {
      if (this.cardResType === 'normal') {
        this.cardResType = 'after_training'
        this.level = Number(this.cardInfo.simpleParams.max.level)
      } else if (this.cardResType === 'after_training') {
        this.cardResType = 'normal'
        this.level = Number(this.cardInfo.simpleParams.max.level) - 10
      }
    },
    switchCardImgType () {
      if (this.cardImgType === 'card') {
        this.cardImgType = 'trim'
      } else if (this.cardImgType === 'trim') {
        this.cardImgType = 'card'
      }
    },
    getSkillDesc (skillStr, activateEffects, onceEffectList, skillLv) {
      const activateEffect = activateEffects ? activateEffects.find(af => af.skillLevel === skillLv + 1) : this.skillInfo.skillDetail.find(sd => sd.skillLevel === skillLv + 1)
      if (onceEffectList && onceEffectList.length && activateEffect) {
        const onceEffect = onceEffectList.find(oe => oe.skillLv === skillLv)
        return skillStr.replace(/\{0\}/, onceEffect.onceEffectValue).replace(/\{1\}/, activateEffect.valueDescription)
      } else if (activateEffect) {
        return skillStr.replace(/\{0\}/, activateEffect.valueDescription || activateEffect.duration)
      } else if (onceEffectList && onceEffectList.length) {
        const onceEffect = onceEffectList.find(oe => oe.skillLv === skillLv)
        return skillStr.replace(/\{0\}/, `${onceEffect.onceEffectValue}`)
      }
      return ''
    },
    handleInited (viewer) {
      this.$viewer = viewer
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.path.substr(6, 2) === from.path.substr(6, 2)) {
      next()
      return
    }
    this.isReady = false
    this.isError = false

    this.$nextTick(async () => {
      try {
        const card = await this.getCardById({ cardId: to.params.cardId, server: to.params.server })
        await this.getSkillById({ cardId: card.cardId, server: to.params.server })
        this.charaInfo = await this.getCharaById({ charaId: card.characterId, server: to.params.server })
        if (card.costumeId) this.costumeInfo = await this.$api.getCostumeById(to.params.server, card.costumeId)
        this.isReady = true
        this.level = Number(this.cardInfo.simpleParams.max.level)
        this.skillLv = this.skillInfo.skillDetail.slice(-1)[0].skillLevel
      } catch (error) {
        this.isError = true
      }
    })
    next()
  }
}
</script>

<style lang="stylus" scoped>
.img-btn
  width 100%
  padding-left 5px
  padding-right 5px
  margin-bottom 10px

.switch-btn
  width 48%
  float left
  padding-left 5px
  padding-right 5px

.card-title
  border-radius 8px
  margin-bottom 10px
  text-align center
  position relative
  background-color rgb(97,97,97)
  border solid 2px rgb(140,140,140)
  height 60px

.thumb
  width 60px
  height 60px

.card-img
  padding-left 1.2%
  width 99%
  position absolute
  left 0
  top -5.65%

.main-div
  width 100%
  height 0
  padding-bottom 100%
  overflow hidden

.img-div
  width 100%
  position relative
  overflow hidden

.card-img-div
  width 100%
  height 100vw

.thumb-training
  width 40px
  height 40px

.card-img-parent
  width 100%
  position relative
  cursor pointer

.card-img-attr-powerful
  background url('~assets/icon_powerful.png') no-repeat

.card-img-attr-cool
  background url('~assets/icon_cool.png') no-repeat

.card-img-attr-happy
  background url('~assets/icon_happy.png') no-repeat

.card-img-attr-pure
  background url('~assets/icon_pure.png') no-repeat

.card-img-attr-powerful,
.card-img-attr-cool,
.card-img-attr-happy,
.card-img-attr-pure
  position absolute
  top 2.0%
  right 1.68%
  width 10%
  height 15%
  background-size 100% 100%

.card-img-rarity-normal-1,
.card-img-rarity-normal-2,
.card-img-rarity-normal-3,
.card-img-rarity-normal-4
  position absolute
  left 1%
  width 8%
  height 12%
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

.card-img-rarity-after_training-1,
.card-img-rarity-after_training-2,
.card-img-rarity-after_training-3,
.card-img-rarity-after_training-4
  position absolute
  left 1%
  width 8%
  height 12%
  background url('~assets/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-rarity-normal-1,
.card-img-rarity-after_training-1
  top 86%

.card-img-rarity-normal-2,
.card-img-rarity-after_training-2
  top 76%

.card-img-rarity-normal-3,
.card-img-rarity-after_training-3
  top 66%

.card-img-rarity-normal-4,
.card-img-rarity-after_training-4
  top 56%

.card-img-frame-rainbow
  background url('~assets/frame_ss_rainbow.png') no-repeat

.card-img-frame-gold
  background url('~assets/frame_s_gold.png') no-repeat

.card-img-frame-silver
  background url('~assets/frame_r_silver.png') no-repeat

.card-img-frame-pure
  background url('~assets/frame_n_pure.png') no-repeat

.card-img-frame-powerful
  background url('~assets/frame_n_powerful.png') no-repeat

.card-img-frame-happy
  background url('~assets/frame_n_happy.png') no-repeat

.card-img-frame-cool
  background url('~assets/frame_n_cool.png') no-repeat

.card-img-frame-rainbow,
.card-img-frame-gold,
.card-img-frame-silver,
.card-img-frame-pure,
.card-img-frame-powerful,
.card-img-frame-happy,
.card-img-frame-cool,
  position absolute
  width 100%
  padding-bottom 66.666%
  margin-top -0.3%
  margin-bottom -0.6%
  background-size cover
  background-size 100% 100%
  left 0
  top 0

div.row
  padding 5px

.card-img-band-1
  background url('~assets/band_icon_1.png') no-repeat

.card-img-band-2
  background url('~assets/band_icon_2.png') no-repeat

.card-img-band-3
  background url('~assets/band_icon_3.png') no-repeat

.card-img-band-4
  background url('~assets/band_icon_4.png') no-repeat

.card-img-band-5
  background url('~assets/band_icon_5.png') no-repeat

.card-img-band-1,
.card-img-band-2,
.card-img-band-3,
.card-img-band-4,
.card-img-band-5
  position absolute
  top 2.0%
  left 1.6%
  width 10%
  height 15%
  background-size 90% 100%

.card-img-band
  position absolute
  width 26%
  padding-bottom 11%
  left 2%
  max-width 125px
  background-size contain
  background-position center
  background-repeat no-repeat

.sInput
  width 100%

input[type='range']
  outline none
  -webkit-appearance none
  width 100% !important
  background -webkit-linear-gradient(rgb(255, 255, 30), rgb(255, 255, 30)) no-repeat,#fff
  background-size 0 100%
  height 3px
  border solid 1px #ddd
  border-radius 2px

input[type='range']::-webkit-slider-thumb
  -webkit-appearance none
  height 26px
  width 26px
  background #fff
  border solid 2px rgb(254,60,115)
  border-radius 13px

</style>
