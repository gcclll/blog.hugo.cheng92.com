/** jsx?|tsx? file header */

export const noop = () => {}
export function querySearch(queryString, cb, results = []) {
  const result = queryString
    ? results.filter(createFilter(queryString))
    : results
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
  const ts = window.$timestamp

  const pages = {}
  for (let page in ts) {
    const obj = ts[page]
    const month = obj.month
    if (pages[month] == null) {
      pages[month] = []
    }
    if (obj.file !== 'index.html') {
      pages[month].push(obj)
    }
  }
  return pages
}
