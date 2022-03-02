$(function () {
  // 网站胡一些静态数据 ////////////////////////////////////////////////////
  const deduped = dedupStats()
  const pages = formatPages()
  console.log(pages, 123)
  const tocSelector = 'div[id^="outline-container-"]'
  // 检测是不是移动端 //////////////////////////////////////////////////////
  const md = new MobileDetect(window.navigator.userAgent)
  const isMobile = md.mobile()
  const cached = {
    current: deduped.reduce((arr, curr) => {
      if (
        curr &&
        curr.file &&
        new RegExp(`${curr.file}$`).test(location.pathname)
      ) {
        arr.push(curr)
      }
      return arr
    }, []), // 本文
    whole: deduped // 全站
  }
  const ElementPlusOptions = {
    // size: "small",
  }

  console.log($('#postamble .date').text())

  $('#toggle-valine').click(function () {
    $('#vcomments').toggle()
  })

  const isHome = /home\.html$/.test(location.pathname)
  // if (isHome) {
  // ...
  // } else {
  $('#content').append(
    `<script id="utt-client" type="text/javascript" src="/assets/js/dist/client.js" issue-term="pathname" repo="gcclll/cheng92-comments" theme="github-light" async></script>`
  )

  // valine ///////////////////////////////////////////////////////////////////
  $('#content').append(`
    <button id="toggle-valine" type="button" class="btn btn-success">
      显示 <a target="_blank" href="https://valine.js.org/">Valine</a> 评论系统
    </button>
    <div id="vcomments" style="display:none"></div>
    <script>
      new Valine({
          el: '#vcomments',
          appId: 'dwjufJhAgWQzU3evb1th5SrC-gzGzoHsz',
          appKey: 'z7BITHKt5oI9zuxdfp8X9tUN'
      })
    </script>`)
  // }

  const searchTmpl = `<div id="search">Loading...</div>`
  // 自定义 TOC
  if (isHome) {
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
    $(searchTmpl).insertAfter('h1.title')
    $(`<div id="vue-toc"></div>`).insertAfter('#search')
    // $(tocSelector).remove()

    Vue.createApp({
      template: `
        <el-menu clas="el-toc-menu">
          <el-menu-item-group v-for="(list, month) in pages" :key="month" :title="month">
            <el-menu-item v-for="(page, i) in list"  :index="i+''" :key="page.timestamp">{{page.title}}</el-menu-item>
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
  } else {
    $('#table-of-contents>h2').append(searchTmpl)
    // n. 网站搜索功能
    $('#table-of-contents').show()
    $('#postamble').show()
  }

  // $('h1.title').append(`<span>${navigator.userAgent}</span>`)
  if (isMobile) {
    $('h1.title').append(
      `<img class="title-phone" src="/assets/img/phone.svg"/>`
    )
  }
  // 1. add github badge /////////////////////////////////////////////////////////
  $('span').each(function () {
    const bgColor = $(this).css('background-color')
    if (bgColor === 'rgb(35, 39, 46)') {
      $(this).css('background-color', 'rgba(35, 39, 46, .1)')
    }
  })

  $('#postamble .author').append(
    $(
      '<span class="follows"><a href="https://www.github.com/gcclll?tab=followers">' +
        '<img src="https://img.shields.io/github/followers/gcclll?style=social"></a></span>'
    )
  )

  const app = Vue.createApp({
    template: `

<el-autocomplete
  v-model="search"
  :fetch-suggestions="querySearch"
  :trigger-on-focus="false"
  class="inline-input search-input"
  placeholder="全文或本文中搜索..."
  @select="handleSelect"
>
  <template #suffix>
    <img class="command-k" src="/assets/img/command.svg"/><span class="command-k">K</span>
  </template>
</el-autocomplete>
<el-dialog v-model="dialogVisible" @open="clean" @close="clean" title="全文(站)搜索">
<el-input autofocus v-model="search" placeholder="请输入搜索内容(暂只支持标题、链接、锚点)">
  <template #prepend>
    <el-select v-model="scope" placeholder="Select" style="width:80px">
      <el-option label="本文" value="1"/>
      <el-option label="全站" value="2"/>
    </el-select>
  </template>
  <template #append><img class="my-search-icon" src="/assets/img/search.svg"></template>
</el-input>
<ul class="search-list" style="max-height:500px;overflow-y:scroll;text-align:left">
  <li v-for="(result, i) in filterResults" :key="result.value" @click="locate(result.link)">
    <div class="result-value" v-html="highlight(result.value)"></div>
    <div class="result-tags">
      <el-tag v-if="!isCurrentPage(result.file)" effect="dark" type="info">{{result.file}}</el-tag>
    </div>
  </li>
</ul>
</el-dialog>
`,
    setup() {
      const state = Vue.reactive({
        results: [],
        filterResults: [],
        search: '',
        dialogVisible: false,
        scope: '2' // 1 - 本文, 2 - 全站
      })

      Vue.onMounted(() => {
        state.results = state.scope === '1' ? cached.current : cached.whole
        $(document.body).on('keydown', keydownHandler)
      })

      function keydownHandler(e) {
        if (e.metaKey && e.keyCode === 75) {
          state.dialogVisible = true
        }
      }
      Vue.onUnmounted(() => {
        $(document.body).off('keydown', keydownHandler)
      })

      Vue.watch(
        () => state.scope,
        (val) => (state.results = val === '1' ? cached.current : cached.whole)
      )

      Vue.watch(
        () => state.search,
        (newVal) => {
          if (newVal) {
            querySearch(
              newVal,
              (results) => (state.filterResults = results),
              state.results
            )
          } else {
            state.filterResults = []
          }
        }
      )

      const clean = () => {
        state.filterResults = []
        state.search = ''
      }

      return {
        ...Vue.toRefs(state),
        clean,
        // 高亮匹配内容
        highlight(value) {
          const words = state.search.split(' ')
          words.forEach((word) => {
            value = value.replace(
              new RegExp(`${word}`, 'gi'),
              `<span class="hl-word">${word}</span>`
            )
          })
          return value
        },
        isCurrentPage(file) {
          return new RegExp(`${file}$`).test(location.pathname)
        },
        locate(link) {
          location.href = link
          clean()
          state.dialogVisible = false
        },
        querySearch: (qs, cb) => querySearch(qs, cb, state.results),
        handleSelect(item) {
          if (item.link) {
            location.href = item.href
            state.search = ''
          }
        }
      }
    }
  })

  app.use(ElementPlus, ElementPlusOptions).mount('#search')

  function querySearch(queryString, cb, results) {
    const result = queryString
      ? results.filter(createFilter(queryString))
      : results
    cb(result)
  }
  function createFilter(queryString) {
    return (item) => {
      // 支持叠加搜索
      const queryList = queryString.split(' ')
      const lower = item.value.toLowerCase()
      return queryList.every((val) => lower.indexOf(val.toLowerCase()) > -1)
    }
  }

  function dedupStats() {
    const results = []
    window.$stats.forEach((stat) => {
      if (!results.find((r) => r && r.value === stat.value)) {
        results.push(stat)
      }
    })
    return results
  }

  function trimText(ele, h) {
    return $(ele).children(h).text().replace(/\n/g, '').replace(/\s+/g, ' ')
  }

  function findOutlines(parents, hn = 2) {
    const children = []
    if (parents == null) {
      parents = $(tocSelector)
    } else {
      parents = $(parents).children(tocSelector)
    }
    parents.each(function () {
      const title = trimText(this, `h${hn}`)
      if (title) {
        children.push({
          title,
          id: $(this).find(`h${hn}`).attr('id'),
          href: $(this).find(`h${hn}>a`).attr('href'),
          children: findOutlines(this, hn + 1)
        })
      }
    })
    return children
  }

  function formatPages() {
    const ts = window.$timestamp

    const pages = {}
    for (let page in ts) {
      const month = ts[page].month
      if (pages[month] == null) {
        pages[month] = []
      }
      pages[month].push(ts[page])
    }
    return pages
  }
})
