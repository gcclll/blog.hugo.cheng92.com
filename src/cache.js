/** jsx?|tsx? file header */
import { dedupStats, formatPages } from './utils'

// 页面中的链接，锚点数据，用来全站搜索
const deduped = [] // dedupStats()
// 包含页面创建时间，用来创建主页的 TOC
const pages = formatPages()
const filename = location.pathname.replace(/.*\//g, '')

let loaded = false
function loadPageStats(cb) {
  if (loaded) {
    ElementPlus.ElMessage({
      type: 'success',
      message: '全站资源已就绪。'
    })
    return
  }
  const path = '/assets/js/stats'

  let html = ''
  for (let page in window.$pages) {
    const jsFile = `${path}/${page}.js`
    html += `<script src="${jsFile}" type="text/javascript" sync></script>`
  }
  $('head').append(html)
  loaded = true
  if (cb) cb(window.$stats, window.$pages)
  for (let prop in window.$stats) {
    const { IDLinks, aLinks } = window.$stats[prop]
    IDLinks.forEach((link) => cached.whole.push({ ...link }))
    aLinks.forEach((link) => cached.whole.push({ ...link }))
  }
  cached.current = cached.whole.filter((result) => {
    const { url, text, value, href, id, filename } = result
    result.value = value || text
    result.url = url || href || `${filename}#${id}`
    return result.filename === cached.filename
  })
  console.log(cached, 333)
}

// 取出由 parse.py 生成的网站资源信息
export const cached = {
  pages,
  loadPageStats,
  filename,
  current: [], // 本文
  whole: [] // 全站
}