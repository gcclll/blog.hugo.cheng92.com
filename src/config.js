/** jsx?|tsx? file header */

export default {
  tocSelector: 'div[id^="outline-container-"]',
  ElementPlusOptions: {
    // size: 'small'
  },
  searchTmpl: `<div id="search">Loading...</div>`,
  isHome: /home\.html$/.test(location.pathname)
}