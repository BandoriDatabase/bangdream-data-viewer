<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$store.dispatch('initState', this.$servers)
  }
}
</script>

<style lang="stylus">

</style>
