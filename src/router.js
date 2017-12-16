import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  return () => System.import(`components/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  routes: [
    { path: '/',
      component: load('Index'),
      children: [
        { path: '/', component: load('Home') },
        { name: 'cardOverview', path: '/card/overview/:server(\\S{2})', component: load('cards/CardOverview') },
        { name: 'cardDetail', path: '/card/:server(\\S{2})/:cardId(\\d+)', component: load('CardDetail') },
        { name: 'singleFrame', path: '/sfcs/:server(\\S{2})', component: load('SingleFrameCartoon') },
        { name: 'musicOverview', path: '/music/:server(\\S{2})', component: load('Musics') },
        { name: 'musicDetail', path: '/music/:server(\\S{2})/:musicId(\\d+)', component: load('MusicDetail') },
        { name: 'currEvent', path: '/currevent', component: load('EventInfo') },
        { path: '/setting', component: load('Settings') },
        { name: 'musicScore', path: '/musicscore/:musicId(\\d+)', component: load('MusicScore') },
        // { path: '/live2d', component: load('Live2D') },
        { path: '/about', component: load('About') }
      ]}, // Default
    { path: '*', redirect: '/' } // Not found
  ]
})
