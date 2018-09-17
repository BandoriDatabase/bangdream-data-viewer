<template>
  <q-page padding>
    <viewer :images="imgs">
      <img v-for="src in imgs" :src="src" :key="src">
    </viewer>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      imgs: [
        'titles/miku_2018_3_rip/title_bg.png'
      ]
    }
  }
}
</script>

<style>
</style>
