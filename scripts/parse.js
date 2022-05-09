/** jsx?|tsx? file header */

const fs = require('fs')
const HTMLParser = require('node-html-parser')

const add0 = (s) => (String(s).length === 1 ? '0' + s : s)
function formatTime(str, format = 'YYYY-MM-DD hh:mm:ss') {
  const d = new Date(str)
  const year = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  const h = d.getHours()
  const ms = d.getMinutes()
  const ss = d.getSeconds()

  return format
    .replace(/yyyy/i, year)
    .replace('MM', add0(m))
    .replace(/dd/i, add0(day))
    .replace('hh', add0(h))
    .replace('mm', add0(ms))
    .replace('ss', add0(ss))
}

function parseHTMLFiles() {
  return new Promise((resolve, reject) => {
    fs.readdir('./posts/', (err, files) => {
      if (err) {
        reject(err)
        return
      }

      const ps = []
      files.map((file) => {
        if (/^\./.test(file)) {
          return
        }
        ps.push(
          new Promise((resolve, reject) => {
            const path = `./posts/${file}`
            fs.readFile(
              path,
              {
                encoding: 'utf8'
              },
              (err, data) => {
                if (err) {
                  reject(err)
                  return
                }
                const html = data.toString()
                const root = HTMLParser.parse(html)
                fs.stat(path, (err, stats) => {
                  if (!err) {
                    const { ctime, birthtime } = stats
                    resolve({
                      file,
                      root,
                      stats: {
                        ctime,
                        birthtime,
                        updatedAt: formatTime(ctime),
                        createdAt: formatTime(birthtime)
                      }
                    })
                  }
                })
              }
            )
          })
        )
      })
      Promise.all(ps).then(resolve, reject)
    })
  })
}

function trim(s) {
  return s
    .replace(/\n/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^\d[.\d\s]+/g, '')
}

function findIDLinks(root, filename) {
  return root
    .querySelectorAll('span[id],h2[id],h3[id],h4[id]')
    .map((e) => {
      const o = {
        text: trim(e.text),
        tagName: e.tagName,
        ...e.attributes,
        filename
      }

      if (!o.id || !o.text) return null

      const tag = e.querySelector('span.tag')
      if (tag) {
        o.tags = tag
          .querySelectorAll('span')
          .map((t) => t && t.text)
          .filter(Boolean)
      }
      return o
    })
    .filter(Boolean)
}

function findALinks(root, filename) {
  return root
    .querySelectorAll('a')
    .map((a) => {
      const item = {
        text: trim(a.text),
        url: a.attributes.href,
        tag: a.tagName,
        filename
      }

      if (item.text === ' ') {
        item.text = item.url
      }

      return item
    })
    .filter((a) => a.url && a.text)
}

function findTOC(root, file) {
  if (file !== 'home.html') {
    return null
  }
  return root
    .querySelector('#table-of-contents')
    .querySelectorAll('ul>li')
    .map((li) => {
      const a = li.querySelector('a')
      const { href } = a.attributes
      return {
        text: trim(a.text),
        url: href
      }
    })
    .filter((a) => a.url && a.text)
}

function parseRoots(roots) {
  const stats = {}
  roots.forEach((item) => {
    const name = item.file
    if (stats[name] == null) {
      stats[name] = {}
    }
    const file = stats[name]
    file.IDLinks = findIDLinks(item.root, name)
    file.aLinks = findALinks(item.root, name)
    file.toc = findTOC(item.root, name)
    fs.writeFile(
      `./assets/js/stats/${name}.js`,
      `window.$stats=window.$stats||{};window.$stats['${name}']=${JSON.stringify(
        file
      )}`,
      {
        encoding: 'utf8'
      },
      handleError
    )
  })

  fs.writeFile(
    `./assets/js/dist/stats.js`,
    `window.$pages=${JSON.stringify(
      roots.reduce((o, next) => {
        const { birthtime, ctime, updatedAt } = next.stats
        const d = new Date(birthtime)
        let month = d.getMonth() + 1,
          year = d.getFullYear(),
          day = d.getDate()

        month = add0(month)
        day = add0(day)

        let category = [],
          tags = []
        const meta = next.root.querySelector('meta[name=category]')
        if (meta) {
          category = (meta.getAttribute('content') || '').split(',')
        }
        const metaTag = next.root.querySelector('meta[name=tags]')
        if (metaTag) {
          tags = (metaTag.getAttribute('content') || '').split(',')
        }
        let createdAt = next.root.querySelector('meta[name=createdAt]')
        if (createdAt) {
          createdAt = createdAt.getAttribute('content')
        }

        console.log(next.file)
        if (checkValidPage(next)) {
          o[next.file] = {
            createdAt,
            updatedAt,
            birthtime,
            ctime,
            month,
            year,
            day,
            date: `${month}-${day}`,
            title: next.root.querySelector('.title').text,
            category,
            tags
          }
        }

        return o
      }, {})
    )}`,
    'utf8',
    handleError
  )

  return stats
}

function handleError(err) {
  if (err) {
    console.error('[Error]', err)
  }
}

parseHTMLFiles().then(parseRoots, handleError)

function checkValidPage(next) {
  if (['index.html'].includes(next.file)) return

  if (/^\./.test(next.file)) return

  // valid
  return next
}
