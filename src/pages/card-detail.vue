<template>
  <q-page padding>
    <div v-if="isReady">
      <div class="row gutter-sm">
        <div class="column col-xl-4 col-lg-6 col-md-6 col-12">
          <div class="row items-center" :class="`bg-${paletteMap[cardInfo.attr]}`" style="border-radius: 15px; margin-bottom: 10px;">
            <div class="col-4 card-img-band" :class="`img-band-${charaInfo.bandId}`"></div>
            <div class="col-8 text-white q-title" style="text-align: center">
              {{cardInfo.title}}<br>{{charaInfo.characterName}}
            </div>
          </div>
          <viewer @inited="handleInited" :options="{navbar: false, toolbar: false}">
            <img :src="getCardImage()" alt="" style="display: none;">
            <div class="card-img-parent" v-if="cardImgType === 'card'" @click="$viewer.show()">
              <div v-lazy:background-image="getCardImage()" class="card-img-main" />
              <div :class="`card-img-frame-${frameMap[cardInfo.rarity] || cardInfo.attr}`" />
              <div v-for="i in Number(cardInfo.rarity)" :class="`card-img-rarity-${cardResType}-${i}`" :key="i"></div>
              <div :class="`card-img-band-${charaInfo.bandId}`"></div>
              <div :class="`card-img-attr-${cardInfo.attr}`"></div>
            </div>
            <div v-else class="card-img-parent"
              @click="$viewer.show()">
              <div v-lazy:background-image="getCardImage()" class="card-img-main" />
            </div>
          </viewer>
          <div>
            <q-btn class="light" style="margin: 5px;" v-if="cardInfo.rarity >= 3 && cardInfo.title !== 'ガルパ杯'"
              @click="$router.push(`/card/${server}/${cardId}/${Number(!isTrained)}`)">{{$t('card.un-trained')}}</q-btn>
            <q-btn class="light" style="margin: 5px;" @click="switchCardImgType()">{{$t('card.cut-in-normal')}}</q-btn>
            <q-btn class="light" style="margin: 5px;" v-if="cardInfo.title !== 'ガルパ杯'"
              @click="openURL(getCardLivesd())">{{$t('card.live-chara')}}</q-btn>
            <q-btn class="light" style="margin: 5px" @click="$router.push({ name: 'cardList', params: { server } })">{{$t('common.back-to-list')}}</q-btn>
            <div class="column" v-if="cardInfo.episodes">
              <label>
                <q-toggle
                  v-model="isSelfInfoReward"
                ></q-toggle>
                {{$t('card.self-intro-unlock-reward')}}
              </label>
              <label>
                <q-toggle
                  v-model="isMaxLvReward"
                ></q-toggle>
                {{$t('card.max-lv-unlock-reward')}}
              </label>
            </div>
          </div>
          <q-card v-if="cardInfo.costumeId">
            <q-card-main>
              <p style="font-size: 18px;">
                <q-icon name="person" />
                {{$t('live2d.costume')}}
              </p>
              {{costumeInfo.description}}
            </q-card-main>
            <q-card-actions>
              <q-btn flat :label="$t('card.jump-to-live2d-costume')"
                @click="$router.push({ name:'live2d', params: { server: $route.params.server, costumeId: cardInfo.costumeId }})"></q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <div class="column col-xl-4 col-lg-6 col-md-6 col-12">
          <q-card>
            <q-card-main class="row">
              <div class="col-12 col-sm-6">
                <div>
                  {{$t('common.level')}}
                  <q-input
                    style="display: inline-block"
                    v-model="level"
                    type="number"
                    :min="1"
                    :max="cardResType === 'normal' ? cardInfo.levelLimit : cardInfo.maxLv"
                  ></q-input>
                </div>
                <br>
                <div style="padding: 5px 0;">
                  {{$t('common.total')}}
                  <q-chip>{{Number(cardInfo.parameterMap[level].performance) +
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
                  Number(cardInfo.episodes.entries[1].appendVisual) : 0)}}</q-chip>
                  +{{(cardResType === 'after_training' ? Number(cardInfo.training.trainingPerformance) +
                  Number(cardInfo.training.trainingTechnic) +
                  Number(cardInfo.training.trainingVisual) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendPerformance) +
                  Number(cardInfo.episodes.entries[0].appendTechnique) +
                  Number(cardInfo.episodes.entries[0].appendVisual) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendPerformance) +
                  Number(cardInfo.episodes.entries[1].appendTechnique) +
                  Number(cardInfo.episodes.entries[1].appendVisual) : 0)}}
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-pink-6" style="padding: 5px 0;">
                  {{$t('common.perform')}}
                  <q-chip color="pink-6">{{Number(cardInfo.parameterMap[level].performance) +
                  (cardResType === 'after_training' ? Number(cardInfo.training.trainingPerformance) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendPerformance) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendPerformance) : 0)}}</q-chip>
                  +{{(cardResType === 'after_training' ? Number(cardInfo.training.trainingPerformance) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendPerformance) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendPerformance) : 0)}}
                </div>
                <div class="text-indigo-6" style="padding: 5px 0;">
                  {{$t('common.technic')}}
                  <q-chip color="indigo-6">{{Number(cardInfo.parameterMap[level].technique) +
                  (cardResType === 'after_training' ? Number(cardInfo.training.trainingTechnic) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendTechnique) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendTechnique) : 0)}}</q-chip>
                  +{{(cardResType === 'after_training' ? Number(cardInfo.training.trainingTechnic) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendTechnique) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendTechnique) : 0)}}
                </div>
                <div class="text-orange-8" style="padding: 5px 0;">
                  {{$t('common.visual')}}
                  <q-chip color="orange-8">{{Number(cardInfo.parameterMap[level].visual) +
                  (cardResType === 'after_training' ? Number(cardInfo.training.trainingVisual) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendVisual) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendVisual) : 0)}}</q-chip>
                  +{{(cardResType === 'after_training' ? Number(cardInfo.training.trainingVisual) : 0) +
                  (cardInfo.episodes && isSelfInfoReward ? Number(cardInfo.episodes.entries[0].appendVisual) : 0) +
                  (cardInfo.episodes && isMaxLvReward ? Number(cardInfo.episodes.entries[1].appendVisual) : 0)}}
                </div>
              </div>
            </q-card-main>
          </q-card>
          <q-card style="margin-top: 15px;">
            <q-card-main>
              <p style="font-size: 18px;">
                <q-icon name="trending up" />
                {{skillInfo.skillName}}
              </p>
              {{$t('card.skill-level')}}
              <q-input
                style="display: inline-block"
                v-model="skillLv"
                type="number"
                :min="1"
                :max="skillInfo.skillDetail.length || skillInfo.activateEffect.length || skillInfo.onceEffect.length"
              ></q-input>
              <p>{{skillInfo.skillDetail.find(sd => sd.skillLevel === skillLv).simpleDescription}}</p>
              <p>{{getSkillDesc((skillInfo.skillDetail[skillLv] ||
                skillInfo.skillDetail[Math.floor((skillLv - 1)/2)]).description,
                skillInfo.activateEffect, skillInfo.onceEffect, skillLv)}}</p>
            </q-card-main>
          </q-card>
          <q-card style="margin-top: 15px;">
            <q-card-main>
              <p style="font-size: 18px;">
                <q-icon name="highlight" />
                {{$t('card.training-title')}}
              </p>
              <div class="row" v-if="cardInfo.rarity >= 3">
                <div v-for="entry in cardInfo.training.costs.entries" class="column col-4 items-center" :key="entry.resourceId">
                  <img class="thumb-training" v-lazy="`/assets/thumb/material_rip/material0${String(entry.resourceId).length === 1 ? `0${entry.resourceId}` : entry.resourceId}.png`">
                  <span>{{entry.quantity}}</span>
                </div>
              </div>
              <div v-else>{{$t('card.no-train-ava')}}</div>
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
      this.level = Number(this.cardInfo.maxLevel)
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
      if (this.$specialCardList[this.server].indexOf(this.cardId) !== -1) {
        return `/assets-${this.server}/thumb/chara/card${this.cardGroup}_rip/${this.cardInfo.cardRes}_${this.cardResType}.png`
      }
      return `/assets/thumb/chara/card${this.cardGroup}_rip/${this.cardInfo.cardRes}_${this.cardResType}.png`
    },
    getCardImage () {
      if (this.$specialCardList[this.server].indexOf(this.cardId) !== -1) {
        return `/assets-${this.server}/characters/resourceset/${this.cardInfo.cardRes}_rip/${this.cardImgType}_${this.cardResType}.png`
      }
      return `/assets/characters/resourceset/${this.cardInfo.cardRes}_rip/${this.cardImgType}_${this.cardResType}.png`
    },
    getCardLivesd () {
      if (this.$specialCardList[this.server].indexOf(this.cardId) !== -1) {
        return `/assets-${this.server}/characters/livesd/${this.cardInfo.live2dRes}_rip/sdchara.png`
      }
      return `/assets-${this.server}/characters/livesd/${this.cardInfo.live2dRes}_rip/sdchara.png`
    },
    switchCardResType () {
      if (this.cardResType === 'normal') {
        this.cardResType = 'after_training'
        this.level = Number(this.cardInfo.maxLevel)
      } else if (this.cardResType === 'after_training') {
        this.cardResType = 'normal'
        this.level = Number(this.cardInfo.maxLevel) - 10
      }
    },
    switchCardImgType () {
      if (this.cardImgType === 'card') {
        this.cardImgType = 'trim'
      } else if (this.cardImgType === 'trim') {
        this.cardImgType = 'card'
      }
    },
    getSkillDesc (skillDesc, activateEffects, onceEffectList, skillLv) {
      const activateEffect = activateEffects ? activateEffects.find(af => af.skillLevel === skillLv) : this.skillInfo.skillDetail.find(sd => sd.skillLevel === skillLv)
      if (onceEffectList && onceEffectList.length && activateEffect) {
        const onceEffect = onceEffectList.find(oe => oe.skillLv === skillLv)
        return skillDesc.replace(/\{0\}/, onceEffect.onceEffectValue).replace(/\{1\}/, activateEffect.valueDescription)
      } else if (activateEffect) {
        return skillDesc.replace(/\{0\}/, activateEffect.valueDescription || activateEffect.duration)
      } else if (onceEffectList && onceEffectList.length) {
        const onceEffect = onceEffectList.find(oe => oe.skillLv === skillLv)
        return skillDesc.replace(/\{0\}/, `${onceEffect.onceEffectValue}`)
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
        this.level = Number(this.cardInfo.maxLevel)
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
  background url('~assets/icon_powerful.png') no-repeat
  background-size 100% 100%

.card-img-attr-cool
  position absolute
  top 1.7%
  right 1.5%
  width 45px
  height 45px
  background url('~assets/icon_cool.png') no-repeat
  background-size 100% 100%

.card-img-attr-happy
  position absolute
  top 1.7%
  right 1.5%
  width 45px
  height 45px
  background url('~assets/icon_happy.png') no-repeat
  background-size 100% 100%

.card-img-attr-pure
  position absolute
  top 1.7%
  right 1.5%
  width 45px
  height 45px
  background url('~assets/icon_pure.png') no-repeat
  background-size 100% 100%

.card-img-rarity-normal-1
  position absolute
  top 86%
  left 1%
  width 35px
  height 35px
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

.card-img-rarity-normal-2
  position absolute
  top 76%
  left 1%
  width 35px
  height 35px
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

.card-img-rarity-normal-3
  position absolute
  top 66%
  left 1%
  width 35px
  height 35px
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

.card-img-rarity-normal-4
  position absolute
  top 56%
  left 1%
  width 35px
  height 35px
  background url('~assets/star_untrained.png') no-repeat
  background-size 100% 100%

.card-img-rarity-after_training-1
  position absolute
  top 86%
  left 1%
  width 35px
  height 35px
  background url('~assets/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-rarity-after_training-2
  position absolute
  top 76%
  left 1%
  width 35px
  height 35px
  background url('~assets/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-rarity-after_training-3
  position absolute
  top 66%
  left 1%
  width 35px
  height 35px
  background url('~assets/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-rarity-after_training-4
  position absolute
  top 56%
  left 1%
  width 35px
  height 35px
  background url('~assets/star_after_training.png') no-repeat
  background-size 100% 100%

.card-img-frame-rainbow
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('~assets/frame_ss_rainbow.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-gold
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('~assets/frame_s_gold.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-silver
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('~assets/frame_r_silver.png') no-repeat
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-pure
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('~assets/frame_n_pure.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-powerful
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('~assets/frame_n_powerful.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-happy
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('~assets/frame_n_happy.png') no-repeat
  background-size cover
  background-size 100% 100%
  left 0
  top 0

.card-img-frame-cool
  position absolute
  width 100%
  height 280px
  max-width 420px
  background url('~assets/frame_n_cool.png') no-repeat
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
  background url('~assets/band_icon_1.png') no-repeat

.card-img-band-2
  position absolute
  top 2%
  left 1%
  width 50px
  height 50px
  background url('~assets/band_icon_2.png') no-repeat

.card-img-band-3
  position absolute
  top 2%
  left 1%
  width 50px
  height 50px
  background url('~assets/band_icon_3.png') no-repeat

.card-img-band-4
  position absolute
  top 2%
  left 1%
  width 50px
  height 50px
  background url('~assets/band_icon_4.png') no-repeat

.card-img-band-5
  position absolute
  top 2%
  left 1%
  width 50px
  height 50px
  background url('~assets/band_icon_5.png') no-repeat

.card-img-band
  width 100%
  height 50px
  background-size contain
  background-position center
  background-repeat no-repeat
</style>
