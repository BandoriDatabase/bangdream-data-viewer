<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header v-model="isHeaderShow">
      <q-toolbar color="pink">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Bandori Database
          <div slot="subtitle">Version {{ appVer }}</div>
        </q-toolbar-title>

        <q-btn flat label="Settings" @click="$refs.settings.open()" icon="settings">
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :breakpoint="1439"
      content-class="bg-grey-2"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>{{$t('left.title')}}</q-list-header>
        <q-item @click.native="$router.push('/')" v-ripple>
          <q-item-side icon="home" />
          <q-item-main :label="$t('left.home')" />
        </q-item>
        <q-item @click.native="$router.push(`/card/overview/${$dataLang}`)" v-ripple>
          <!-- <q-list
            no-border
            link
          >
            <q-item @click.native="$router.push('/card/overview/jp')" v-ripple>
              <q-item-main :label="$t('common.jp')" />
            </q-item>
            <q-item @click.native="$router.push('/card/overview/tw')" v-ripple>
              <q-item-main :label="$t('common.tw')" />
            </q-item>
            <q-item @click.native="$router.push('/card/overview/kr')" v-ripple>
              <q-item-main :label="$t('common.kr')" />
            </q-item>
            <q-item @click.native="$router.push('/card/overview/en')" v-ripple>
              <q-item-main :label="$t('common.en')" />
            </q-item>
          </q-list> -->
          <q-item-side icon="picture_in_picture" />
          <q-item-main :label="$t('left.card')" />
        </q-item>
        <q-item @click.native="$router.push(`/music/${$dataLang}`)" v-ripple>
          <!-- <q-list
            no-border
            link
          >
            <q-item @click.native="$router.push('/music/jp')" v-ripple>
              <q-item-main :label="$t('common.jp')" />
            </q-item>
            <q-item @click.native="$router.push('/music/tw')" v-ripple>
              <q-item-main :label="$t('common.tw')" />
            </q-item>
            <q-item @click.native="$router.push('/music/kr')" v-ripple>
              <q-item-main :label="$t('common.kr')" />
            </q-item>
            <q-item @click.native="$router.push('/music/en')" v-ripple>
              <q-item-main :label="$t('common.en')" />
            </q-item>
          </q-list> -->
          <q-item-side icon="library_music" />
          <q-item-main :label="$t('left.music')" />
        </q-item >
        <q-item @click.native="$router.push(`/sfcs/${$dataLang}`)" v-ripple>
          <!-- <q-list
            no-border
            link
          >
            <q-item @click.native="$router.push('/sfcs/tw')" v-ripple>
              <q-item-main :label="$t('common.tw')" />
            </q-item>
            <q-item @click.native="$router.push('/sfcs/kr')" v-ripple>
              <q-item-main :label="$t('common.kr')" />
            </q-item>
            <q-item @click.native="$router.push('/sfcs/en')" v-ripple>
              <q-item-main :label="$t('common.en')" />
            </q-item>
          </q-list> -->
          <q-item-side icon="photo_library" />
          <q-item-main :label="$t('left.SFC')" />
        </q-item>
        <q-item @click.native="$router.push(`/stamp/${$dataLang}`)" v-ripple>
          <!-- <q-list
            no-border
            link
          >
            <q-item @click.native="$router.push('/stamp/jp')" v-ripple>
              <q-item-main :label="$t('common.jp')" />
            </q-item>
            <q-item @click.native="$router.push('/stamp/tw')" v-ripple>
              <q-item-main :label="$t('common.tw')" />
            </q-item>
            <q-item @click.native="$router.push('/stamp/kr')" v-ripple>
              <q-item-main :label="$t('common.kr')" />
            </q-item>
            <q-item @click.native="$router.push('/stamp/en')" v-ripple>
              <q-item-main :label="$t('common.en')" />
            </q-item>
          </q-list> -->
          <q-item-side icon="loyalty" />
          <q-item-main :label="$t('left.stamp')" />
        </q-item>
        <q-item @click.native="$router.push(`/l2d/${$dataLang}`)" v-ripple>
          <!-- <q-list
            no-border
            link
          >
            <q-item @click.native="$router.push('/l2d/jp')" v-ripple>
              <q-item-main :label="$t('common.jp')" />
            </q-item>
            <q-item @click.native="$router.push('/l2d/tw')" v-ripple>
              <q-item-main :label="$t('common.tw')" />
            </q-item>
            <q-item @click.native="$router.push('/l2d/kr')" v-ripple>
              <q-item-main :label="$t('common.kr')" />
            </q-item>
            <q-item @click.native="$router.push('/l2d/en')" v-ripple>
              <q-item-main :label="$t('common.en')" />
            </q-item>
          </q-list> -->
          <q-item-side icon="record_voice_over" />
          <q-item-main :label="$t('left.Live2d')" />
        </q-item>
        <q-item @click.native="$router.push(`/currevent/${$dataLang}`)" v-ripple>
          <!-- <q-list
            no-border
            link
          >
            <q-item @click.native="$router.push('/currevent/jp')" v-ripple>
              <q-item-main :label="$t('common.jp')" />
            </q-item>
            <q-item @click.native="$router.push('/currevent/tw')" v-ripple>
              <q-item-main :label="$t('common.tw')" />
            </q-item>
            <q-item @click.native="$router.push('/currevent/kr')" v-ripple>
              <q-item-main :label="$t('common.kr')" />
            </q-item>
            <q-item @click.native="$router.push('/currevent/en')" v-ripple>
              <q-item-main :label="$t('common.en')" />
            </q-item>
          </q-list> -->
          <q-item-side icon="schedule" />
          <q-item-main :label="$t('left.current-event')" />
        </q-item>
        <q-item @click.native="$router.push('/about')" v-ripple>
          <q-item-side icon="info" />
          <q-item-main :label="$t('left.about')" />
        </q-item>
        <q-item-separator />
        <q-list-header>{{$t('left.secTitle')}}</q-list-header>
        <q-item>
          <q-item-main :label="`${$t('common.jp')} ${$t('common.data-ver')}: v${resVer.jp || '0.0.0.0'}`"></q-item-main>
        </q-item>
        <q-item>
          <q-item-main :label="`${$t('common.tw')} ${$t('common.data-ver')}: v${resVer.tw || '0.0.0.0'}`"></q-item-main>
        </q-item>
        <q-item>
          <q-item-main :label="`${$t('common.kr')} ${$t('common.data-ver')}: v${resVer.kr || '0.0.0.0'}`"></q-item-main>
        </q-item>
        <q-item>
          <q-item-main :label="`${$t('common.en')} ${$t('common.data-ver')}: v${resVer.en || '0.0.0.0'}`"></q-item-main>
        </q-item>
        <q-item>
          <q-item-main :label="`${$t('common.app-ver')}: v${appVer}`" />
        </q-item>
        <q-item @click.native="$refs['update-note'].open()">
          <q-item-main :label="$t('left.update-note')" />
        </q-item>
        <q-item-separator />
        <q-list-header>{{$t('left.useful-link')}}</q-list-header>
        <q-item @click.native="openURL('https://discord.gg/vGb3eHH')">
          <q-item-side icon="fab fa-discord" />
          <q-item-main label="Discord server" sublabel="discord.gg/vGb3eHH" />
        </q-item>
        <q-item @click.native="openURL('https://www.reddit.com/r/BanGDream/')">
          <q-item-side icon="fab fa-reddit" />
          <q-item-main label="Reddit" sublabel="www.reddit.com/r/BanGDream/" />
        </q-item>
        <q-item @click.native="openURL('https://twitter.com/bang_dream_gbp')">
          <q-item-side icon="fab fa-twitter" />
          <q-item-main label="Twitter @bang_dream_gbp" sublabel="twitter.com/bang_dream_gbp" />
        </q-item>
        <q-item @click.native="openURL('https://twitter.com/BandoriD')">
          <q-item-side icon="fab fa-twitter" />
          <q-item-main label="Twitter @BandoriD" sublabel="twitter.com/BandoriD" />
        </q-item>
        <q-item @click.native="openURL('https://twitter.com/bandori_updates')">
          <q-item-side icon="fab fa-twitter" />
          <q-item-main label="Twitter @bandori_updates" sublabel="twitter.com/bandori_updates" />
        </q-item>
        <q-item @click.native="openURL('https://www.bangdream.moe/')">
          <q-item-side icon="open_in_new" />
          <q-item-main label="BanG Dream!导航站" sublabel="www.bangdream.moe" />
        </q-item>
        <q-item @click.native="openURL('https://www.bangdreamwiki.com/')">
          <q-item-side icon="open_in_new" />
          <q-item-main label="BanG Dream! WiKi!" sublabel="www.bangdreamwiki.com" />
        </q-item>
        <q-item @click.native="openURL('http://home.bangdream.space/')">
          <q-item-side icon="open_in_new" />
          <q-item-main label="炸帮裂梦乐团Mastodon" sublabel="home.bangdream.space" />
        </q-item>
        <q-item @click.native="openURL('https://forum.gamer.com.tw/A.php?bsn=31877')">
          <q-item-side icon="open_in_new" />
          <q-item-main label="少女樂團派對 哈啦板" sublabel="forum.gamer.com.tw/A.php?bsn=31877" />
        </q-item>
        <q-item @click.native="openURL('https://kekeke.cc/bang_dream_gbp')">
          <q-item-side icon="open_in_new" />
          <q-item-main label="bang_dream_gbp/kekeke" sublabel="kekeke.cc/bang_dream_gbp" />
        </q-item>
        <q-item @click.native="openURL('https://bang-dream.bushimo.jp/')">
          <q-item-side icon="open_in_new" />
          <q-item-main label="Game offcial site" sublabel="bang-dream.bushimo.jp" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
      <q-btn
        v-back-to-top.animate="{offset: 500, duration: 200}"
        round
        color="pink"
        class="fixed-bottom-right animate-pop"
        style="margin: 0 15px 15px 0"
      >
        <q-icon name="keyboard_arrow_up" />
      </q-btn>
    </q-page-container>

    <settings-modal ref="settings"></settings-modal>
    <update-notes-modal ref="update-note"></update-notes-modal>
  </q-layout>
</template>

<script>
import { openURL, LocalStorage } from 'quasar'
import { mapActions, mapState } from 'vuex'
import semver from 'semver'

import SettingsModal from 'components/modals/settings'
import UpdateNotesModal from 'components/modals/update-notes'

export default {
  name: 'LayoutDefault',
  components: {
    SettingsModal,
    UpdateNotesModal
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      appVer: '0.8.0',
      moremenuOpen: false,
      isHeaderShow: true
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
      const lastAppVer = LocalStorage.get.item('appVer')
      if (!lastAppVer || semver.gt(this.appVer, lastAppVer)) {
        this.$refs['update-note'].open()
        LocalStorage.set('appVer', this.appVer)
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
