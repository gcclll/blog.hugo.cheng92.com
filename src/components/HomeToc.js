/** jsx?|tsx? file header */

import config from '../config'

export default Vue.defineComponent({
  template: `
<el-menu active-text-color="#c05b4d" class="el-head-menu"  mode="horizontal" :default-active="activeIndex" @select="handleSelect">
  <el-menu-item index="1">时间戳</el-menu-item>
  <el-menu-item index="2">分类</el-menu-item>
</el-menu>
  <el-menu class="el-toc-menu" v-if="activeIndex===types.TYPE_ARCHIVES">
    <el-menu-item-group v-if="listType===types.TYPE_ARCHIVES" v-for="(list, month) in listData" :key="month" :title="month">
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
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key
      console.log({ key, keyPath })
    }
  },
  beforeMount() {
    console.log(this.listData, '111')
  },
  data() {
    return { types: config.enum, activeIndex: config.enum.TYPE_ARCHIVES }
  }
})
