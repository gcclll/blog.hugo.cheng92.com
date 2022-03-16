/** jsx?|tsx? file header */

const { execSync } = require('child_process')
const fs = require('fs')

let code = 0
fs.watch(
  './apps/',
  {
    recursive: true
  },
  (e, filename) => {
    if (
      filename &&
      e === 'change' &&
      /(vue|js|ts|md|scss|css)$/.test(filename)
    ) {
      console.log(`[${filename}] changed`)

      if (code !== 0) {
        console.warn('process is building or some error occured...')
        return
      }
      code = -1
      try {
        const output = execSync(
          'cd ~/github/mine/blog.cheng92.com/apps/vue && pnpm run build && cd ../.. && npm run pub'
        )
        console.log(output)
        code = 0
      } catch (e) {
        code = -1
        console.warn(e)
      }
    }
  }
)
console.log('Listening apps change...')
