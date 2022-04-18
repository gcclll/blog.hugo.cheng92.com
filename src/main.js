import './scroll2Top'
import { addValine } from './valine'
import home from './home'
import { cached } from './cache'
import config from './config'
import loadSearchApp from './apps/search'
import { switchTheme } from './switch'
import { handleEvents } from './event'
import './css/theme.my.scss'
import './css/link.scss'
import './css/block.scss'
import './css/tooltip.scss'
import './css/global.scss'

$(function () {
  // 检测是不是移动端
  let md = null,
    isMobile = false

  if (typeof MobileDetect !== undefined) {
    md = new MobileDetect(window.navigator.userAgent)
    isMobile = md.mobile()
  }

  cached.loadPageStats(cached.filename)

  // 主页
  home((setFooter) => {
    // 非主页搜索放在 TOC 标题下面，主页的放在内容标题下面
    $('#table-of-contents>h2').append(config.searchTmpl)

    if (isMobile) {
      setFooter()
    } else {
      // 底部个人信息
      $('#postamble').show()
    }
  })

  // 搜索组件
  loadSearchApp()
  // 基于 github,  gcclll/cheng92-comments  的评论系统
  $('#content').append(
    `<script id="utt-client" type="text/javascript" src="/assets/js/dist/client.js" issue-term="pathname" repo="gcclll/cheng92-comments" theme="github-light" async></script>`
  )

  // 添加基于 valine 的评论系统
  addValine()

  // 移动端
  if (isMobile) {
    $('h1.title').append(
      `<img class="title-phone" src="/assets/img/phone.svg"/>`
    )
  }

  // add createdAt & updatedAt
  const { createdAt, updatedAt } = cached.currentPageStat
  $(
    `<p id="cuat"><span>创建于：${createdAt}</span><span>更新于：${updatedAt}</span></p>`
  ).insertAfter('h1.title')

  // 修改 span 标记颜色
  $('span').each(function () {
    const bgColor = $(this).css('background-color')
    if (bgColor === 'rgb(35, 39, 46)') {
      $(this).css('background-color', 'rgba(35, 39, 46, .1)')
    }
  })

  // 添加我的 github badge
  $('#postamble .author').append(
    $(
      '<span class="follows"><a href="https://www.github.com/gcclll?tab=followers">' +
        '<img src="https://img.shields.io/github/followers/gcclll?style=social"></a></span>'
    )
  )

  switchTheme()

  handleEvents()
})

function loadScript(file) {
  const script = document.createElement('script')
  script.type = 'module'
  script.setAttribute('scrollorigin', true)
  script.src = file.src
  document.head.appendChild(script)
}

function loadLink(file) {
  const link = document.createElement('link')
  link.rel = file.rel
  link.href = file.href
  document.head.appendChild(link)
}

window.loadApp = function (name) {
  $(function () {
    if (window.$apps) {
      const app = window.$apps[name]
      console.log('loading app>>>', app)
      if (!app) return
      app.scripts.forEach(loadScript)
      app.links.forEach(loadLink)
    }
  })
}
