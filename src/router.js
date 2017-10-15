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
        { path: '/card',
          redirect: '/card/overview',
          component: load('Cards'), // Cards viewer
          children: [
            { name: 'cardDetail', path: '/card/:cardId(\\d+)', component: load('CardDetail') },
            { name: 'cardTable', path: '/card/table', component: load('cards/CardTable') },
            { name: 'cardOverview', path: '/card/overview', component: load('cards/CardOverview') }
          ]
        },
        { path: '/sfcs', component: load('SingleFrameCartoon') },
        { path: '/music',
          component: load('Musics'),
          children: [
            { name: 'musicDetail', path: '/music/:musicId', component: load('MusicDetail') }
          ]
        },
        { path: '/currevent', component: load('EventInfo') },
        // { path: '/live2d', component: load('Live2D') },
        { path: '/about', component: load('About') }
      ]}, // Default
    { path: '*', redirect: '/' } // Not found
  ]
})
