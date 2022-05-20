$(function () {
  Vue.createApp({
    template: `
<el-card>
<template #header>
<el-input v-model="text" placeholder="请输入搜索key或其描述查找"/>
</template>
<ul class="box">
<li v-for="({key, desc}) in items" :key="key">
<el-row>
<el-col :span="8">{{key}}</el-col>
<el-col :span="16">{{desc}}</el-col>
</el-row>
</li>
</ul>
</el-card>
`,
    setup() {
      const items = Vue.reactive([
        { key: 'C-c', desc: 'test' }
      ])
      return { items }
    }
  }).use(ElementPlus).mount('#PZm5mPCu')
})
