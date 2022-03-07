/** jsx?|tsx? file header */

import { noop, filterByTitle } from './utils'
import config from './config'
import { cached } from './cache'
import Search from './components/Search'

export default function home(handleNotHome = noop) {
  // 是不是主页 home.html
  if (!config.isHome) {
    return handleNotHome()
  }

  setTimeout(() => {
    $('#content').append($('#postamble'))
    $('#postamble').css({
      position: 'relative',
      marginTop: '1rem'
    })
    $('#postamble').show()
    $('#postamble').css({
      width: '100%',
      textAlign: 'center'
    })
  }, 500)

  // 收集所有标题(id包含 'outline-container-' 且以它开头的 div)
  // $(config.searchTmpl).insertAfter('h1.title')
  $(`<div id="vue-toc"></div>`).insertAfter('h1.title')

  const pages = JSON.parse(JSON.stringify(cached.pages))
  Vue.createApp({
    template: `
        <el-input
          class="inline-input search-input"
          v-model="search" placeholder="请输入标题搜索">
          <template #suffix>
            <img class="command-k" src="/assets/img/command.svg"/><span class="command-k">K</span>
          </template>
        </el-input>
        <el-menu class="el-toc-menu">
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
        search: ''
      }
    },
    computed: {
      pages() {
        return filterByTitle(this.search, pages)
      }
    }
  })
    .use(ElementPlus)
    .mount('#vue-toc')
}
