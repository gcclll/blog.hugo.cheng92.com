/** jsx?|tsx? file header */

document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('pre.src').forEach((el) => {
    const [, className] = el.classList
    const [, lang = 'js'] = (className || '').split('-')
    const { value } = hljs.highlight($(el).text(), {
      language: lang
    })
    if (value) {
      $(el).html(`${value}`)
    }
  })
})
