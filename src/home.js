/** jsx?|tsx? file header */

import { noop } from './utils'
import config from './config'
import { cached } from './cache'
import Search from './components/Search'

export default function home(handleNotHome = noop) {
  // 是不是主页 home.html
  if (!config.isHome) {
    return handleNotHome()
  }
  $('#table-of-contents').hide()

  setTimeout(() => {
    $('#content').append($('#postamble'))
    $('#postamble').css({
      position: 'relative',
      marginTop: '1rem'
    })
    $('#postamble').show()
    $('#content').css({
      margin: 'auto'
    })
    $('#postamble').css({
      width: '100%',
      textAlign: 'center'
    })
  }, 500)

  // 收集所有标题(id包含 'outline-container-' 且以它开头的 div)
  // $(config.searchTmpl).insertAfter('h1.title')
  $(`<div id="vue-toc"></div>`).insertAfter('h1.title')
  $(config.tocSelector).remove()

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
        <el-menu clas="el-toc-menu">
          <el-menu-item-group v-for="(list, month) in pages" :key="month" :title="month">
            <el-menu-item v-for="(page, i) in list" :index="i+''" :key="page.timestamp">
            <span class="date">{{page.date}}</span>
            <span class="title"><a :href="page.file" v-html="page.title"></a></span>
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
        <search id="search"/>`,
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
        const result = {}
        for (let prop in pages) {
          const pageList = pages[prop]
          if (result[prop] == null) {
            result[prop] = []
          }
          const queryList = this.search.toLowerCase().split(' ')
          result[prop] =
            queryList.length > 0
              ? pageList
                  .map((page) => {
                    if (
                      page &&
                      queryList.every(
                        (q) => page.title.toLowerCase().indexOf(q) > -1
                      )
                    )
                      queryList.forEach((q) => {
                        const text = $(`<span>${page.title}</span>`).text()
                        if ((text, q)) {
                          page.title = text.replace(
                            new RegExp(`(${q})`, 'ig'),
                            `<span class="hl-word">$1</span>`
                          )
                        }
                        console.log({ q, t: page.title, text }, 111)
                      })
                    return { ...page }
                  })
                  .filter(Boolean)
              : pageList
        }
        return result
      }
    }
  })
    .use(ElementPlus)
    .mount('#vue-toc')
}
