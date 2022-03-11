/** jsx?|tsx? file header */

import { cached } from '../cache'
import config from '../config'
import { filterByTitle } from '../utils'

const pages = _.cloneDeep(cached.pages)

const GlMenuItem = Vue.defineComponent({
  template: `
    <el-menu-item v-for="(page, i) in list" :index="i+''" :key="page.timestamp">
      <div class="date-title">
        <span class="date">{{page.date}}</span>
        <span class="title">
          <a :href="page.url" v-html="page.title"></a>
        </span>
      </div>
      <div class="tags">
        <el-tag  size="small" v-for="cat in page.category" :key="cat" type="success" @click="$emit('addTab', cat)">{{cat}}</el-tag>
        <el-tag size="small" v-for="tag in page.tags" :key="tag">{{tag}}</el-tag>
      </div>
    </el-menu-item>`,
  emits: ['addTab'],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }
})

export default Vue.defineComponent({
  template: `
  <el-tabs v-model="activeName" @tab-click="$emit('change-tab')" @tab-remove="removeTab">
    <el-tab-pane v-for="( tab, i ) in tabs" :key="i" :name="tab.value" :closable="tab.isSub">
      <template #label>
        <div :class="{'tab-label':true,'is-sub':tab.isSub}">
          <el-icon v-if="tab.Icon"><component :is="tab.Icon"/></el-icon>
          <span style="padding-left:4px">{{tab.label}}</span>
        </div>
      </template>
      <el-menu class="el-toc-menu">
        <template v-for="(list, key) in pages" :key="key">
          <gl-menu-item v-if="tab.isSub" :list="list" @add-tab="addTab"/>
          <el-menu-item-group v-else :title="key">
            <gl-menu-item :list="list" @add-tab="addTab"/>
          </el-menu-item-group>
        </template>
      </el-menu>
    </el-tab-pane>
  </el-tabs>
  `,
  components: {
    GlMenuItem
  },
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
      activeName: 'archives',
      cached: {}
    }
  },
  computed: {
    pages() {
      const tab = _.find(this.tabs, (tab) => tab.value === this.activeName)
      if (!tab || !tab.list) return []
      return filterByTitle(this.searchText, tab.list)
    }
  },
  methods: {
    removeTab(name) {
      const index = _.findIndex(this.tabs, (tab) => tab.value === name)
      if (index > -1) {
        const target = this.tabs[index]
        if (this.cached[target.name] == null) {
          this.cached[target.name] = target
        }
        const nextTab = this.tabs[index + 1] || this.tabs[index - 1]
        if (nextTab) {
          this.activeName = nextTab.value
        }

        this.tabs = this.tabs.filter((tab) => tab.value !== name)
      }
    },
    // 添加子分类标签
    addTab(name) {
      const existed = _.find(this.tabs, (tab) => tab.value === name)
      if (existed == null) {
        const cached = this.cached[name]
        if (cached) {
          this.tabs.push(cached)
        } else {
          // 大分类
          const category =
            _.find(this.tabs, (tab) => tab.value === 'category') || {}
          this.tabs.push({
            label: name.toUpperCase(),
            value: name,
            Icon: config.Icons[name],
            Close: config.Icons.Close,
            isSub: true, // 标识分子分类
            list: { [name]: category.list[name] || [] }
          })
        }
      }
      this.activeName = name
    }
  },
  beforeMount() {
    const list = _.flatten([..._.values(pages)])
    this.tabs.forEach((tab) => {
      switch (tab.value) {
        case 'archives':
          tab.list = pages
          break
        case 'category':
          tab.list = filterOutPages(list)
          break
        case 'tags':
          tab.list = filterOutPages(list, 'tag')
          break
      }
    })
  }
})

function filterOutPages(list = [], type = 'category') {
  return list.reduce((result, curr) => {
    if (curr) {
      const { category = [], tags = [] } = curr
      const target = type === 'category' ? category : tags
      target.forEach((key) => {
        if (result[key] == null) {
          result[key] = []
        }
        result[key].push({ ...curr })
      })
    }

    return result
  }, {})
}
