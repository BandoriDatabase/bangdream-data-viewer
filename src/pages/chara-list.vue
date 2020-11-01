<template>
  <q-page padding>
    <div>
      <div class="q-mb-lg">
        <span class="text-h3 text-bold">{{$t('left.chara')}}</span>
      </div>
      <div class="column ">
        <div class="row justify-center">
          <div
            class="col-2"
            v-for="i in 5"
            :key="i"
          >
            <my-q-img
              @click="() => {
                $router.push(`/chara/${server}/${i}`);
              }"
              class="chara-select-img"
              contain
              :src="`/assets/jp/characterselect_rip/button_charaprof-${String(i).padStart(2, '0')}.webp`"
            ></my-q-img>
          </div>
        </div>
        <div class="row justify-center">
          <div
            class="col-2"
            v-for="i in 5"
            :key="i"
          >
            <my-q-img
              @click="() => {
                $router.push(`/chara/${server}/${i+5}`);
              }"
              class="chara-select-img"
              contain
              :src="`/assets/jp/characterselect_rip/button_charaprof-${String(i+5).padStart(2, '0')}.webp`"
            ></my-q-img>
          </div>
        </div>
        <div class="row justify-center">
          <div
            class="col-2"
            v-for="i in 5"
            :key="i"
          >
            <my-q-img
              @click="() => {
                $router.push(`/chara/${server}/${i+10}`);
              }"
              class="chara-select-img"
              contain
              :src="`/assets/jp/characterselect_rip/button_charaprof-${String(i+10).padStart(2, '0')}.webp`"
            ></my-q-img>
          </div>
        </div>
        <div class="row justify-center">
          <div
            class="col-2"
            v-for="i in 5"
            :key="i"
          >
            <my-q-img
              @click="() => {
                $router.push(`/chara/${server}/${i+15}`);
              }"
              class="chara-select-img"
              contain
              :src="`/assets/jp/characterselect_rip/button_charaprof-${String(i+15).padStart(2, '0')}.webp`"
            ></my-q-img>
          </div>
        </div>
        <div class="row justify-center">
          <div
            class="col-2"
            v-for="i in 5"
            :key="i"
          >
            <my-q-img
              @click="() => {
                $router.push(`/chara/${server}/${i+20}`);
              }"
              class="chara-select-img"
              contain
              :src="`/assets/jp/characterselect_rip/button_charaprof-${String(i+20).padStart(2, '0')}.webp`"
            ></my-q-img>
          </div>
        </div>
        <div class="row justify-center">
          <div
            class="col-2"
            v-for="i in 5"
            :key="i"
          >
            <my-q-img
              @click="() => {
                $router.push(`/chara/${server}/${i+25}`);
              }"
              class="chara-select-img"
              contain
              :src="`/assets/jp/characterselect_rip/button_charaprof-${String(i+25).padStart(2, '0')}.webp`"
            ></my-q-img>
          </div>
        </div>
        <div class="row justify-center">
          <div
            class="col-2"
            v-for="i in 5"
            :key="i"
          >
            <my-q-img
              @click="() => {
                $router.push(`/chara/${server}/${i+30}`);
              }"
              class="chara-select-img"
              contain
              :src="`/assets/jp/characterselect_rip/button_charaprof-${String(i+30).padStart(2, '0')}.webp`"
            ></my-q-img>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  computed: {
    server () {
      return this.$route.params.server
    }
  }
}
</script>

<style lang="stylus" scoped>
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
