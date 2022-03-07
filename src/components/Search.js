/** jsx?|tsx? file header */
import { querySearch } from '../utils'
import { cached } from '../cache'

export default Vue.defineComponent({
  template: `
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
    </el-dialog>`,
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
