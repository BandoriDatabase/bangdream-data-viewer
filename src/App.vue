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
img {
  image-rendering: -webkit-optimize-contrast;
}
svg.material-design-icon__svg {
    fill: rgba(0,0,0,0.54);
}
</style>
