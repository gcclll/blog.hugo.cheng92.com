$(function () {
  // 0. 网站胡一些静态数据 ////////////////////////////////////////////////////
  const deduped = dedupStats()
  const tocSelector = 'div[id^="outline-container-"]'
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

  // 自定义 TOC ///////////////////////////////////////////////////////////////
  const isHome = /home\.html$/.test(location.pathname)
  const searchTmpl = `<div id="search">Loading...</div>`
  if (isHome) {
    $('#table-of-contents').hide()
    $('#content').css({
      margin: 'auto'
    })
    $('#postamble').css({
      width: '100%',
      textAlign: 'center'
    })
    // 收集所有标题(id包含 'outline-container-' 且以它开头的 div)
    $(`<div id="vue-toc"></div>`).insertAfter('#content>h1')
    $('h1.title').append(searchTmpl)
    const outlines = findOutlines()
    console.log(outlines, 1000)
    $(tocSelector).remove()

    Vue.createApp({
      template: `
<el-input v-model="searchText"/>
<el-menu clas="el-toc-menu">
  <template v-for="(ol,i) in menus">
    <el-sub-menu v-if="ol.children.length" :index="''+i">
      <template #title><h2 :id="ol.id"><span>{{ol.title}}</span></h2></template>
      <el-menu-item style="padding-left:20px" v-for="(child, ii) in ol.children" :index="i+'-'+ii">
        <h3 :id="child.id">
          <a v-if="child.href" :href="child.href">{{child.title}}</a>
          <span v-else>{{child.title}}</span>
        </h3>
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item v-else style="padding:0">
      <h2 :id="ol.id">
        <a v-if="ol.href" :href="ol.href">{{ol.title}}</a>
        <span v-else>{{ol.title}}</span>
      </h2>
    </el-menu-item>
  </template>
</el-menu>`,
      setup() {
        const searchText = Vue.ref('')
        const menus = Vue.computed(() => {
          return outlines
            .map((ol) => {
              if (ol.title.indexOf(searchText.value)) {
                return ol
              }
            })
            .filter(Boolean)
        })
        return {
          menus,
          searchText
        }
      }
    })
      .use(ElementPlus)
      .mount('#vue-toc')
  } else {
    // n. 网站搜索功能 //////////////////////////////////////////////////////////
    $('#table-of-contents>h2').append(searchTmpl)
    $('#table-of-contents').show()
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

  // 3. 检测是不是移动端 //////////////////////////////////////////////////////
  const md = new MobileDetect(window.navigator.userAgent)
  if (md.mobile()) {
    $('h1.title').append(
      `<img class="title-phone" src="/assets/img/phone.svg"/>`
    )
  }

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
})
