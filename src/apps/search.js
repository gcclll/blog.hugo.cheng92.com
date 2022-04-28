/** jsx?|tsx? file header */
import Search from '../components/Search'
import SearchItem from '../components/SearchItem'
import SearchSuffix from '../components/SearchSuffix'
import HomeToc from '../components/HomeToc'
import { cached } from '../cache'
import { filterList } from '../utils'
import config from '../config'

export default function loadSearchApp() {
  const current = _.cloneDeep(cached.current)
  const id = config.isHome ? '#vue-toc' : '#search'

  const ele = document.getElementById(id.replace(/^#/, ''))
  if (!ele) return

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
        <home-toc v-if="isHome" :search-text="search" @change-tab="search=''"/>
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
        isHome: config.isHome
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
    }
  })
    .use(ElementPlus)
    .mount(id)
}
