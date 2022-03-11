/** jsx?|tsx? file header */

import config from '../config'

export default Vue.defineComponent({
  template: `
<el-menu active-text-color="#c05b4d" class="el-head-menu"  mode="horizontal" :default-active="activeIndex" @select="handleSelect">
  <el-menu-item index="1">时间戳</el-menu-item>
  <el-menu-item index="2">分类</el-menu-item>
  <el-menu-item index="3">标签</el-menu-item>
</el-menu>
  <el-menu class="el-toc-menu">
    <el-menu-item-group v-for="(list, key) in menuList" :key="key" :title="key">
      <el-menu-item v-for="(page, i) in list" :index="i+''" :key="page.timestamp">
      <div class="date-title">
        <span class="date" v-if="activeIndex===types.TYPE_ARCHIVES">{{page.date}}</span>
        <span class="title">
          <a :href="page.url" v-html="page.title"></a>
        </span>
      </div>
      <div class="tags">
        <el-tag size="small" v-for="cat in page.category" :key="cat" type="success">{{cat}}</el-tag>
        <el-tag size="small" v-for="tag in page.tags" :key="tag">{{tag}}</el-tag>
      </div>
      </el-menu-item>
    </el-menu-item-group>
  </el-menu>`,
  props: {
    listData: {
      type: Object,
      default: () => {}
    },
    listType: {
      type: String,
      default: config.enum.TYPE_ARCHIVES // category
    }
  },
  computed: {
    menuList() {
      switch (this.activeIndex) {
        case config.enum.TYPE_ARCHIVES:
          return this.listData
        case config.enum.TYPE_CATEGORY:
          return this.archives
        case config.enum.TYPE_TAG:
          return this.tagPosts
      }
      return []
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key
      console.log({ key, keyPath })
    },
    addArchive(cat, post) {
      if (!post) return
      if (this.archives[cat] == null) {
        this.archives[cat] = []
      }
      this.archives[cat].push({ ...post })
    },
    addTagPost(tag, post) {
      if (!post) return
      if (this.tagPosts[tag] == null) {
        this.tagPosts[tag] = []
      }
      this.tagPosts[tag].push({ ...post })
    }
  },
  beforeMount() {
    const list = _.flatten([..._.values(this.listData)])
    list.forEach((item) => {
      const { category = [], tags = [] } = item || {}
      category.forEach((cat) => this.addArchive(cat, item))
      tags.forEach((tag) => this.addTagPost(tag, item))
    })
  },
  data() {
    return {
      types: config.enum,
      activeIndex: config.enum.TYPE_ARCHIVES,
      archives: {},
      tagPosts: {}
    }
  }
})
