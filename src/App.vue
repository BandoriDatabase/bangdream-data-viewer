<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view></router-view>
  </div>
</template>

<script>
/*
 * Root component
 */
export default {}
</script>

<style>
.thumb-normal-pure {
  background: url('~assets/MenuAtlas.png') no-repeat 0 30.139%;
  width: 60px;
  height: 60px;
  background-size: 1130% 1130%;
}
.thumb-normal-powerful {
  background: url('~assets/MenuAtlas.png') no-repeat 0 20.396%;
	width: 60px;
  height: 60px;
  background-size: 1130% 1130%;
}
.thumb-normal-cool {
  background: url('~assets/MenuAtlas.png') no-repeat 10.707% 48.287%;
	width: 60px;
  height: 60px;
  background-size: 1130% 1130%;
}
.thumb-normal-happy {
  background: url('~assets/MenuAtlas.png') no-repeat 0 0.91%;
	width: 60px;
  height: 60px;
  background-size: 1130% 1130%;
}
.thumb-rare {
  background: url('~assets/MenuAtlas.png') no-repeat 0 49.625%;
  width: 60px;
  height: 60px;
  background-size: 1120% 1120%;
}
.thumb-super-rare {
  background: url('~assets/MenuAtlas.png') no-repeat 0 39.882%;
  width: 60px;
  height: 60px;
  background-size: 1120% 1120%;
}
.thumb-ss-rare {
  background: url('~assets/MenuAtlas.png') no-repeat 0 59.368%;
  width: 60px;
  height: 60px;
  background-size: 1120% 1120%;
}
</style>
