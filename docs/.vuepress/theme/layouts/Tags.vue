<template>
  <div class="tags-wrapper" :class="recoShow?'reco-show': 'reco-hide'">
    <Common :sidebar="false" :isComment="false"></Common>
    <!-- 标签集合 -->
    <ModuleTransition>
      <TagList
        v-show="recoShow"
        class="tags"
        :currentTag="currentTag"
        @getCurrentTag="getPagesByTags"
      ></TagList>
    </ModuleTransition>
    <!-- 博客列表 -->
    <ModuleTransition delay="0.08">
      <note-abstract
        class="list"
        :data="posts"
        :currentPage="currentPage"
        :currentTag="currentTag"
        :pageSize="pageSize"
        @currentTag="getCurrentTag"
      ></note-abstract>
    </ModuleTransition>
    <!-- 分页 -->
    <ModuleTransition delay="0.16">
      <pagation
        class="pagation"
        :total="posts.length"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @getCurrentPage="getCurrentPage"
      ></pagation>
    </ModuleTransition>
  </div>
</template>

<script>
import TagList from '@theme/components/TagList.vue'
import Common from '@theme/components/Common.vue'
import NoteAbstract from '../components//NoteAbstract.vue'
import ModuleTransition from '@theme/components/ModuleTransition'
import { filterPosts, sortPostsByStickyAndDate } from '@theme/helpers/postData'

export default {
  components: { Common, NoteAbstract, ModuleTransition, TagList },

  data() {
    return {
      posts: [],
      tags: [],
      currentTag: '全部',
      currentPage: 1,
      pageSize: 5,
      recoShow: false
    }
  },

  created() {
    this.getPagesByTags(this.currentTag)
  },

  mounted() {
    this.recoShow = true
  },

  methods: {
    // 根据分类获取页面数据
    getPagesByTags(currentTag) {
      let posts = []
      if (currentTag === '全部') {
        const _posts = this.$tags.list.reduce((prev, item) => prev.concat(item.posts || item.pages), [])
        posts = filterPosts(_posts)
      } else {
        // posts = this.$tags.map[currentTag].posts
        posts = this.$tags.map[currentTag].posts || this.$tags.map[currentTag].pages
      }
      this.currentTag = currentTag
      // 排序
      sortPostsByStickyAndDate(posts)
      this.posts = posts.length == 0 ? [] : posts
      this.getCurrentPage(this.currentPage);
    },

    getCurrentTag(tag) {
      this.$emit('currentTag', tag)
    },

    getCurrentPage(page) {
      this.currentPage = page
      this.$page.currentPage = page
    },
  }
}
</script>

<style src="../styles/theme.styl" lang="stylus"></style>

<style lang="stylus" scoped>
// @require '../styles/loadMixin.styl'
.tags-wrapper {
  // max-width: 740px;
  max-width: $contentWidth;
  margin: 0 auto;
  padding: 4.6rem 2.5rem 0;

  .tags {
    margin: 30px 0;

    span {
      vertical-align: middle;
      margin: 4px 4px 10px;
      padding: 4px 8px;
      display: inline-block;
      cursor: pointer;
      border-radius: 2px;
      background: #fff;
      color: #fff;
      font-size: 13px;
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      transition: all 0.5s;

      &:hover {
        transform: scale(1.04);
      }

      &.active {
        transform: scale(1.2);
      }
    }
  }

  &.reco-hide {
    .tags, .list, .pagation {
      load-start();
    }
  }

  &.reco-show {
    .tags {
      load-end(0.08s);
    }

    .list {
      load-end(0.16s);
    }

    .pagation {
      load-end(0.24s);
    }
  }
}

@media (max-width: $MQMobile) {
  .tags-wrapper {
    padding: 5rem 0.6rem 0;
  }
}
</style>