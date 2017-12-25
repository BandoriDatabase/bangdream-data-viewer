<template>
  <q-modal ref="modal" :content-css="{maxWidth: '800px', padding: '10px'}">
    <h4 class="uppercase">{{$t('title')}} <small>0.4.8</small></h4>
    <p>{{$t('subtitle')}}</p>
    <h5 class="uppercase">{{$t('features')}}</h5>
    <ul>
      <li>{{$t('feature-detail[0]')}}</li>
      <li>{{$t('feature-detail[1]')}}</li>
      <li>{{$t('feature-detail[2]')}}</li>
      <li>{{$t('feature-detail[3]')}}</li>
      <li>{{$t('feature-detail[4]')}}</li>
      <!-- <li>{{$t('feature-detail[5]')}}</li>
      <li>{{$t('feature-detail[6]')}}</li>
      <li>{{$t('feature-detail[7]')}}</li> -->
    </ul>
    <h5 class="uppercase">{{$t('bugs')}}</h5>
    <ul>
      <li>{{$t('bug-detail[0]')}}</li>
      <!-- <li>{{$t('bug-detail[1]')}}</li>
      <li>{{$t('bug-detail[2]')}}</li> -->
    </ul>
    <p v-html="$t('welcome-bug-report')"></p>
    <div class="action-buttons">
      <q-btn color="pink" @click="$refs.modal.close()">Close</q-btn>
    </div>
  </q-modal>
</template>

<i18n>
{
  "en": {
    "title": "What's new",
    "subtitle": "Bandori Database WebApp has been updated, some new features are introduced and some bugs are fixed.",
    "features": "New features",
    "feature-detail": [
      "Live2D Viewer comes back, please click HOW TO USE button for instruction",
      "Click trained card image will directly jump to the after-training card detail",
      "Card detail page url has a part for featuring the card training state, you can share the link for the trained card now",
      "Card story episodes can be read now, click the button next to the episode name to preview",
      "Display card story read reward"
    ],
    "bugs": "Fixed bugs",
    "bug-detail": [
      "Fix the flick sound offset in the music chart viewer"
    ],
    "welcome-bug-report": "If you find any problem affecting you use this web app, please report it to me per <a href='mailto:dev@bangdream.ga'>Email</a>, on <a href='https://dnaroma.site/2017/12/23/bug-report/'>Bug report page</a> or on <a href='https://discord.gg/vGb3eHH'>Discord</a>."
  },
  "zh-cn": {
    "title": "更新说明",
    "subtitle": "Bandori Database WebApp 版本已经更新，一些问题得到解决，一些新的特性被引入。",
    "features": "新特性",
    "feature-detail": [
      "Live2D查看器回归，点击页面内的 如何使用 按钮查看帮助",
      "点击特训后的卡牌图片可以直接跳转到训练过的卡牌详情页",
      "卡牌详情页的地址里现在会附带卡牌特训信息，现在可以直接分享特训后的卡牌链接",
      "增加了卡牌故事浏览器，点击卡牌故事名称旁边的按钮来浏览",
      "展示卡牌故事阅读奖励"
    ],
    "bugs": "修复的问题",
    "bug-detail": [
      "Flick（滑动）音效延后的问题已经修正"
    ],
    "welcome-bug-report": "如果你在使用本网站的过程中遇到任何问题, 欢迎通过<a href='mailto:dev@bangdream.ga'>Email</a>, <a href='https://dnaroma.site/2017/12/23/bug-report/'>问题反馈页面</a>或者<a href='https://discord.gg/vGb3eHH'>Discord</a>向我反馈问题。"
  },
  "zh-tw": {
    "title": "更新說明",
    "subtitle": "Bandori Database WebApp 版本已經更新，一些問題得到解決，一些新的特性被引入。",
    "features": "新特性",
    "feature-detail": [
      "Live2D查看器回歸，點擊頁面內的 如何使用 按鈕查看幫助",
      "點擊特訓後的卡牌圖片可以直接跳轉到訓練過的卡牌詳情頁",
      "卡牌詳情頁的地址裏現在會附帶卡牌特訓信息，現在可以直接分享特訓後的卡牌鏈接",
      "增加了卡牌故事瀏覽器，點擊卡牌故事名稱旁邊的按鈕來瀏覽",
      "展示卡牌故事閱讀獎勵"
    ],
    "bugs": "修復的問題",
    "bug-detail": [
      "Flick（滑動）音效延後的問題已經修正"
    ],
    "welcome-bug-report": "如果妳在使用本網站的過程中遇到任何問題, 歡迎透過<a href='mailto:dev@bangdream.ga'>Email</a>, <a href='https://dnaroma.site/2017/12/23/bug-report/'>問題反饋頁面</a>或者<a href='https://discord.gg/vGb3eHH'>Discord</a>向我反饋問題。"
  }
}
</i18n>

<script>
import {
  QModal,
  QBtn
} from 'quasar'

export default {
  name: 'update-note-component',
  components: {
    QModal,
    QBtn
  }
}
</script>

<style lang="stylus" scoped>

</style>
