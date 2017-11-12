<template>
  <div>
    <div class="row justify-center items-center" style="text-align: center;">
      <span v-html="$t('update')"></span>
    </div>

    <div class="row gutter">
      <div class="col-lg-4 col-xl-4 col-12 card">
        <event-card server="jp"></event-card>
        <event-card server="tw"></event-card>
      </div>

      <div class="col-lg-4 col-xl-4 col-12">
        <gacha-card server="jp"></gacha-card>
        <gacha-card server="tw"></gacha-card>
      </div>

      <div class="col-lg-4 col-xl-4 col-12">
        <q-card>
          <q-card-title class="bg-pink text-white">
            {{$t('info-links')}}
          </q-card-title>
          <!-- <q-card-main> -->
            <q-list :highlight="false">
              <q-list-header>{{$t('info-links')}}</q-list-header>
              <q-list-header>EN</q-list-header>
              <q-item>
                <a href="https://discord.gg/vGb3eHH" target="_blank">
                  <discord-icon style="display: inline-block;" />
                  <span>Discord</span>
                </a>
              </q-item>
              <q-item>
                <a href="https://www.reddit.com/r/BanGDream/" target="_blank">
                  <reddit-icon style="display: inline-block;" />
                  <span>Reddit</span>
                </a>
              </q-item>
              <q-item>
                <a href="https://twitter.com/BandoriD" target="_blank">
                  <twitter-icon style="display: inline-block;" />
                  <span>@BandoriD</span>
                </a>
              </q-item>
              <q-item>
                <a href="https://twitter.com/bandori_updates" target="_blank">
                  <twitter-icon style="display: inline-block;" />
                  <span>@bandori_updates</span>
                </a>
              </q-item>
              <q-list-header>CN</q-list-header>
              <q-item>
                <a href="https://www.bangdream.moe/" target="_blank">
                <img src="https://www.bangdream.moe/favicon.ico" style="height: 24px; width: 24px" />
                  BanG Dream!导航站
                </a>
              </q-item>
              <q-item>
                <a href="https://www.bangdreamwiki.com/" target="_blank">
                <img src="https://www.bangdreamwiki.com/favicon.ico" style="height: 24px; width: 24px" />
                  BanG Dream! WiKi!
                </a>
              </q-item>
              <q-item>
                <a href="http://home.bangdream.space/" target="_blank">
                <img src="https://bangdream.space/favicon.ico" style="height: 24px; width: 24px" />
                  炸帮裂梦乐团Mastodon
                </a>
              </q-item>
              <q-item>
                <a href="https://forum.gamer.com.tw/A.php?bsn=31877" target="_blank">
                <img src="https://forum.gamer.com.tw/favicon.ico" style="height: 24px; width: 24px" />
                  BanG Dream！少女樂團派對 哈啦板 - 巴哈姆特
                </a>
              </q-item>
              <q-item>
                <a href="https://kekeke.cc/bang_dream_gbp" target="_blank">
                <img src="https://kekeke.cc/favicon.ico" style="height: 24px; width: 24px" />
                  bang_dream_gbp/kekeke.cc
                </a>
              </q-item>
              <q-list-header>JP</q-list-header>
              <q-item>
                <a href="https://bang-dream.bushimo.jp/" target="_blank">
                  <img src="https://bang-dream.bushimo.jp/wp-content/themes/bandre2017/assets/images/favicon.ico" style="height: 24px; width: 24px" />
                  Game offcial site
                </a>
              </q-item>
              <q-item>
                <a href="https://twitter.com/bang_dream_gbp" target="_blank">
                  <twitter-icon style="display: inline-block;" />
                  <span>@bang_dream_gbp</span>
                </a>
              </q-item>
              <q-item>
                <a href="https://bang-dream.com/" target="_blank">
                  <img src="https://bang-dream.com/wp/wp-content/themes/bang-dream-1701-2/icon/favicon.ico" style="height: 24px; width: 24px" />
                  Project site
                </a>
              </q-item>
              <q-item>
                <a href="https://twitter.com/bang_dream_info" target="_blank">
                  <twitter-icon style="display: inline-block;" />
                  <span>@bang_dream_info</span>
                </a>
              </q-item>
            </q-list>
          <!-- </q-card-main> -->
        </q-card>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "title": ["Welcome to", "Database!"],
    "info-list": "Infos and links",
    "info-update": "Recent update",
    "info-links": "External links",
    "update": "All news now on <a href='https://dnaroma.site' target='_blank'>my blog</a>. If you don't see updated data, please keep it open for several seconds and then refresh"
  },
  "zh-CN": {
    "title": ["欢迎访问", "数据库!"],
    "info-list": "公告及友链",
    "info-update": "最近更新",
    "info-links": "友情链接",
    "update": "更新资讯均在<a href='https://dnaroma.site' target='_blank'>我的博客</a>。 如果你仍然看到的是旧数据请保持本页打开数秒然后刷新即可。"
  },
  "zh-TW": {
    "title": ["歡迎訪問", "數據庫!"],
    "info-list": "公告及友鏈",
    "info-update": "最近更新",
    "info-links": "友情鏈接",
    "update": "更新資訊均在<a href='https://dnaroma.site' target='_blank'>我的博客</a>。如果你仍然看到的是舊數據請保持本頁打開數秒然後刷新即可。"
  }
}
</i18n>

<script>
import {
  QCard,
  QCardTitle,
  QCardMedia,
  QCardMain,
  QIcon,
  QBtn,
  QList,
  QListHeader,
  QItem,
  QItemSeparator
} from 'quasar'
import eventCard from './common/SimpleEvent'
import gachaCard from './common/SimpleGacha'

import discordIcon from 'icons/discord'
import redditIcon from 'icons/reddit'
import twitterIcon from 'icons/twitter'

export default {
  name: 'HomeView',
  data () {
    return {
      // latestCardid: 0
      log: console.log,
      isGcahaReady: false
    }
  },
  components: {
    QCard,
    QCardTitle,
    QCardMedia,
    QCardMain,
    QIcon,
    QBtn,
    discordIcon,
    QList,
    QListHeader,
    QItem,
    QItemSeparator,
    redditIcon,
    twitterIcon,
    eventCard,
    gachaCard
  }
}
</script>

<style lang="stylus" scoped>
</style>
