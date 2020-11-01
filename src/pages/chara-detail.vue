<template>
  <q-page>
    <div
      v-if="isReady"
      class="row q-col-gutter-sm"
    >
      <div class="col-12">
        <my-q-img
          class="chara-select-img"
          contain
          :src="`/assets/jp/characterselect_rip/button_charaprof-${String(charaId).padStart(2, '0')}.webp`"
        ></my-q-img>
      </div>
      <div class="col-12">
        <q-card class="q-mt-md">
          <q-card-section>
            <span>{{$t('common.basic-info')}}</span>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div>
                <q-badge>{{$t('chara.name')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <p>{{charaData.characterName}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div>
                <q-badge>{{$t('chara.voice-actor')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <p>{{charaData.profile.characterVoice}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between items-center">
              <div>
                <q-badge>{{$t('chara.band')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <!-- <p>{{charaBand.bandName}}</p> -->
              <my-q-img
                contain
                width="150px"
                height="70px"
                v-if="Number(charaData.bandId) <= 5 || Number(charaData.bandId) === 18 || Number(charaData.bandId) === 21"
                :src="`/assets/jp/band/logo/${charaData.bandId.toString().padStart(3, '0')}_rip/logol.webp`"
              />
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div>
                <q-badge>{{$t('chara.band-part.name')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <p>{{charaData.profile.part.split('_').map(part => $t(`chara.band-part.${part}`)).join(', ')}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div>
                <q-badge>{{$t('chara.birthday')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <p>{{moment(Number(charaData.profile.birthday)).format('MMMM Do')}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div>
                <q-badge>{{$t('chara.constellation.name')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <p>{{$t(`chara.constellation.${charaData.profile.constellation}`)}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div>
                <q-badge>{{$t('chara.school.name')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <p>{{$t(`chara.school.${charaData.profile.school}`)}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div>
                <q-badge>{{$t('chara.school-class')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <p>{{charaData.profile.schoolCls}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div>
                <q-badge>{{$t('chara.school-year')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <p>{{charaData.profile.schoolYear}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div>
                <q-badge>{{$t('chara.fav-food')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <p>{{charaData.profile.favoriteFood}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div>
                <q-badge>{{$t('chara.hated-food')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <p>{{charaData.profile.hatedFood}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div>
                <q-badge>{{$t('chara.hobby')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <p>{{charaData.profile.hobby}}</p>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div>
                <q-badge>{{$t('chara.self-intro')}}</q-badge>
              </div>
              <!-- <p>{{$t(`chara.type.${charaData}`)}}</p> -->
              <p>{{charaData.profile.selfIntroduction}}</p>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else-if="isError">
      {{$t('chara.not-exist', { server: $t(`common.${server}`), charaId })}}
    </div>
    <div v-else>
      {{$t('chara.fetch-chara-data')}}
      <q-spinner
        color="pink-6"
        size="48px"
      ></q-spinner>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      isReady: false,
      isError: false
    }
  },
  mounted () {
    this.$nextTick(async () => {
      try {
        await this.getCharaById({ charaId: this.charaId, server: this.server })
        await this.getBandList(this.server)
        this.isReady = true
      } catch (error) {
        this.isError = true
      }
    })
  },
  computed: {
    ...mapState('chara', [
      'charaMap'
    ]),
    ...mapState('band', [
      'bandMap'
    ]),
    server () {
      return this.$route.params.server
    },
    charaId () {
      return this.$route.params.charaId
    },
    charaData () {
      return this.charaMap[this.server][this.charaId]
    },
    charaBand () {
      return this.bandMap[this.server][this.charaData.bandId]
    }
  },
  methods: {
    ...mapActions('chara', [
      'getCharaById'
    ]),
    ...mapActions('band', [
      'getBandList'
    ]),
    moment
  },
  beforeRouteUpdate (to, from, next) {
    this.isReady = false
    this.isError = false
    this.$nextTick(async () => {
      try {
        await this.getCharaById({ charaId: this.charaId, server: this.server })
        await this.getBandList(this.server)
        this.isReady = true
      } catch (error) {
        this.isError = true
      }
    })
    next()
  }
}
</script>

<style lang="stylus" scoped>
.chara-select-img {
  margin-top: 1em;
}

@media (max-width: $breakpoint-sm-max) {
  .chara-select-img {
    cursor: pointer;
    // width: 100%;
    height: 200px;
  }
}

@media (min-width: $breakpoint-md-min) {
  .chara-select-img {
    cursor: pointer;
    // width: 114px;
    height: 350px;
  }
}
</style>
