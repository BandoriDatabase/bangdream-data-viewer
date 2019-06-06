<template>
  <div style="width: 100%">
    <div class="row gutter-sm items-center"
         v-if="!small">
      <div class="column items-center cd-elem col-3">
        <h4 class="q-ma-none">{{days}}</h4>
        <h6 class="q-ma-none">Days</h6>
      </div>
      <div class="column items-center cd-elem col-3">
        <h4 class="q-ma-none">{{hours}}</h4>
        <h6 class="q-ma-none">Hours</h6>
      </div>
      <div class="column items-center cd-elem col-3">
        <h4 class="q-ma-none">{{minutes}}</h4>
        <h6 class="q-ma-none">Mins</h6>
      </div>
      <div class="column items-center cd-elem col-3">
        <h4 class="q-ma-none">{{seconds}}</h4>
        <h6 class="q-ma-none">Secs</h6>
      </div>
    </div>
    <div class="row items-center justify-center"
         v-else>
      <div class="column items-center cd-elem col-12">
        <h5 class="q-ma-none">{{days}}<small>d</small></h5>
      </div>
      <div class="column items-center cd-elem col-4">
        <h5 class="q-ma-none">{{hours}}<small>h</small></h5>
      </div>
      <div class="column items-center cd-elem col-4">
        <h5 class="q-ma-none">{{minutes}}<small>m</small></h5>
      </div>
      <div class="column items-center cd-elem col-4">
        <h5 class="q-ma-none">{{seconds}}<small>s</small></h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'countdown',
  data () {
    return {
      timeNow: Math.trunc(new Date().getTime() / 1000)
    }
  },
  props: {
    targetTime: {
      type: Number,
      required: true
    },
    small: {
      type: Boolean
    }
  },
  computed: {
    toTargetTime () {
      if (this.targetTime) {
        // make sure we can calculate
        const targetTimeSec = Math.trunc(
          new Date(this.targetTime).getTime() / 1000
        )
        return targetTimeSec - this.timeNow
      }
      return -1
    },
    days () {
      return Math.trunc(this.toTargetTime / 60 / 60 / 24)
    },
    hours () {
      return Math.trunc(this.toTargetTime / 60 / 60) % 24
    },
    minutes () {
      return Math.trunc(this.toTargetTime / 60) % 60
    },
    seconds () {
      return this.toTargetTime % 60
    }
  },
  mounted () {
    setInterval(() => {
      this.timeNow = Math.trunc(new Date().getTime() / 1000)
    }, 1000)
  }
}
</script>

<style>
</style>
