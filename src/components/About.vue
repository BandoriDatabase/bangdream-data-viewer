<template>
  <div>
    <h3>{{$t('title')}}</h3>
    <h5>{{$t('paras[0].title')}}</h5>
    <p v-html="$t('paras[0].contents[0]')"></p>
    <h5>{{$t('paras[1].title')}}</h5>
    <p v-html="$t('paras[1].contents[0]')"></p>
    <h5>{{$t('paras[2].title')}}</h5>
    <p v-html="$t('paras[2].contents[0]')"></p>
    <p v-html="$t('paras[2].contents[1]')"></p>
    <div>
      <p>中国大陆用户</p>
      <a href="http://www.dashangcloud.com/sh/87935c" target="_system">
        <img src="~assets/alipay_logo.png" alt="Alipay" width="100">
        <img src="~assets/wxpay_logo.png" alt="Wxpay">
      </a>
    </div>
    <div>
      <p>Internaltional user please support me on:</p>
      <a href="https://www.paypal.com/paypalme/PeiTang/0.99" target="_system">
        <img src="~assets/pp_logo_small.png" alt="Paypal">
      </a>
    </div>
    <p v-html="$t('paras[2].contents[2]')"></p>
  </div>
</template>

<i18n>
{
  "en": {
    "title": "Help and support us",
    "paras": [{
      "title": "Development",
      "contents": [
        "Bandori Database is a open source project (without game data), you can visit our <a href='https://github.com/BandoriDatabase/bangdream-data-viewer'>repo</a>, open a issue or create your pull request. Your collaboration is highly appreciated!"
      ]
    }, {
      "title": "Translation",
      "contents": [
        "Any translation for new language and any translation improvement are welcomed. You can send your translation through <a href=''>email</a> (currently unavaliable) or open a issue on the <a href='https://github.com/BandoriDatabase/bangdream-data-viewer'>repo</a>."
      ]
    }, {
      "title": "Donation",
      "contents": [
        "Developing and hosting this site cost a few. If you think this site is useful, you can offer support to help continue the development work.",
        "Choose one of those method to support:",
        "Your support will push us to make this site always better!"
      ]
    }]
  },
  "zh-CN": {
    "title": "帮助和支持我们",
    "paras": [{
      "title": "开发",
      "contents": [
        "Bandori 数据库是一个开源项目(不包括游戏数据)，您可以访问我们的<a href='https://github.com/BandoriDatabase/bangdream-data-viewer'>代码仓库</a>，提出一个Issue或者提交一个Pull request。您的贡献是对我们最大的帮助！"
      ]
    }, {
      "title": "翻译",
      "contents": [
        "我们欢迎任何新语言的翻译或者对于现有翻译的改进，您可以把您的翻译发送到<a href=''>Email</a>（还没做好）或者在<a href='https://github.com/BandoriDatabase/bangdream-data-viewer'>代码仓库</a>里开一个Issue。"
      ]
    }, {
      "title": "捐赠",
      "contents": [
        "开发和维护这个网站有很小的花费。如果您认为这个网站对您有帮助，您可以考虑提供小小的支持来帮助开发者把网站做得更好。",
        "您可以通过以下方式支持我：",
        "您的帮助会让我们不断把网站做得更好！"
      ]
    }]
  },
  "zh-TW": {
    "title": "幫助和支持我們",
    "paras": [{
      "title": "開發",
      "contents": [
        "Bandori 數據庫是一個開源項目(不包括遊戲數據)，您可以訪問我們的<a href='https://github.com/BandoriDatabase/bangdream-data-viewer'>代碼倉庫</a>，提出一個Issue或者提交一個Pull request。您的貢獻是對我們最大的幫助！"
      ]
    }, {
      "title": "翻譯",
      "contents": [
        "我們歡迎任何新語言的翻譯或者對於現有翻譯的改進，您可以把您的翻譯發送到<a href=''>Email</a>（還沒做好）或者在<a href='https ://github.com/BandoriDatabase/bangdream-data-viewer'>代碼倉庫</a>裡開一個Issue。"
      ]
    }, {
      "title": "捐贈",
      "contents": [
        "開發和維護這個網站有很小的花費。如果您認為這個網站對您有幫助，您可以考慮提供小小的支持來幫助開發者把網站做得更好。",
        "您可以通過以下方式支持我：",
        "您的幫助會讓我們不斷把網站做得更好！"
      ]
    }]
  }
}
</i18n>

<script>
export default {
  name: 'about'
}
</script>

<style lang="stylus">

</style>
