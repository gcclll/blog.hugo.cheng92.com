/** jsx?|tsx? file header */
$(function () {
  Vue.createApp({
    template: `
<div>
<el-input type="textarea" v-model="value" placeholder="请输入测试模板，如： <div v-if/>" />
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
      const value = Vue.ref('')
      const localLogs = Vue.ref([])
      const showAst = Vue.ref(false)
      currentLogKey = 'compiler-core-01'
      return {
        value,
        showAst,
        compile() {
          if (value.value == '') {
            ElementPlus.ElMessageBox({
              type: 'warning',
              title: '提示',
              message: '请输入模板'
            })
            return
          }
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
        },
        localLogs
      }
    }
  })
    .use(ElementPlus)
    .mount('#Mr9KIGir')
})
