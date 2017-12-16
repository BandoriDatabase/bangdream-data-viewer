<template>
  <div class="row">
    <p class="lt-md">{{$t('scroll-hint')}}</p>
    <event class="col-12 col-md-6" server="jp"></event>
    <event class="col-12 col-md-6" server="tw"></event>
  </div>
</template>

<i18n>
{
  "en": {
    "scroll-hint": "Scroll down for TW event"
  },
  "zh-cn": {
    "scroll-hint": "台服活动向下滑可见"
  },
  "zh-tw": {
    "scroll-hint": "台服活動向下滑可見"
  },
  "ja": {
    "scroll-hint": "台湾サーバーイベントのためにスクロールダウン"
  }
}
</i18n>

<script>
import Event from './common/Event'

export default {
  name: 'EventInfo',
  components: {
    Event
  }
}
</script>

<style lang="stylus">
.event-cover
  width: 100%
  height: 501px
  background-size: auto 100%, 100% 100%
  background-repeat: no-repeat
  background-position: center, center

.thumb
  width 48px
  height 48px
  margin-right 10px

.badge
  width 96px
  height 96px

.card-small
  cursor pointer
  margin 10px 0

.event-degree
  width 230px
  height 50px
  background-repeat no-repeat

</style>
