/** jsx?|tsx? file header */

import { noop } from './utils'
import config from './config'

export default function home(handleNotHome = noop) {
  // 是不是主页 home.html
  const isHome = /home\.html$/.test(location.pathname)
  if (!isHome) {
    return handleNotHome()
  }
  $('#table-of-contents').hide()
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

  // 收集所有标题(id包含 'outline-container-' 且以它开头的 div)
  $(config.searchTmpl).insertAfter('h1.title')
  $(`<div id="vue-toc"></div>`).insertAfter('#search')
  $(config.tocSelector).remove()

  Vue.createApp({
    template: `
        <el-menu clas="el-toc-menu">
          <el-menu-item-group v-for="(list, month) in pages" :key="month" :title="month">
            <el-menu-item v-for="(page, i) in list" :index="i+''" :key="page.timestamp">
            <span class="date">{{page.date}}</span>
            <span class="title"><a :href="page.file">{{page.title}}</a></span>
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>`,
    setup() {
      return {
        pages
      }
    }
  })
    .use(ElementPlus)
    .mount('#vue-toc')
}
