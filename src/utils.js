/** jsx?|tsx? file header */

export const noop = () => {}
export function querySearch(queryString, cb, results = []) {
  const result = queryString ? filterList(queryString, results) : results
  cb(result)
}

export function createFilter(queryString) {
  return (item) => {
    // 支持叠加搜索
    const queryList = queryString.split(' ')
    const lower = item.value.toLowerCase()
    return queryList.every((val) => lower.indexOf(val.toLowerCase()) > -1)
  }
}

export function dedupStats() {
  const results = []
  window.$stats.forEach((stat) => {
    if (!results.find((r) => r && r.value === stat.value)) {
      results.push(stat)
    }
  })
  return results
}

export function trimText(ele, h) {
  return $(ele).children(h).text().replace(/\n/g, '').replace(/\s+/g, ' ')
}

export function findOutlines(parents, hn = 2) {
  const children = []
  if (parents == null) {
    parents = $(tocSelector)
  } else {
    parents = $(parents).children(tocSelector)
  }
  parents.each(function () {
    const title = trimText(this, `h${hn}`)
    if (title) {
      children.push({
        title,
        id: $(this).find(`h${hn}`).attr('id'),
        href: $(this).find(`h${hn}>a`).attr('href'),
        children: findOutlines(this, hn + 1)
      })
    }
  })
  return children
}

export function formatPages() {
  const ts = window.$pages

  const pages = {}
  for (let page in ts) {
    const obj = ts[page]
    const { month, year } = obj
    const key = `${year}-${String(month).length === 1 ? '0' + month : month}`

    const url = obj.url || obj.href
    if (!url) obj.href = obj.url = page

    if (pages[key] == null) {
      pages[key] = []
    }
    if (page !== 'index.html') {
      pages[key].push({ ...obj })
    }
  }
  // sort by `timestamp`
  for (let prop in pages) {
    const arr = pages[prop]
    if (arr && arr.length) {
      pages[prop] = arr.sort(
        (a, b) => new Date(b.birthtime) - new Date(a.birthtime)
      )
    }
  }
  return pages
}

export function filterByTitle(search = '', list = []) {
  const result = {}
  const pages = JSON.parse(JSON.stringify(list))
  for (let prop in pages) {
    const pageList = pages[prop]
    if (result[prop] == null) {
      result[prop] = []
    }
    const queryList = search
      ? search.replace(/\s+/g, ' ').toLowerCase().split(' ')
      : []
    result[prop] =
      queryList.length > 0 ? filterList(queryList, pageList) : pageList

    if (result[prop].length === 0) {
      delete result[prop]
    }
  }

  return result
}

export function filterList(queryList, list = []) {
  if (typeof queryList === 'string') {
    queryList = queryList.replace(/\s+/g, ' ').toLowerCase().split(' ')
  }
  const cached = {} // map<string, boolean>
  return list
    .map((page) => {
      let text = $(`<p>${page.title || page.text || page.value}</p>`)
        .text()
        .toLowerCase()
      // 去重
      if (cached[text]) {
        return
      }
      if (queryList.every((q) => text.indexOf(q.toLowerCase()) > -1)) {
        const r = new RegExp('(' + queryList.join('|') + ')', 'ig')
        page.title = text.replace(r, `<span class="hl-word">$1</span>`)
        cached[text] = true
        return { ...page }
      }
    })
    .filter(Boolean)
}