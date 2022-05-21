$(function () {
  Vue.createApp({
    template: `
<el-card>
<template #header>
<el-input v-model="text" placeholder="请输入搜索key或其描述查找"/>
</template>
<div class="box">
<p v-for="(item, i) in items" :key="i" v-html="item"/>
</div>
</el-card>
`,
    setup() {
      const _keys = Vue.readonly(window._keys)
      const items = Vue.ref([])
      const text = Vue.ref('')
      
      Vue.onMounted(() => {
        items.value = _keys
      })

      Vue.watch(text, val => {
        console.log({ val });
        if (val) {
          items.value = filterList(val, _keys)
        } else {
          items.value = _keys
        }
      })
      return { items, text }
    }
  }).use(ElementPlus).mount('#PZm5mPCu')
})
