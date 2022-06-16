// 解析 ~/.emacs.d/site-lisp/config/init-general-key.el 中所有的 bindingkeys
// 到 /assets/js/stats/ 中
// 在 [[https://blog.cheng92.com/posts/emacs_all_keybindings.html][Emacs All Keybindings]]
const fs = require('fs')

fs.readFile(
  `${process.env.HOME}/.emacs.d/my.keybindings`,
  {
    encoding: 'utf8'
  },
  (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const squares = data.match(/{{[^}]+}}/gi) || []

    if (squares.length) {
      const result = {}
      squares.forEach((text) => {
        // {{ hint ##
        // ...
        // }}
        const trimed = text.trim()
        // 请确保是以正确的格式写的
        trimed.match(/{{ ([^#]+) ##/gi)[0]
        const title = RegExp.$1
        const keyList = trimed
          .split('\n')
          .filter((it) => {
            return !/^;;/.test(it.trim())
          })
          // .map((it) => it.trim().replace(/<([a-z0-9]+)>/i, '$1'))

        result[title] = keyList.slice(1, keyList.length - 1).filter(s => s.trim())
      })

      fs.writeFile(
        './assets/js/dist/emacs.js',
        `window.$bindings=${JSON.stringify(result)}`,
        'utf8',
        (err) => {
          if (err) console.warn(err)
        }
      )
    }
  }
)
