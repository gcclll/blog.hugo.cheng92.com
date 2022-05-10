/** jsx?|tsx? file header */
$(function () {
  console.log('my plan...')
  const { Opportunity } = ElementPlusIconsVue
  const { ElIcon, ElTooltip } = ElementPlus
  const { h } = Vue

  Vue.createApp({
    template: `
<el-dialog
  v-model="dialogVisible"
  title="请输入密码"
  width="30%"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  :show-close="false"
>
  <el-input type="password" placeholder="请输入密码查看..." v-model="passwd"/>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" @click="handleConfirm">解锁</el-button>
    </span>
  </template>
</el-dialog>
<div style="height:500px">
<el-auto-resizer v-if="tableVisible">
  <template #default="{ height, width }">
    <el-table-v2
      :columns="columns"
      :data="data"
      :width="width"
      :height="height"
      fixed
    />
  </template>
</el-auto-resizer>
</div>

`,
    setup() {
      const key = 'blog.cheng92.com'
      const passwd = Vue.ref(localStorage.getItem(key) || '')
      const dialogVisible = Vue.ref(true)
      const tableVisible = Vue.computed(
        () => !dialogVisible.value && isRightPwd()
      )
      const columns = [
        {
          title: '任务名',
          key: 'taskName',
          width: 150
        },
        {
          title: '截止日期',
          key: 'deadline',
          width: 150,
          cellRenderer: ({ cellData: deadline }) => {
            const { color, tip } = getLightColor(deadline)
            return Vue.h('span', null, [
              deadline,
              h(
                ElTooltip,
                {
                  effect: 'dark',
                  placement: 'right',
                  content: tip
                },
                () =>
                  h(ElIcon, null, {
                    default: () => h(Opportunity, { color })
                  })
              )
            ])
          }
        },
        {
          title: '相关链接',
          key: 'relaLinks',
          width: 200
        }
      ].map((col) => ((col.dataKey = col.key), col))

      Vue.onMounted(() => {
        // 没有密码时弹出，密码只需要输入一次就行，因为会存储到 local storage
        dialogVisible.value = !isRightPwd()
      })

      function isRightPwd() {
        return passwd.value === '123456'
      }

      return {
        handleConfirm() {
          if (isRightPwd()) {
            dialogVisible.value = false
            localStorage.setItem(key, passwd.value)
            ElementPlus.ElMessage({ message: '解锁成功！', type: 'success' })
          } else {
            localStorage.setItem(key, '')
            ElementPlus.ElMessage({
              message: '密码错误！',
              type: 'error'
            })
          }
        },
        goBack() {
          history.back()
        },
        tableVisible,
        passwd,
        dialogVisible,
        data: [
          {
            taskName: 'test1',
            deadline: '2022-05-30' // 20 > 14
          },
          {
            taskName: 'test2',
            deadline: '2022-05-19' // 7 < 9 < 14
          },
          {
            taskName: 'test3',
            deadline: '2022-05-13' // 3 < 7
          }
        ],
        columns
      }
    }
  })
    .use(ElementPlus)
    .mount('#app')

  function getLightColor(deadline) {
    const sevenMS = 7 * 24 * 3600 * 1000 // 7 天

    const deltaMS = new Date(deadline).getTime() - new Date().getTime()
    if (deltaMS > sevenMS && deltaMS < 2 * sevenMS) {
      return { color: 'yellow', tip: '需要注意截止日期' }
    } else if (deltaMS > 2 * sevenMS) {
      return { color: 'green', tip: '时间充足' }
    } else if (deltaMS < sevenMS) {
      return { color: 'red', tip: '快到期了，赶紧完成' }
    }
  }
})
