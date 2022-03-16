/** jsx?|tsx? file header */

const fs = require('fs')
const HTMLParser = require('node-html-parser')

function parseApps() {
  return new Promise((resolve, reject) => {
    fs.readdir('./apps/', (err, dirs) => {
      if (err) {
        reject(err)
        return
      }

      const ps = []
      dirs.map((appName) => {
        ps.push(
          new Promise((resolve, reject) => {
            const path = `./apps/${appName}/dist/index.html`
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
                      appName,
                      file: appName,
                      stats: { ctime, birthtime },
                      scripts: root
                        .querySelectorAll('head>script')
                        .map((s) => ({
                          ...s.attributes
                        })),
                      links: root.querySelectorAll('head>link').map((l) => ({
                        ...l.attributes
                      }))
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

function handleError() {}

parseApps().then((roots) => {
  fs.writeFile(
    './assets/js/dist/apps.js',
    `window.$apps=${JSON.stringify(
      roots.reduce((result, root) => {
        result[root.appName] = root
        return result
      }, {})
    )}`,
    'utf8',
    handleError
  )
})
