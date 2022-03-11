/** jsx?|tsx? file header */

const config = {
  tocSelector: 'div[id^="outline-container-"]',
  ElementPlusOptions: {
    // size: 'small'
  },
  searchTmpl: `<div id="search">Loading...</div>`,
  isHome: /home\.html$/.test(location.pathname),
  enum: {},
  tabs: [
    { label: '时间戳', value: 'archives' },
    { label: '分类', value: 'category' },
    { label: '标签', value: 'tags' }
  ]
}

export default config
