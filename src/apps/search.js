/** jsx?|tsx? file header */
import Search from '../components/Search'
import config from '../config'

export default function loadSearchApp() {
  // search component
  Vue.createApp({
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
      <search/>`,
    components: {
      Search
    },
    data() {
      return {
        search: ''
      }
    },
    methods: {
      handleSelect(item) {
        this.search = ''
        location.href = item.href
      }
    }
  })
    .use(ElementPlus, config.ElementPlusOptions)
    .mount('#search')
}
