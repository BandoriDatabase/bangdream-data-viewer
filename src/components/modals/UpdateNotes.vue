<template>
  <q-modal ref="modal" :content-css="{maxWidth: '800px', padding: '10px'}">
    <h4 class="uppercase">{{$t('title')}} <small>0.4.10</small></h4>
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
      <li>{{$t('bug-detail[1]')}}</li>
      <li>{{$t('bug-detail[2]')}}</li>
      <li>{{$t('bug-detail[3]')}}</li>
      <li>{{$t('bug-detail[4]')}}</li>
      <li>{{$t('bug-detail[5]')}}</li>
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
      "(0.4.9)A button is added to sidebar so that you can view this Update Note again",
      "(0.4.9)Slide note is drawn in Beatmap Viewer",
      "(0.4.9)Add difficulty info on Music List page and on Beatmap Viewer page",
      "(0.4.9)Sorting by music difficulty is supported",
      "(0.4.9)Language won't change until you click the CONFIRM button"
    ],
    "bugs": "Fixed bugs",
    "bug-detail": [
      "Fix: Empty gacha banner image",
      "Fix: Empty character and card image of TW server lunar new year card",
      "(0.4.9)Fix: No scrollbar visible if you click/touch card thumb and jump to card detail page",
      "(0.4.9)Fix: Multiple BGM played while playing some beatmaps",
      "(0.4.9)Fix: Missing translation text for Story Viewer page",
      "(0.4.9)Fix: TW event detail display error"
    ],
    "welcome-bug-report": "If you find any problem affecting you use this web app, please report it to me per <a href='mailto:dev@bangdream.ga'>Email</a>, on <a href='https://dnaroma.site/2017/12/23/bug-report/'>Bug report page</a> or on <a href='https://discord.gg/vGb3eHH'>Discord</a>."
  },
  "zh-cn": {
    "title": "更新说明",
    "subtitle": "Bandori Database WebApp 版本已经更新，一些问题得到解决，一些新的特性被引入。",
    "features": "新特性",
    "feature-detail": [
      "(0.4.9)在侧边栏加了一个按钮以便再次查看本说明",
      "(0.4.9)谱面查看器可以绘制Slide（滑条）了",
      "(0.4.9)音乐相关页面均加上了歌曲难度信息",
      "(0.4.9)支持按照难度排序歌曲",
      "(0.4.9)在点击确认按钮前不会保存对界面语言的修改"
    ],
    "bugs": "修复的问题",
    "bug-detail": [
      "修正了某些抽卡的Banner图片无法显示的问题",
      "修正了台服新年卡牌无法正确显示图像的问题",
      "(0.4.9)修正了在抽卡详情里点击卡片头像跳转至详情后滚动条消失的问题",
      "(0.4.9)修正了某些谱面会出现重复播放背景音乐的问题",
      "(0.4.9)修正了故事查看页翻译文本的缺失",
      "(0.4.9)修正了台服活动详情显示上的错误"
    ],
    "welcome-bug-report": "如果你在使用本网站的过程中遇到任何问题, 欢迎通过<a href='mailto:dev@bangdream.ga'>Email</a>, <a href='https://dnaroma.site/2017/12/23/bug-report/'>问题反馈页面</a>或者<a href='https://discord.gg/vGb3eHH'>Discord</a>向我反馈问题。"
  },
  "zh-tw": {
    "title": "更新說明",
    "subtitle": "Bandori Database WebApp 版本已經更新，一些問題得到解決，一些新的特性被引入。",
    "features": "新特性",
    "feature-detail": [
      "(0.4.9)在側邊欄加了壹個按鈕以便再次查看本說明",
      "(0.4.9)譜面查看器可以繪制Slide（滑條）了",
      "(0.4.9)音樂相關頁面均加上了歌曲難度信息",
      "(0.4.9)支持按照難度排序歌曲",
      "(0.4.9)在點擊確認按鈕前不會保存對界面語言的修改"
    ],
    "bugs": "修復的問題",
    "bug-detail": [
      "修正了某些抽卡的Banner圖片無法顯示的問題",
      "修正了臺服新年卡牌無法正確顯示圖像的問題",
      "(0.4.9)修正了在抽卡詳情裏點擊卡片頭像跳轉至詳情後滾動條消失的問題",
      "(0.4.9)修正了某些譜面會出現重復播放背景音樂的問題",
      "(0.4.9)修正了故事查看頁翻譯文本的缺失",
      "(0.4.9)修正了臺服活動詳情顯示上的錯誤"
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
