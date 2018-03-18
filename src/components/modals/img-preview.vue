<template>
  <q-modal v-model="isOpen" :content-css="{minWidth: w}">
    <q-card>
      <q-card-title :class="titleBG ? `bg-${titleBG} text-white` : ''">
        {{title}}
        <q-btn round flat
          @click="openURL(src)"
          icon="launch"
        ></q-btn>
        <q-btn round flat
          style="float: right;"
          @click="isOpen = false"
          icon="close"
        ></q-btn>
      </q-card-title>
      <q-card-separator></q-card-separator>
      <q-card-main>
        <img :src="src" style="width: 100%" />
      </q-card-main>
    </q-card>
  </q-modal>
</template>

<script>
import { openURL } from 'quasar'

export default {
  // name: 'ComponentName',
  data () {
    return {
      isOpen: false,
      title: '',
      src: '',
      titleBG: '',
      w: '80vw',
      h: '80vh'
    }
  },
  methods: {
    openURL,
    open (option) {
      this.title = option.title
      this.isOpen = true
      this.src = option.src
      this.titleBG = option.titleBG
      this.w = option.w || '80vw'
      this.h = option.h || '80vw'
    }
  }
}
</script>

<style>
</style>
