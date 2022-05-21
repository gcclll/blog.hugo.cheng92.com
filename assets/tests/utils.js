/** jsx?|tsx? file header */

const debugEl = document.getElementById('debug')
window.log = (msg, ele) => {
  if (ele) {
    ele.innerHTML = `${debugEl.innerHTML}<pre><code>${
      typeof msg === 'object' ? syntaxHighlight(msg) : msg
    }</code></pre>`
  }
}

function syntaxHighlight(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2)
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = 'number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'
        } else {
          cls = 'string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean'
      } else if (/null/.test(match)) {
        cls = 'null'
      }
      return '<span class="' + cls + '">' + match + '</span>'
    }
  )
}

function filterList(queryList, list = [], cacheMap) {
  if (typeof queryList === 'string') {
    queryList = queryList.replace(/\s+/g, ' ').toLowerCase().split(' ')
  }
  const cacheKey = queryList.join('-')
  if (cacheMap && cacheMap[cacheKey]) return cacheKey

  const cached = {} // map<string, boolean>

  const result = list
    .map((page) => {
      const isString = typeof page === 'string'
      const title =
        typeof page === 'object' ? page.title || page.text || page.value : page
      let text = $(`<p>${title}</p>`).text()
      // .toLowerCase()
      // 去重
      if (cached[text]) {
        return
      }

      if (
        queryList.every(
          (q) =>
            text.toLowerCase().indexOf(q.replace(/^\^|\$$/, '').toLowerCase()) >
            -1
        )
      ) {
        const r = new RegExp('(' + queryList.join('|') + ')', 'ig')
        let result = text.replace(r, (match) => {
          const first = match[0]
          let word = match
          if (first >= 'A' && first <= 'Z') {
            word = `${match[0].toUpperCase() + match.substring(1)}`
          }
          return `<span class="hl-word">${word}</span>`
        })
        cached[text] = true
        return isString ? result : { ...page, title: result }
      }
    })
    .filter(Boolean)

  if (cacheMap) {
    cacheMap[cacheKey] = result
  }

  return result
}
