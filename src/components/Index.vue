<template>
  <q-layout ref="main" view="hHr LpR lFf" reveal :left-breakpoint="1365">
    <q-toolbar slot="header" class="toolbar bg-pink">
      <q-btn flat @click="$refs.main.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title :padding="0">
        Bandori {{$t('toolbar.title')}} v{{appVer}}
      </q-toolbar-title>
    </q-toolbar>

    <div slot="left">
      <q-list no-border link>
        <q-list-header>{{$t('left.title')}}</q-list-header>
        <q-side-link item to="/" exact>
          <q-item-side icon="home" />
          <q-item-main :label="$t('left.home')" />
        </q-side-link>
        <q-collapsible icon="picture_in_picture" :label="$t('left.card')">
          <q-side-link item to="/card/overview/jp">
            <!-- <q-item-side icon="image" /> -->
            <q-item-main :label="$t('left.jp-srv')" />
          </q-side-link>
          <q-side-link item to="/card/overview/tw">
            <!-- <q-item-side icon="image" /> -->
            <q-item-main :label="$t('left.tw-srv')" />
          </q-side-link>
          <!-- <q-side-link item to="/card/table">
            <q-item-side>
              <table-large-icon />
            </q-item-side>
            <q-item-main :label="$t('left.table')" />
          </q-side-link> -->
        </q-collapsible>
        <!-- <q-side-link item to="/card/overview">
          <q-item-side icon="image" />
          <q-item-main :label="$t('left.card')" />
        </q-side-link> -->
        <q-collapsible icon="library_music" :label="$t('left.music')">
          <q-side-link item to="/music/jp">
            <!-- <q-item-side icon="image" /> -->
            <q-item-main :label="$t('left.jp-srv')" />
          </q-side-link>
          <q-side-link item to="/music/tw">
            <!-- <q-item-side icon="image" /> -->
            <q-item-main :label="$t('left.tw-srv')" />
          </q-side-link>
        </q-collapsible>
        <!-- <q-side-link item to="/music">
          <q-item-side icon="library_music" />
          <q-item-main :label="$t('left.music')" />
        </q-side-link> -->
        <q-collapsible icon="photo_library" :label="$t('left.SFC')">
          <q-side-link item to="/sfcs/jp">
            <!-- <q-item-side icon="image" /> -->
            <q-item-main :label="$t('left.jp-srv')" />
          </q-side-link>
          <q-side-link item to="/sfcs/tw">
            <!-- <q-item-side icon="image" /> -->
            <q-item-main :label="$t('left.tw-srv')" />
          </q-side-link>
        </q-collapsible>
        <!-- <q-side-link item to="/sfcs">
          <q-item-side icon="photo_library" />
          <q-item-main :label="$t('left.SFC')" />
        </q-side-link> -->
        <q-side-link item to="/currevent">
          <q-item-side icon="schedule" />
          <q-item-main :label="$t('left.current-event')" />
        </q-side-link>
        <q-side-link item to="/setting">
          <q-item-side icon="settings" />
          <q-item-main :label="$t('left.settings')" />
        </q-side-link>
        <q-side-link item to="/about">
          <q-item-side icon="info" />
          <q-item-main :label="$t('left.about')" />
        </q-side-link>
        <q-item-separator />
        <q-list-header>{{$t('left.secTitle')}}</q-list-header>
        <q-item>
          <q-item-main :label="`JP Data Ver: v${resVer.jp || '0.0.0.0'}`"></q-item-main>
        </q-item>
        <q-item>
          <q-item-main :label="`TW Data Ver: v${resVer.tw || '0.0.0.0'}`"></q-item-main>
        </q-item>
        <q-item :highlight="false">
          <q-item-main :label="`App Ver: v${appVer}`" />
        </q-item>
      </q-list>
    </div>

    <!--
      Replace following "div" with
      "<router-view class="layout-view">" component
      if using subRoutes
    -->
    <div class="layout-view">
      <router-view class="layout-padding" />
      <q-btn
        v-back-to-top.animate="{offset: 500, duration: 200}"
        round
        color="teal-5"
        class="fixed-bottom-right animate-pop"
        style="margin: 0 15px 15px 0"
      >
        <q-icon name="keyboard_arrow_up" />
      </q-btn>
    </div>
  </q-layout>
</template>

<i18n>
{
  "en": {
    "toolbar": {
      "title": "Database"
    },
    "left": {
      "title": "Toolbox",
      "home": "Home",
      "card": "Cards",
      "table": "Table",
      "gallery": "Gallery",
      "jp-srv": "Japan Server",
      "tw-srv": "Taiwan Server",
      "music": "Musics",
      "SFC": "Loading Cartoons",
      "about": "About",
      "secTitle": "Building info",
      "current-event": "Current Event",
      "settings": "Settings"
    }
  },
  "zh-cn": {
    "toolbar": {
      "title": "数据库"
    },
    "left": {
      "title": "工具箱",
      "home": "首页",
      "card": "卡牌",
      "table": "表格模式",
      "gallery": "大图模式",
      "jp-srv": "日服",
      "tw-srv": "台服",
      "music": "歌曲",
      "SFC": "加载界面漫画",
      "about": "关于我们",
      "secTitle": "版本",
      "current-event": "当前活动",
      "settings": "设置"
    }
  },
  "zh-tw": {
    "toolbar": {
      "title": "數據庫"
    },
    "left": {
      "title": "工具箱",
      "home": "首頁",
      "card": "卡牌",
      "table": "表格模式",
      "gallery": "大圖模式",
      "jp-srv": "日服",
      "tw-srv": "台服",
      "music": "歌曲",
      "SFC": "加載界面漫畫",
      "about": "關於我們",
      "secTitle": "版本",
      "current-event": "當前活動",
      "settings": "設置"
    }
  },
  "ja": {
    "toolbar": {
      "title": "データベース"
    },
    "left": {
      "title": "工具一式",
      "home": "ホーム",
      "card": "カード",
      "table": "詳細表示",
      "gallery": "画像表示",
      "jp-srv": "日本サーバー",
      "tw-srv": "台湾サーバー",
      "music": "楽曲",
      "SFC": "読み込みマンガ",
      "about": "このサイトについて",
      "secTitle": "バージョン情報",
      "current-event": "開催中のイベント",
      "settings": "設定"
    }
  }
}
</i18n>

<script>
import {
  QLayout,
  QListHeader,
  QList,
  QIcon,
  QSideLink,
  QItemSide,
  QItemMain,
  QBtn,
  QToolbar,
  QToolbarTitle,
  QItem,
  BackToTop,
  QItemSeparator,
  QCollapsible
} from 'quasar'
import { mapActions, mapState } from 'vuex'

import tableLargeIcon from 'icons/table-large'

export default {
  components: {
    QLayout,
    QListHeader,
    QList,
    QIcon,
    QSideLink,
    QItemSide,
    QItemMain,
    QBtn,
    QToolbar,
    QToolbarTitle,
    QItem,
    QItemSeparator,
    QCollapsible,
    tableLargeIcon
  },
  directives: {
    BackToTop
  },
  data () {
    return {
      appVer: '0.4.3'
    }
  },
  computed: {
    ...mapState('version', [
      'resVer'
    ])
  },
  methods: {
    ...mapActions('version', [
      'getResourceVersion'
    ])
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getResourceVersion()
    })
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
