/** jsx?|tsx? file header */
currentLogKey = 'compiler-core-01'
new Vue({
  template: `<el-input v-model="value" @change="handleChange" placeholder="请输入测试模板，如： <div v-if/>" />`,
  setup() {
    const value = Vue.ref('')
    return {
      handleChange(val) {
        console
      }
    }
  }
})
  .use(ElementPlus)
  .mount('#Mr9KIGir')
