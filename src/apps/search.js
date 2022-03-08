/** jsx?|tsx? file header */
import Search from '../components/Search'
import { cached } from '../cache'
import { filterByTitle } from '../utils'

export default function loadSearchApp(showToc = true) {
  const pages = JSON.parse(JSON.stringify(cached.pages))
  Vue.createApp({
    template: `
        <el-input
          class="inline-input search-input"
          v-model="search" placeholder="搜索本文(Alt/Cmd+K 全站搜索)">
          <template #suffix>
            <img class="command-k" src="/assets/img/command.svg"/><span class="command-k">K</span>
          </template>
        </el-input>
        <el-menu v-if="showToc" class="el-toc-menu">
          <el-menu-item-group v-for="(list, month) in pages" :key="month" :title="month">
            <el-menu-item v-for="(page, i) in list" :index="i+''" :key="page.timestamp">
            <span class="date">{{page.date}}</span>
            <span class="title"><a :href="page.url" v-html="page.title"></a></span>
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
        <div id="search"><search/></div>`,

    components: {
      Search
    },
    data() {
      return {
        search: '',
        showToc
      }
    },
    computed: {
      pages() {
        return filterByTitle(this.search, pages)
      }
    }
  })
    .use(ElementPlus)
    .mount(showToc ? '#vue-toc' : '#search')
}
