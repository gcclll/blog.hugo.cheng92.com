/** jsx?|tsx? file header */
import { querySearch } from '../utils'
import { cached } from '../cache'
import SearchItem from './SearchItem'

const WHOLE = '1'
const CURRENT = '2'
export default Vue.defineComponent({
  template: `
    <el-dialog  v-model="dialogVisible" @open="clean" @close="clean" title="搜索">
     <div v-loading="loading" element-loading-text="全站资源加载中，请耐心等待...">
      <el-input autofocus v-model="search" placeholder="请输入搜索内容(暂只支持标题、链接、锚点)">
        <template #prepend>
          <el-select v-model="scope" placeholder="Select" style="width:80px">
            <el-option label="全站" value="1"/>
            <el-option label="本文" value="2"/>
          </el-select>
        </template>
      </el-input>
      <ul class="search-list" style="max-height:500px;overflow-y:scroll;text-align:left">
        <li v-for="(result, i) in filterResults" :key="i" @click="locate(result.url)">
          <search-item :item="result"/>
        </li>
      </ul>
     </div>
    </el-dialog>`,
  components: {
    SearchItem
  },
  setup() {
    const state = Vue.reactive({
      results: [],
      filterResults: [], // 实时搜索到的数据
      search: '', // 搜索关键词
      dialogVisible: false,
      loading: true,
      scope: WHOLE, // 2 - 本文, 1 - 全站
      stats: {},
      pages: {}
    })

    Vue.onBeforeMount(() => {
      console.log('on before mount')
    })

    Vue.onMounted(() => {
      $(document.body).on('keydown', keydownHandler)
    })

    function keydownHandler(e) {
      console.log(e.metaKey, e.keyCode, 'key')
      if (e.metaKey && e.keyCode === 75) {
        state.dialogVisible = true
        cached.loadPageStats()
        state.loading = false
        state.results = state.scope === WHOLE ? cached.whole : cached.current
      }
    }
    Vue.onUnmounted(() => {
      $(document.body).off('keydown', keydownHandler)
    })

    Vue.watch(
      () => state.scope,
      (val) => (state.results = val === CURRENT ? cached.current : cached.whole)
    )

    Vue.watch(
      () => state.search,
      (newVal, oldVal) => {
        if (newVal) {
          // 当前输入的是空格，不需要触发搜索
          if (
            oldVal &&
            newVal.replace(new RegExp(`^${oldVal}`), '').trim() === ''
          ) {
            return
          }
          querySearch(
            newVal,
            (results) => {
              state.filterResults = results
            },
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
      isCurrentPage(file) {
        return new RegExp(`${file}$`).test(location.pathname)
      },
      locate(link) {
        location.href = link
        clean()
        state.dialogVisible = false
        console.log({ link }, 'locate')
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
