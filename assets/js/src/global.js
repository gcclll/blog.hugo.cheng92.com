$(function () {
  const titleRE = /[a-z0-9 \.:#]+/gi

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
<img class="command-k" src="/assets/img/command.svg"/><span class="command-k">K</span></template>
</el-autocomplete>
<el-dialog v-model="dialogVisible" @open="clean" @close="clean">
<el-input v-model="search" placeholder="请输入搜索内容(仅限本文，TODO搜索全博客)"/>
<ul class="search-list" style="max-height:500px;overflow-y:scroll;text-align:left">
  <li v-for="(result, i) in filterResults" :key="result.value" @click="locate(result.link)">
    {{result.value}}
  </li>
</ul>
</el-dialog>
`,
    setup() {
      const state = Vue.reactive({
        results: [],
        filterResults: [],
        search: '',
        dialogVisible: false
      })

      Vue.onMounted(() => {
        if ($.isArray(window.$stats)) {
          window.$stats.forEach((stat) => {
            const pathname = location.pathname.split('/')
            const filename = pathname[pathname.length - 1]
            const re = new RegExp(`^\\[${filename}\\]`)
            const bak = { ...stat }
            // 去掉当前页面名称
            if (re.test(stat.value)) {
              bak.value = bak.value.replace(re, '')
            }
            if (!state.results.find((r) => r && r.value === bak.value)) {
              state.results.push(bak)
            }
          })
        }
        console.log(state.results)

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
})
