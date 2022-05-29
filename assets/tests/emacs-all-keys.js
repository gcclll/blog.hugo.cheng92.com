window.$keyMaps = {
  // "title": []
}

// 来自 parse-emacs.js 解析出来的，要合并
if (window.$bindings) {
  Object.assign(window.$keyMaps, window.$bindings)
}

console.log(window.$keyMaps, 'all key maps')
