/** jsx?|tsx? file header */
$(function () {
  const defaultTmplValue = `
<div id="foo" :class="bar.baz">
  {{ world.burn() }}
  <div v-if="ok">yes</div>
  <template v-else>no</template>
  <div v-for="(value, index) in list"><span>{{ value + index }}</span></div>
</div>`.trim()
  Vue.createApp({
    template: `
<div>
<el-input type="textarea" :rows="10" v-model="value" placeholder="请输入测试模板，如： <div v-if/>" />
<el-button style="width:100%;margin:1rem 0;" @click="compile" type="primary">编译</el-button>
<p>
    <el-switch v-model="showAst" active-text="显示 AST" inactive-text="隐藏AST"/>
</p>
<el-card>
<pre v-for="log, i in localLogs" :class="['debug', log.type === 'title' ? 'line' : '']" :key="i" v-html="log.value"/>
</el-card>
</div>
`,
    setup() {
      const value = Vue.ref(defaultTmplValue)
      const localLogs = Vue.ref([])
      const showAst = Vue.ref(false)
      currentLogKey = 'compiler-core-01'

      Vue.watch(value, (val) => {
        if (val == '') {
          val = defaultTmplValue
        }
      })

      Vue.onMounted(() => {
        if (value.value) {
          compile()
        }
      })

      function compile() {
        clearLog(currentLogKey)

        try {
          logOff()
          const { code, ast } = baseCompile(value.value, {
            filename: 'foo.vue'
          })
          logOn()
          if (showAst.value) {
            logg('ast', ast)
          }
          logg('code', value.value, code)
        } catch (e) {
          ElementPlus.ElMessageBox({
            type: 'error',
            title: '编译错误',
            message: e.message
          })
        }

        if (logs[currentLogKey]) {
          localLogs.value = [...logs[currentLogKey]]
            .map((log) => {
              if (log.value == '') {
                return null
              }
              log.value = syntaxHighlight(log.value)
              return log
            })
            .filter(Boolean)
        }
      }

      return {
        value,
        showAst,
        compile,
        localLogs
      }
    }
  })
    .use(ElementPlus)
    .mount('#Mr9KIGir')
})
