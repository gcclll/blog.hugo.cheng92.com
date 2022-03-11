/** jsx?|tsx? file header */

import { cached } from '../cache'
import config from '../config'
import { filterByTitle } from '../utils'

const pages = _.cloneDeep(cached.pages)
export default Vue.defineComponent({
  template: `
  <el-tabs v-model="activeName" @tab-click="$emit('change-tab')">
    <el-tab-pane v-for="tab in tabs" :key="tab.value" :label="tab.label" :name="tab.value"/>
  </el-tabs>
  <el-menu class="el-toc-menu">
    <el-menu-item-group v-for="(list, key) in pages" :key="key" :title="key">
      <el-menu-item v-for="(page, i) in list" :index="i+''" :key="page.timestamp">
      <div class="date-title">
        <span class="date">{{page.date}}</span>
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
  emits: ['change-tab'],
  props: {
    searchText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tabs: config.tabs,
      category: {},
      tags: {},
      archives: {},
      activeName: 'archives'
    }
  },
  computed: {
    pages() {
      const tab = _.find(this.tabs, (tab) => tab.value === this.activeName)
      const posts = this[tab.value]
      console.log(tab, posts, '11111')
      return posts ? filterByTitle(this.searchText, posts) : []
    }
  },
  methods: {
    addCategory(cat, post) {
      if (!post) return
      if (this.category[cat] == null) {
        this.category[cat] = []
      }
      this.category[cat].push({ ...post })
    },
    addTagPost(tag, post) {
      if (!post) return
      if (this.tags[tag] == null) {
        this.tags[tag] = []
      }
      this.tags[tag].push({ ...post })
    }
  },
  beforeMount() {
    this.archives = _.cloneDeep(pages)
    const list = _.flatten([..._.values(this.archives)])
    list.forEach((item) => {
      const { category = [], tags = [] } = item || {}
      category.forEach((cat) => this.addCategory(cat, item))
      tags.forEach((tag) => this.addTagPost(tag, item))
    })
  }
})
