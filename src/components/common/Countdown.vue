<template>
  <div>
    <div class="row items-center" v-if="!small">
      <div class="column items-center cd-elem col-3">
        <h4 class="no-margin">{{days}}</h4>
        <h6 class="no-margin">Days</h6>
      </div>
      <div class="column items-center cd-elem col-3">
        <h4 class="no-margin">{{hours}}</h4>
        <h6 class="no-margin">Hours</h6>
      </div>
      <div class="column items-center cd-elem col-3">
        <h4 class="no-margin">{{minutes}}</h4>
        <h6 class="no-margin">Minutes</h6>
      </div>
      <div class="column items-center cd-elem col-3">
        <h4 class="no-margin">{{seconds}}</h4>
        <h6 class="no-margin">Seconds</h6>
      </div>
    </div>
    <div class="row items-center" v-else>
      <div class="column items-center cd-elem col-3">
        <h5 class="no-margin">{{days}}</h5>
        <p class="no-margin">Days</p>
      </div>
      <div class="column items-center cd-elem col-3">
        <h5 class="no-margin">{{hours}}</h5>
        <p class="no-margin">Hours</p>
      </div>
      <div class="column items-center cd-elem col-3">
        <h5 class="no-margin">{{minutes}}</h5>
        <p class="no-margin">Minutes</p>
      </div>
      <div class="column items-center cd-elem col-3">
        <h5 class="no-margin">{{seconds}}</h5>
        <p class="no-margin">Seconds</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'countdown',
  data () {
    return {
      timeNow: Math.trunc((new Date()).getTime() / 1000)
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
      if (this.targetTime) { // make sure we can calculate
        const targetTimeSec = Math.trunc((new Date(this.targetTime)).getTime() / 1000)
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
      this.timeNow = Math.trunc((new Date()).getTime() / 1000)
    }, 1000)
  }
}
</script>

<style scoped>
.no-margin {
  margin: 0;
}
.cd-elem {
  margin: 0px;
}
</style>
