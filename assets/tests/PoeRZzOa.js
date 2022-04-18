/** jsx?|tsx? file header */

const {
  reactive,
  watch,
  watchEffect,
  ref,
  computed,
  onMounted,
  createApp,
  getSchedulerInfo
} = Vue

createApp({
  setup() {
    const logs = reactive([])
    const foo = ref(1)
    const bar = ref(100)
    const baz = computed(() => {
      log(
        `<font color="red">computed</font>| foo=${foo.value}, bar=${bar.value}`
      )
      return foo.value + bar.value
    })
    const log = (msg) => {
      const jobs = []
      logs.unshift(msg)
      window.jobs.forEach((job) => {
        const value = '> ' + job.type + '-' + job.hint
        if (!jobs.includes(value)) jobs.push(value)
        // jobs.push(value)
      })
      jobs.push('---------------------------------------------')
      jobs.forEach((job) => logs.unshift(job))
    }

    watch(foo, (newVal) => {
      log(`<font color="red">watch</font>| foo=${foo.value}`)
    })

    watchEffect(() => {
      log(`<font color="red">watchEffect</font>| bar=${bar.value}`)
    })

    const jobs = computed(() => window.jobs)

    return {
      logs,
      foo,
      bar,
      baz,
      jobs
    }
  },

  template: `
<el-card header="日志">
  <el-button @click="logs.splice(0)">CLEAR</el-button>
  <el-button @click="foo++">FOO + 1</el-button>
  <el-button @click="bar--">BAR - 1</el-button>
  <p style="color:blue">baz={{baz}}, jobs=${jobs.length}</p>
  <p style="margin:0;padding:2px 0" v-for="(msg,i) in logs" v-html="msg"></p>
</el-card>`
})
  .use(ElementPlus)
  .mount('#PoeRZzOa')
console.log(Vue, 111)
