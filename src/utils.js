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

export const sortFn = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)

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

export function formatByDate(pages) {
  const result = {}
  if (pages && pages.length) {
    pages.forEach((page) => {
      if (!page.createdAt) {
        console.warn(
          `[Error:formatByDate] ${page.name} no createdAt meta header.`
        )
        return
      }
      const [year, month] = page.createdAt.match(/(\d{2,4})/g)
      const key = `${year}-${month}`

      if (result[key] == null) {
        result[key] = []
      }

      result[key].push({ ...page })
    })

    // sort
    Object.keys(result).forEach((key) => {
      result[key].sort(sortFn)
    })
  }
  return result
}

export function formatPages() {
  const ts = pages || window.$pages

  const pages = {}
  for (let page in ts) {
    const obj = ts[page]
    if (obj.createdAt) {
      const [year, month, date] = obj.createdAt.match(/(\d{2,4})/g)
      const key = `${year}-${month}`
      obj.dateTitle = `${month}-${date}`

      const url = obj.url || obj.href
      if (!url) obj.href = obj.url = page

      if (pages[key] == null) {
        pages[key] = []
      }
      pages[key].push({ ...obj })
    } else {
      console.warn(`[Error:formatPages] ${page} no page createdAt meta header.`)
    }
  }
  // sort by `timestamp`
  for (let prop in pages) {
    const arr = pages[prop]
    if (arr && arr.length) {
      pages[prop] = arr.sort(sortFn)
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
      let text = $(`<p>${page.title || page.text || page.value}</p>`).text()
      // .toLowerCase()
      // 去重
      if (cached[text]) {
        return
      }
      if (
        queryList.every((q) => text.toLowerCase().indexOf(q.toLowerCase()) > -1)
      ) {
        const r = new RegExp('(' + queryList.join('|') + ')', 'ig')
        page.title = text.replace(r, (match) => {
          const first = match[0]
          let word = match
          if (first >= 'A' && first <= 'Z') {
            word = `${match[0].toUpperCase() + match.substring(1)}`
          }
          return `<span class="hl-word">${word}</span>`
        })
        cached[text] = true
        return { ...page }
      }
    })
    .filter(Boolean)
}
