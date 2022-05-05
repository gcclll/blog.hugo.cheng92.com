/** jsx?|tsx? file header */

// 给 pre.src.src-js::before 增加点击拷贝代码
function addCopyButton() {
  const id = 'gl-copy-button'
  const qid = `#${id}`
  $('pre.src').hover(function (e) {
    const $pre = $(this)

    if (e.type === 'mouseenter') {
      $(this).append(`<button id="${id}">复制代码</button>`)
      $(qid).click(function () {
        const cloned = $pre.clone(true)
        cloned.find('span.linenr').each(function () {
          $(this).remove()
        })
        const code = cloned
          .text()
          // .replace(/\x20{0,}\d+:/g, '')
          .replace('复制代码', '')
        navigator.clipboard.writeText(code).then(() => {
          ElementPlus.ElMessage({
            type: 'success',
            message: '复制成功'
          })
        })
      })
    } else if (e.type === 'mouseleave') {
      $(qid).off('click')
      $(qid).remove()
    }
  })
}

export function handleEvents() {
  // 复制按钮
  addCopyButton()
}
