<template>
  <div class="abstract-wrapper">
    <NoteAbstractItem
      v-for="(item, idx) in currentPageData"
      :key="item.path"
      :item="item"
      :currentPage="currentPage"
      :currentTag="currentTag" />
  </div>
</template>

<script>
import NoteAbstractItem from './NoteAbstractItem'

export default {
  components: { NoteAbstractItem },
  props: ['data', 'currentPage', 'currentTag', 'pageSize'],
  computed: {
    currentPageData () {
      const start = this.currentPage * this.pageSize - this.pageSize
      const end = this.currentPage * this.pageSize
      return this.data.slice(start, end)
    }
  }
}
</script>

<style lang="stylus" scoped>
.abstract-wrapper
  width 100%
</style>
