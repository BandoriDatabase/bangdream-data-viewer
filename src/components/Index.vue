<template>
  <q-layout>
    <div slot="header" class="toolbar pink">
      <button @click="$refs.leftDrawer.open()">
        <i>menu</i>
      </button>
      <q-toolbar-title :padding="0">
        Bandori Database v{{master.constants ? master.constants.resVer : '0.0.0.0'}}
      </q-toolbar-title>
    </div>

    <q-drawer ref="leftDrawer" swipe-only>
      <div class="toolbar pink">
        <q-toolbar-title>
          Toolbox
        </q-toolbar-title>
      </div>
      <div class="list no-border platform-delimiter">
        <q-drawer-link icon="home" :to="{path: '/', exact: true}">
          Home
        </q-drawer-link>
        <q-drawer-link icon="picture_in_picture" :to="'/card'">
          Cards
        </q-drawer-link>
        <q-drawer-link icon="library_music" :to="'/music'">
          Musics
        </q-drawer-link>
        <q-drawer-link icon="photo_library" :to="'/sfcs'">
          Single Frame Cartoons
        </q-drawer-link>
        <q-drawer-link icon="card_giftcard" :to="'/donate'">
          Donate
        </q-drawer-link>
      </div>
      <div class="list platform-delimiter fixed-bottom">
        <p>App Ver v0.1.0</p>
        <p>Built with Quasar Framework v{{$q.version}}</p>
      </div>
    </q-drawer>

    <!--
      Replace following "div" with
      "<router-view class="layout-view">" component
      if using subRoutes
    -->
    <div class="layout-view">
      <!--<div class="logo-container non-selectable no-pointer-events">
        <div class="logo" :style="position">
          <img src="~assets/quasar-logo.png">
          <p class="caption text-center">
            <span v-if="orienting || rotating">Tilt your device.</span>
            <template v-else>
              <span class="touch-only">Touch screen and move.</span>
            </template>
          </p>
        </div>
      </div>-->
      <router-view class="layout-padding"></router-view>
    </div>
  </q-layout>
</template>

<script>
// const moveForce = 30
// const rotateForce = 40
// const RAD_TO_DEG = 180 / Math.PI

import { Loading } from 'quasar'
import { mapActions, mapState } from 'vuex'

// function getRotationFromAccel (accelX, accelY, accelZ) {
//   /* Reference: http://stackoverflow.com/questions/3755059/3d-accelerometer-calculate-the-orientation#answer-30195572 */
//   const sign = accelZ > 0 ? 1 : -1
//   const miu = 0.001

//   return {
//     roll: Math.atan2(accelY, sign * Math.sqrt(Math.pow(accelZ, 2) + miu * Math.pow(accelX, 2))) * RAD_TO_DEG,
//     pitch: -Math.atan2(accelX, Math.sqrt(Math.pow(accelY, 2) + Math.pow(accelZ, 2))) * RAD_TO_DEG
//   }
// }

export default {
  // data () {
  //   return {
  //     orienting: window.DeviceOrientationEvent && !Platform.is.desktop,
  //     rotating: window.DeviceMotionEvent && !Platform.is.desktop,
  //     moveX: 0,
  //     moveY: 0,
  //     rotateY: 0,
  //     rotateX: 0
  //   }
  // },
  computed: {
    ...mapState('DB', [
      'master',
      'getMasterDBStatus',
      'live2d',
      'getLive2DDBStatus'
    ])
    // position () {
    //   const transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`
    //   return {
    //     top: this.moveY + 'px',
    //     left: this.moveX + 'px',
    //     '-webkit-transform': transform,
    //     '-ms-transform': transform,
    //     transform
    //   }
    // },
  },
  watch: {
    getMasterDBStatus (newVal) {
      if (newVal === 1) {
        Loading.show({
          message: 'Loading Master Database...'
        })
      }
      else {
        Loading.hide()
      }
    },
    getLive2DDBStatus (newVal) {
      if (newVal === 1) {
        Loading.show({
          message: 'Loading Live2D Database...'
        })
      }
      else {
        Loading.hide()
      }
    }
  },
  methods: {
    ...mapActions('DB', [
      'getMasterDB',
      'getLive2D'
    ])
    // move (evt) {
    //   const {width, height} = Utils.dom.viewport()
    //   const {top, left} = Utils.event.position(evt)
    //   const halfH = height / 2
    //   const halfW = width / 2

    //   this.moveX = (left - halfW) / halfW * -moveForce
    //   this.moveY = (top - halfH) / halfH * -moveForce
    //   this.rotateY = (left / width * rotateForce * 2) - rotateForce
    //   this.rotateX = -((top / height * rotateForce * 2) - rotateForce)
    // },
    // rotate (evt) {
    //   if (evt.rotationRate &&
    //       evt.rotationRate.beta !== null &&
    //       evt.rotationRate.gamma !== null) {
    //     this.rotateX = evt.rotationRate.beta * 0.7
    //     this.rotateY = evt.rotationRate.gamma * -0.7
    //   }
    //   else {
    //     /* evt.acceleration may be null in some cases, so we'll fall back
    //        to evt.accelerationIncludingGravity */
    //     const accelX = evt.acceleration.x || evt.accelerationIncludingGravity.x
    //     const accelY = evt.acceleration.y || evt.accelerationIncludingGravity.y
    //     const accelZ = evt.acceleration.z || evt.accelerationIncludingGravity.z - 9.81

    //     const rotation = getRotationFromAccel(accelX, accelY, accelZ)
    //     this.rotateX = rotation.roll * 0.7
    //     this.rotateY = rotation.pitch * -0.7
    //   }
    // },
    // orient (evt) {
    //   if (evt.beta === null || evt.gamma === null) {
    //     window.removeEventListener('deviceorientation', this.orient, false)
    //     this.orienting = false

    //     window.addEventListener('devicemotion', this.rotate, false)
    //   }
    //   else {
    //     this.rotateX = evt.beta * 0.7
    //     this.rotateY = evt.gamma * -0.7
    //   }
    // }
  },
  mounted () {
    this.$nextTick(() => {
      // if (this.orienting) {
      //   window.addEventListener('deviceorientation', this.orient, false)
      // }
      // else if (this.rotating) {
      //   window.addEventListener('devicemove', this.rotate, false)
      // }
      // else {
      //   document.addEventListener('mousemove', this.move)
      // }
      if (this.getMasterDBStatus !== 2) {
        this.getMasterDB()
          .then(() => this.getLive2D())
      }
    })
  },
  beforeDestroy () {
    // if (this.orienting) {
    //   window.removeEventListener('deviceorientation', this.orient, false)
    // }
    // else if (this.rotating) {
    //   window.removeEventListener('devicemove', this.rotate, false)
    // }
    // else {
    //   document.removeEventListener('mousemove', this.move)
    // }
  }
}
</script>

<style lang="stylus">
.logo-container
  width 192px
  height 268px
  perspective 800px
  position absolute
  top 50%
  left 50%
  transform translateX(-50%) translateY(-50%)
.logo
  position absolute
  transform-style preserve-3d
</style>
