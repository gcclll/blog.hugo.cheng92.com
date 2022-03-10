/** jsx?|tsx? file header */

import config from '../config'

export default Vue.defineComponent({
  template: `
<el-menu class="el-head-menu"  mode="horizontal">
<el-menu-item>时间戳</el-menu-item>
<el-menu-item>分类</el-menu-item>
</el-menu>
  <el-menu class="el-toc-menu">
    <el-menu-item-group v-if="listType===types.TYPE_ARCHIVES" v-for="(list, month) in listData" :key="month" :title="month">
      <el-menu-item v-for="(page, i) in list" :index="i+''" :key="page.timestamp">
      <span class="date">{{page.date}}</span>
      <span class="title">
        <a :href="page.url" v-html="page.title"></a>
      </span>
      <div/>
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
      type: Number,
      default: config.enum.TYPE_ARCHIVES // category
    }
  },
  beforeMount() {
    console.log(this.listData, '111')
  },
  data() {
    return { types: config.enum }
  }
})
