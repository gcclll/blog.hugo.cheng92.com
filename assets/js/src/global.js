$(function () {
  const titleRE = /[a-z0-9 \.:#]+/gi
  const deduped = dedupStats()
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
  console.log(cached)

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

  $('#table-of-contents>h2').append(`<div id="search">Loading...</div>`)

  const ElementPlusOptions = {
    // size: "small",
  }
  const { createApp } = Vue

  const app = createApp({
    template: `

<el-autocomplete
  v-model="search"
  :fetch-suggestions="querySearch"
  :trigger-on-focus="false"
  class="inline-input search-input"
  placeholder="Please Input Search Content"
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
          let matched = Vue.toRaw(value)
          words.forEach((word) => {
            matched = matched.replace(
              new RegExp(`${word}`, 'gi'),
              `<span class="hl-word">${word}</span>`
            )
          })
          console.log(value, matched, '111')
          return matched
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
})
