<template>
  <div class="footer">
    <p v-if="config.footerConf.record">
      <span
        class="left"
      >{{ config.footerConf.leftText || 'MIT Licensed | Copyright © '+ year +'-present ' + config.author }}</span>
      <span class="record">
        <b>备案号：</b>
        <a class="record-link" :href="config.footerConf.recordLink">{{ config.footerConf.record }}</a>
      </span>
    </p>
    <p v-else>{{ data.footer }}</p>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    year() {
      return new Date().getFullYear();
    },
    data() {
      return this.$frontmatter;
    },
    config() {
      // console.log(this.$frontmatter, 'this.$frontmatter')
      return this.$themeConfig
    },
  }
}
</script>

<style lang="stylus">
// @require '../styles/loadMixin.styl';
@require '../styles/footer.styl';
</style>
