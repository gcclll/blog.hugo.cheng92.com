/** jsx?|tsx? file header */
import Search from '../components/Search'
import SearchItem from '../components/SearchItem'
import SearchSuffix from '../components/SearchSuffix'
import HomeToc from '../components/HomeToc'
import { cached } from '../cache'
import { filterByTitle, filterList } from '../utils'
import config from '../config'

export default function loadSearchApp() {
  const pages = _.cloneDeep(cached.pages)
  const current = _.cloneDeep(cached.current)
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
          v-model="search" placeholder="搜索">
          <template #suffix><search-suffix /></template>
        </el-input>
        <el-autocomplete
          v-else
          v-model="search"
          :fetch-suggestions="querySearch"
          class="inline-input search-input"
          placeholder="搜索"
          @select="handleSelect"
        >
          <template #default="{item}">
            <search-item :item="item"/>
          </template>
          <template #suffix><search-suffix /></template>
        </el-autocomplete>
        <home-toc v-if="isHome" :list-type="listType" :list-data="pages"/>
        <div id="search"><search/></div>`,

    components: {
      Search,
      SearchSuffix,
      SearchItem,
      HomeToc
    },
    data() {
      return {
        search: '',
        isHome: config.isHome,
        listType: config.enum.TYPE_ARCHIVES
      }
    },
    methods: {
      querySearch(s, cb) {
        const target = current // pageValues
        cb(s ? filterList(s, target) : target)
      },
      handleSelect(value) {
        console.log(value, 'select')
      }
    },
    mounted() {
      $('.el-scrollbar__view.el-autocomplete-suggestion__list').on(
        'mouseenter mouseleave',
        'li',
        function (e) {
          $(this).attr('aria-selected', e.type === 'mouseenter')
        }
      )
    },
    unmounted() {},
    computed: {
      pages() {
        return filterByTitle(this.search, pages)
      }
    }
  })
    .use(ElementPlus)
    .mount(config.isHome ? '#vue-toc' : '#search')
}
