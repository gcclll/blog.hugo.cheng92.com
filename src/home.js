/** jsx?|tsx? file header */

import { noop } from './utils'
import config from './config'

export function setFooter() {
  setTimeout(() => {
    $('#content').append($('#postamble'))
    $('#postamble').css({
      position: 'relative',
      marginTop: '1rem'
    })
    $('#postamble').show()
    $('#postamble').css({
      width: '100%',
      textAlign: 'center'
    })
  }, 500)
}
export default function home(handleNotHome = noop) {
  // 是不是主页 home.html
  if (!config.isHome) {
    handleNotHome()
    return config.isHome
  }

  setFooter()

  // 收集所有标题(id包含 'outline-container-' 且以它开头的 div)
  $(`<div id="vue-toc"></div>`).insertAfter('h1.title')
  return config.isHome
}
