/** jsx?|tsx? file header */

import { cached } from '../cache'
import config from '../config'
import { filterByTitle, formatByDate, sortFn } from '../utils'

const pages = _.cloneDeep(cached.pages)
const sortByDate = (a, b, prop = 'key') => new Date(b[prop]) - new Date(a[prop])

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
        <el-tag size="small" v-for="tag in page.tags" :key="tag" @click="$emit('addTab', tag, true)">{{tag}}</el-tag>
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
        <el-menu-item-group v-for="({ key, value }) in pages" :title="key">
          <gl-menu-item :list="value" @add-tab="addTab"/>
        </el-menu-item-group>
      </el-menu>
    </el-tab-pane>
  </el-tabs>
  <el-divider class="gl-tag-divider" content-position="left">分类和标签</el-divider>
  <el-card class="gl-tag-card">
    <template v-for="( n, name ) in tags.c">
      <el-badge :value="n">
        <el-tag
          size="small"
          type="success"
          @click="addTab(name)"
        >{{name}}</el-tag>
      </el-badge>
    </template>
    <template v-for="( n, name ) in tags.t">
      <el-badge :value="n">
        <el-tag
          size="small"
          @click="addTab(name, true)"
        >{{name}}</el-tag>
      </el-badge>
    </template>
  </el-card>
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
      cached: {},
      tags: {
        c: {}, // cat
        t: {} // tags
      } // 所有 tag
    }
  },
  computed: {
    pages() {
      const tab = _.find(this.tabs, (tab) => tab.value === this.activeName)
      if (!tab || !tab.list) return []
      const result = filterByTitle(this.searchText, tab.list)
      console.log(result, 2000)
      const sorted = Object.keys(result)
        .map((key) => ({
          key,
          value: result[key]
        }))
        .sort(sortByDate)
      return sorted
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
    addTab(maybeTag, isTag) {
      let [name, tagValue] = maybeTag.split(':')
      if (tagValue) {
        name = tagValue
      }

      const existed = _.find(this.tabs, (tab) => tab.value === name)
      if (existed == null) {
        const cached = this.cached[maybeTag]
        if (cached) {
          this.tabs.push(cached)
        } else {
          const valueName = isTag ? 'tags' : 'category'
          // 大分类
          const target =
            _.find(this.tabs, (tab) => tab.value === valueName) || {}
          this.tabs.push({
            label: maybeTag.toUpperCase(),
            value: name,
            Icon: config.Icons[name],
            Close: config.Icons.Close,
            isTag,
            isSub: true, // 标识分子分类
            list: formatByDate(target.list[name])
          })
        }
      }
      this.activeName = name

      if (window.scrolltotop) {
        window.scrolltotop.scrollup()
      }
    }
  },
  beforeMount() {
    const list = _.flatten([..._.values(pages)])

    const t = this.tags.t
    const c = this.tags.c

    list.forEach((item) => {
      const { tags = [], category = [] } = item

      tags.forEach((tag) => {
        if (t[tag] == null) {
          t[tag] = 1
        } else {
          t[tag]++
        }
      })

      category.forEach((cat) => {
        if (c[cat] == null) {
          c[cat] = 1
        } else {
          c[cat]++
        }
      })
    })

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
  const _result = list.reduce((result, curr) => {
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

  Object.keys(_result).forEach((key) => {
    _result[key].sort(sortFn)
  })

  console.log(_result, 6000)
  return _result
}
