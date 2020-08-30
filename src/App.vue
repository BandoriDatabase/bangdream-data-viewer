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

    this.$on('offline', () => {
      this.$q.notify({
        message: this.$t('worker.offline'),
        color: 'secondary'
      })
    })
  }
}
</script>

<style lang="stylus">

</style>
