$(function () {
  Vue.createApp({
    template: `
<el-card>
<template #header>
<el-input v-model="text" placeholder="请输入搜索key或其描述查找"/>
</template>
<div class="box">
<section v-for="(list, title) in items">
<template v-if="list.length">
  <el-divider>{{ title }}</el-divider>
  <p v-for="(item, i) in list" :key="i" v-html="item"/>
</template>
</section>
</div>
</el-card>
`,
    setup() {
      const original = Vue.readonly(window.$keyMaps)
      const keyMaps = Vue.reactive(_.cloneDeep(original))
      const text = Vue.ref('')
      
      Vue.watch(text, val => {
        if (val) {
          for (let prop in original) {
            // 不能改变原始数据，所以深拷贝出来
            const list = _.cloneDeep(original[prop])
            keyMaps[prop] = filterList(val, list)
          }
        } else {
          _.assign(keyMaps, _.cloneDeep(original))
        }
      })
      return { items: keyMaps, text }
    }
  }).use(ElementPlus).mount('#PZm5mPCu')
})
