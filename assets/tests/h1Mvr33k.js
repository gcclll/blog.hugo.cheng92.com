/** jsx?|tsx? file header */
$(function () {
  currentLogKey = 'compiler-dom-01'
  Vue.createApp({
    template: `
<div>
<el-input type="textarea" v-model="value" placeholder="请输入测试模板，如： <div v-if/>" />
<el-button style="width:100%;margin:1rem 0;" @click="runCompile" type="primary">编译</el-button>
<p>
    <span><el-switch inline-prompt v-model="showAst"/>&nbsp;show ast</span>
    <span style="margin-left:10px"><el-switch inline-prompt v-model="hoistStatic"/>&nbsp;hoist static</span>
</p>
<el-input v-model="path" placeholder="请输入要查看的AST路径，如：children.0.type" />
<br/>
<el-card>
<pre v-for="log, i in localLogs" :class="['debug', log.type === 'title' ? 'line' : '']" :key="i" v-html="log.value"/>
</el-card>
</div>
`,
    setup() {
      const value = Vue.ref('')
      const localLogs = Vue.ref([])
      const showAst = Vue.ref(false)
      const hoistStatic = Vue.ref(true)
      const path = Vue.ref('')
      const ast = Vue.ref({})

      Vue.watch([showAst, hoistStatic, path], () => {
        console.log('watch...')
        runCompile()
      })

      function runCompile() {
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
          const { code, ast: astResult } = compilerDom.compile(value.value, {
            filename: 'foo.vue',
            hoistStatic: hoistStatic.value,
            prefixIdentifiers: true
          })
          logOn()
          if (showAst.value) {
            ast.value = astResult
            logg('ast', findValue(path.value.split('.'), astResult))
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
        path,
        value,
        showAst,
        runCompile,
        localLogs,
        hoistStatic
      }
    }
  })
    .use(ElementPlus)
    .mount('#h1Mvr33k')
})

function findValue(paths, obj) {
  let result = obj,
    key
  const ps = paths.filter(Boolean)
  while ((key = ps.shift()) !== undefined) {
    if (typeof result === 'object') {
      result = result[key] || result
    } else {
      return result
    }
  }
  return result
}
