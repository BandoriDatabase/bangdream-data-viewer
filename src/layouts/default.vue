<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-model="isHeaderShow">
      <q-toolbar class="bg-pink shadow-1">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Bandori Top
          <small>{{ appVer }}</small>
        </q-toolbar-title>

        <q-btn flat :label="$t('common.settings')" @click="$refs.settings.open()" icon="settings">
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="1439"
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>{{$t('left.title')}}</q-item-label>
        <q-item clickable v-for="(item, idx) in menuList" :key="`menu-${idx}`"
          :active="$route.name === item.name" @click="item.url ? openURL(item.url) : $router.push({ name: item.name, params: { server: $dataLang } })" v-ripple>
          <q-item-section avatar>
            <q-icon :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{$t(item.i18n)}}
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item-label header>{{$t('left.secTitle')}}</q-item-label>
        <q-item v-for="(server, idx) in $servers" :key="`server-${idx}`">
          <q-item-section>
            {{$t(`common.${server}`)}} {{$t('common.data-ver')}}: v{{resVer[server] || '0.0.0.0'}}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            {{$t('common.app-ver')}}: v{{appVer}}
          </q-item-section>
        </q-item>
        <q-item @click="openURL('//blog.dnaroma.eu/update-notice-en')" clickable>
          <q-item-section>
            {{$t('left.update-note')}}
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item-label header>{{$t('left.useful-link')}}</q-item-label>
        <q-item clickable v-for="(item, idx) in externalLinks" :key="`external-${idx}`" @click="openURL(item.url)" v-ripple>
          <q-item-section avatar>
            <q-icon :name="item.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{item.label}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item @click.native="openURL('https://bang-dream.bushimo.jp/')">
          <q-item-section icon="open_in_new" />
          <q-item-label label="Game offcial site" sublabel="bang-dream.bushimo.jp" />
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-ajax-bar color="white"></q-ajax-bar>
      <router-view style="max-width: 718px; margin: auto;" />
      <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
        <q-btn fab-mini icon="keyboard_arrow_up" color="pink" />
      </q-page-scroller>
    </q-page-container>

    <settings-modal ref="settings"></settings-modal>
    <!-- <update-notes-modal ref="update-note"></update-notes-modal> -->
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { mapActions, mapState } from 'vuex'
import semver from 'semver'

import SettingsModal from 'components/modals/settings'
// import UpdateNotesModal from 'components/modals/update-notes'

export default {
  name: 'LayoutDefault',
  components: {
    SettingsModal
    // UpdateNotesModal
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      appVer: '0.9.0',
      moremenuOpen: false,
      isHeaderShow: true,
      menuList: [
        {
          name: 'index',
          i18n: 'left.home',
          icon: 'home'
        },
        {
          name: 'cardList',
          i18n: 'left.card',
          icon: 'picture_in_picture'
        },
        {
          name: 'musicList',
          i18n: 'left.music',
          icon: 'library_music'
        },
        {
          name: 'sfc',
          i18n: 'left.SFC',
          icon: 'photo_library'
        },
        {
          name: 'ffc',
          i18n: 'left.FFC',
          icon: 'burst_mode'
        },
        {
          name: 'titleList',
          i18n: 'left.gametitle',
          icon: 'aspect_ratio'
        },
        {
          name: 'stampList',
          i18n: 'left.stamp',
          icon: 'loyalty'
        },
        {
          name: 'live2d',
          url: '/live2d.html',
          i18n: 'left.Live2d',
          icon: 'record_voice_over'
        },
        {
          name: 'currEvent',
          i18n: 'left.current-event',
          icon: 'schedule'
        },
        {
          name: 'about',
          url: '//blog.dnaroma.eu/about/',
          i18n: 'left.about',
          icon: 'info'
        }
      ],
      externalLinks: [
        {
          label: 'Discord',
          icon: 'fab fa-discord',
          url: '//discord.gg/vGb3eHH'
        },
        {
          label: 'Reddit',
          icon: 'fab fa-reddit',
          url: '//www.reddit.com/r/BanGDream/'
        },
        {
          label: '@bang_dream_gbp',
          icon: 'fab fa-twitter',
          url: '//twitter.com/bang_dream_gbp'
        },
        {
          label: '@bandori_updates',
          icon: 'fab fa-twitter',
          url: '//twitter.com/bandori_updates'
        },
        {
          label: 'Game Official Site',
          icon: 'open_in_new',
          url: '//bang-dream.bushimo.jp'
        },
        {
          label: 'Bestdori!',
          icon: 'open_in_new',
          url: '//bestdori.com'
        },
        {
          label: '少女樂團派對 哈啦板',
          icon: 'open_in_new',
          url: '//forum.gamer.com.tw/A.php?bsn=31877'
        },
        {
          label: 'bang_dream_gbp/kekeke',
          icon: 'open_in_new',
          url: '//kekeke.cc/bang_dream_gbp'
        }
      ]
    }
  },
  computed: {
    ...mapState('version', [
      'resVer'
    ])
  },
  methods: {
    openURL,
    ...mapActions('version', [
      'getResourceVersion'
    ])
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getResourceVersion()
      const lastAppVer = this.$q.localStorage.getItem('appVer')
      if (!lastAppVer || semver.gt(this.appVer, lastAppVer)) {
        // this.$refs['update-note'].open()
        this.$q.localStorage.set('appVer', this.appVer)
      }

      this.$root.$on('hide-header', () => {
        this.isHeaderShow = false
      })
      this.$root.$on('show-header', () => {
        this.isHeaderShow = true
      })
    })
  }
}
</script>

<style>
</style>
