/** jsx?|tsx? file header */
import Search from '../components/Search'
import { cached } from '../cache'
import { filterByTitle, filterList } from '../utils'
import config from '../config'

const SearchSuffix = Vue.defineComponent({
  template: `<img class="command-k" src="/assets/img/command.svg"/><span class="command-k">K</span>`
})

export default function loadSearchApp() {
  const pages = _.cloneDeep(cached.pages)
  const pageValues = _.flatten(_.values(pages))
    .sort((a, b) => (a.title < b.title ? -1 : 1))
    .map((item) => ({
      ...item,
      value: item.title,
      link: item.href
    }))
  Vue.createApp({
    template: `
        <el-input
          v-if="isHome"
          class="inline-input search-input"
          v-model="search" placeholder="搜索本文(Alt/Cmd+K 全站搜索)">
          <template #suffix><search-suffix /></template>
        </el-input>
<el-autocomplete
  v-model="search"
  :fetch-suggestions="querySearch"
  class="inline-input search-input"
  placeholder="搜索本文(Alt/Cmd+K 全站搜索)"
  @select="handleSelect"
>
<template #suffix><search-suffix /></template>
</el-autocomplete>
        <el-menu v-if="isHome" class="el-toc-menu">
          <el-menu-item-group v-for="(list, month) in pages" :key="month" :title="month">
            <el-menu-item v-for="(page, i) in list" :index="i+''" :key="page.timestamp">
            <span class="date">{{page.date}}</span>
            <span class="title"><a :href="page.url" v-html="page.title"></a></span>
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
        <div id="search"><search/></div>`,

    components: {
      Search,
      SearchSuffix
    },
    data() {
      return {
        search: '',
        isHome: config.isHome
      }
    },
    methods: {
      querySearch(s, cb) {
        const list = s ? filterList(s, pageValues) : pageValues
        console.log(list, 1)
        cb(list)
      },
      handleSelect(value) {
        console.log(value, 'select')
      }
    },
    computed: {
      pages() {
        return filterByTitle(this.search, pages)
      }
    }
  })
    .use(ElementPlus)
    .mount(config.isHome ? '#vue-toc' : '#search')
}
