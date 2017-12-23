<template>
  <q-modal ref="modal" :content-css="{maxWidth: '800px', padding: '10px'}">
    <h4 class="uppercase">{{$t('title')}} <small>0.4.5</small></h4>
    <p>{{$t('subtitle')}}</p>
    <h5 class="uppercase">{{$t('features')}}</h5>
    <ul>
      <li>{{$t('feature-detail[0]')}}</li>
      <li>{{$t('feature-detail[1]')}}</li>
      <li>{{$t('feature-detail[2]')}}</li>
      <li>{{$t('feature-detail[3]')}}</li>
      <li>{{$t('feature-detail[4]')}}</li>
      <li>{{$t('feature-detail[5]')}}</li>
      <li>{{$t('feature-detail[6]')}}</li>
      <li>{{$t('feature-detail[7]')}}</li>
    </ul>
    <h5 class="uppercase">{{$t('bugs')}}</h5>
    <ul>
      <li>{{$t('bug-detail[0]')}}</li>
      <li>{{$t('bug-detail[1]')}}</li>
      <li>{{$t('bug-detail[2]')}}</li>
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
      "This update note will show in every new version from now",
      "Settings move to the right top menu",
      "Add music chart viewer (beta) in Music detail page",
      "Click event image on Home page can jump to Event Detail page",
      "Add filter option to Music page",
      "Add sort option to Card and Music page",
      "More friendly filter and sort design",
      "Save and auto load the filter and sort option setting"
    ],
    "bugs": "Fixed bugs",
    "bug-detail": [
      "Fix a problem that caused skill filter unusable",
      "Fix a style issue causing the Home page not displaying right on mobile phone",
      "Always fetch fresh data first rather than show old data first and update in the background"
    ],
    "welcome-bug-report": "If you find any problem affecting you use this web app, please report it to me per <a href='mailto:dev@bangdream.ga'>Email</a>, on <a href='https://dnaroma.site/2017/12/23/bug-report/'>Bug report page</a> or on <a href='https://discord.gg/vGb3eHH'>Discord</a>."
  },
  "zh-cn": {
    "title": "更新说明",
    "subtitle": "Bandori Database WebApp 版本已经更新，一些问题得到解决，一些新的特性被引入。",
    "features": "新特性",
    "feature-detail": [
      "往后的每次版本更新都会出现这个更新说明",
      "设置页面移动到右上角的菜单来激活",
      "在音乐详情界面可以访问音乐谱面查看器(Beta)",
      "点击首页的活动图标可以跳转到活动详情页面",
      "为音乐界面增加了过滤选项",
      "为卡片和音乐节目都增加了排序选项",
      "重新设计的过滤器，界面更加友好",
      "可以保存和自动加载之前的过滤设置"
    ],
    "bugs": "修复的问题",
    "bug-detail": [
      "修正了一个导致技能过滤不可用的问题",
      "修正了首页在移动设备显示不正确的样式问题",
      "总是先加载最新的数据，而不是先显示旧数据并在后台更新新的数据"
    ],
    "welcome-bug-report": "如果你在使用本网站的过程中遇到任何问题, 欢迎通过<a href='mailto:dev@bangdream.ga'>Email</a>, <a href='https://dnaroma.site/2017/12/23/bug-report/'>问题反馈页面</a>或者<a href='https://discord.gg/vGb3eHH'>Discord</a>向我反馈问题。"
  },
  "zh-tw": {
    "title": "更新說明",
    "subtitle": "Bandori Database WebApp 版本已經更新，壹些問題得到解決，壹些新的特性被引入。",
    "features": "新特性",
    "feature-detail": [
      "往後的每次版本更新都會出現這個更新說明",
      "設置頁面移動到右上角的菜單來激活",
      "在音樂詳情界面可以訪問音樂譜面查看器(Beta)",
      "點擊首頁的活動圖標可以跳轉到活動詳情頁面",
      "為音樂界面增加了過濾選項",
      "為卡片和音樂節目都增加了排序選項",
      "重新設計的過濾器，界面更加友好",
      "可以保存和自動加載之前的過濾設置"
    ],
    "bugs": "修復的問題",
    "bug-detail": [
      "修正了壹個導致技能過濾不可用的問題",
      "修正了首頁在移動設備顯示不正確的樣式問題",
      "總是先加載最新的數據，而不是先顯示舊數據並在後臺更新新的數據"
    ],
    "welcome-bug-report": "如果妳在使用本網站的過程中遇到任何問題, 歡迎通過<a href='mailto:dev@bangdream.ga'>Email</a>, <a href='https://dnaroma.site/2017/12/23/bug-report/'>問題反饋頁面</a>或者<a href='https://discord.gg/vGb3eHH'>Discord</a>向我反饋問題。"
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
