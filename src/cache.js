/** jsx?|tsx? file header */
import { formatPages } from './utils'

// 页面中的链接，锚点数据，用来全站搜索
const deduped = [] // dedupStats()
// 包含页面创建时间，用来创建主页的 TOC
const pages = formatPages()
const filename = location.pathname.replace(/.*\//g, '')

const loadedMap = {}
const path = '/assets/js/stats'

const s = {
  get(key) {
    return window.localStorage.getItem(key)
  },
  set(key, val) {
    return window.localStorage.getItem(key, val)
  }
}

function allLoaded() {
  const loaded = _.keys(loadedMap).length === _.keys(window.$pages).length
  console.log('loaded=', loaded)
  return loaded
}

function getPageScript(pageName) {
  const jsFile = `${path}/${pageName}.js`
  if ($(`script#${pageName}`).get(0)) {
    return ''
  }
  return `<script id="${pageName}" src="${jsFile}" type="text/javascript" sync></script>`
}

function loadPageStats(cbOrPage) {
  if (allLoaded()) return

  let html = ''
  if (_.isString(cbOrPage) && !loadedMap[cbOrPage]) {
    html = getPageScript(cbOrPage)
    loadedMap[cbOrPage] = true
  } else {
    for (let page in window.$pages) {
      if (loadedMap[page]) {
        continue
      }
      html += getPageScript(page)
      loadedMap[page] = true
    }
  }

  $('head').append(html)
  if (_.isFunction(cbOrPage)) cbOrPage(window.$stats, window.$pages)
  for (let prop in window.$stats) {
    const { IDLinks, aLinks } = window.$stats[prop]
    IDLinks.forEach(forEachHandler)
    aLinks.forEach(forEachHandler)
  }
  cached.current = cached.whole.filter((result) => {
    const { url, text, value, href, id, filename } = result
    result.value = value || text
    result.url = result.link = url || href || `${filename}#${id}`
    return result.filename === cached.filename
  })
}

function forEachHandler(link) {
  !_.find(cached.whole, (i) => i.text === link.text) &&
    cached.whole.push({ ...link, link: link.url || link.href })
}

// 取出由 parse.py 生成的网站资源信息
export const cached = {
  pages,
  loadPageStats,
  filename,
  currentPageStat: window.$pages[filename] || {},
  current: [], // 本文
  whole: [] // 全站
}
