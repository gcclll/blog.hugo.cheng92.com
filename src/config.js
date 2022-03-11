/** jsx?|tsx? file header */

import { Calendar, Clock, CollectionTag, Close } from '@element-plus/icons-vue'

const config = {
  tocSelector: 'div[id^="outline-container-"]',
  ElementPlusOptions: {
    // size: 'small'
  },
  searchTmpl: `<div id="search">Loading...</div>`,
  isHome: /home\.html$/.test(location.pathname),
  enum: {},
  tabs: [
    { label: '时间戳', value: 'archives', Icon: Clock },
    { label: '分类', value: 'category', Icon: Calendar },
    { label: '标签', value: 'tags', Icon: CollectionTag }
  ],
  Icons: {
    Close
  }
}

config.tabs.forEach((tab) => {
  tab.Icon = Vue.markRaw(tab.Icon)
})

Object.keys(config.Icons).forEach((key) => {
  config.Icons[key] = Vue.markRaw(config.Icons[key])
})

export default config
