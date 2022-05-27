// 解析 ~/.emacs.d/site-lisp/config/init-general-key.el 中所有的 bindingkeys
// 到 /assets/js/stats/ 中
// 在 [[https://blog.cheng92.com/posts/emacs_all_keybindings.html][Emacs All Keybindings]] 

const fs = require('fs')

fs.readFile("~/.emacs.d/site-lisp/config/init-general-key.el", {
  encoding: 'utf8'
}, (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data, 'data')
})
