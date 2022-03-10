/** jsx?|tsx? file header */

const fs = require('fs')
const HTMLParser = require('node-html-parser')

function parseHTMLFiles() {
  return new Promise((resolve, reject) => {
    fs.readdir('./posts/', (err, files) => {
      if (err) {
        reject(err)
        return
      }

      const ps = []
      files.map((file) => {
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
                    resolve({ file, root, stats: { ctime, birthtime } })
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

function findALinks(root) {
  return root
    .querySelectorAll('a')
    .map((a) => ({
      text: trim(a.text),
      url: a.attributes.href,
      tag: a.tagName
    }))
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
        const { birthtime, ctime } = next.stats
        const d = new Date(birthtime)
        let month = d.getMonth() + 1,
          year = d.getFullYear(),
          day = d.getDate()
        month = String(month).length < 2 ? `0${month}` : month

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

        o[next.file] = {
          birthtime,
          ctime,
          month,
          year,
          day,
          date: `${month}-${day}`,
          title: next.root.querySelector('title').text,
          category,
          tags
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
