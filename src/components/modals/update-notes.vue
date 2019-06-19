<template>
  <q-modal ref="modal" :content-css="{maxWidth: '800px', padding: '10px'}"
    v-model="isOpen"
  >
    <h4 class="uppercase">{{$t('update.title')}} <small>0.9.0</small></h4>
    <p v-html="$t('update.desc')"></p>
    <h5 class="uppercase">{{$t('update.new-features')}}</h5>
    <ul>
      <li v-for="i in 1" :key="i">{{$t(`update.feature-detail[${i - 1}]`)}}</li>
    </ul>
    <h5 class="uppercase">{{$t('update.fixed-bugs')}}</h5>
    <ul>
      <li v-for="i in 3" :key="i">{{$t(`update.bug-detail[${i - 1}]`)}}</li>
    </ul>
    <p v-html="$t('update.welcome-bug-report')"></p>
    <div class="action-buttons">
      <q-btn color="pink" @click="isOpen = false">Close</q-btn>
    </div>
  </q-modal>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    open () {
      this.isOpen = true
    }
  }
}
</script>

<style>
</style>
