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
        "Bandori Database is a open source project (without game data), you can visit our <a href='https://github.com/tangpei506/bangdream-data-viewer'>repo</a>, open a issue or create your pull request. Your collaboration is highly appreciated!"
      ]
    }, {
      "title": "Translation",
      "contents": [
        "Any translation for new language and any translation improvement are welcomed. You can send your translation through <a href=''>email</a> (currently unavaliable) or open a issue on the <a href='https://github.com/tangpei506/bangdream-data-viewer'>repo</a>."
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
        "Bandori 数据库是一个开源项目(不包括游戏数据)，您可以访问我们的<a href='https://github.com/tangpei506/bangdream-data-viewer'>代码仓库</a>，提出一个Issue或者提交一个Pull request。您的贡献是对我们最大的帮助！"
      ]
    }, {
      "title": "翻译",
      "contents": [
        "我们欢迎任何新语言的翻译或者对于现有翻译的改进，您可以把您的翻译发送到<a href=''>Email</a>（还没做好）或者在<a href='https://github.com/tangpei506/bangdream-data-viewer'>代码仓库</a>里开一个Issue。"
      ]
    }, {
      "title": "捐赠",
      "contents": [
        "开发和维护这个网站有很小的花费。如果您认为这个网站对您有帮助，您可以考虑提供小小的支持来帮助开发者把网站做得更好。",
        "您可以通过以下方式支持我：",
        "您的帮助会让我们不断把网站做得更好！"
      ]
    }]
  }
}
</i18n>

<script>
export default {
  name: 'donate'
}
</script>

<style lang="stylus">

</style>
