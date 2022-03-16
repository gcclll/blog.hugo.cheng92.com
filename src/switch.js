/** jsx?|tsx? file header */

export function switchTheme() {
  $(
    `<span id="theme-switcher"><svg t="1647398734330" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5311" width="200" height="200"><path d="M742.4 691.2c-12.8-12.8-25.6-12.8-38.4 0-51.2 51.2-115.2 83.2-185.6 83.2-128 0-230.4-89.6-256-204.8l44.8 0C320 569.6 332.8 550.4 320 537.6L243.2 428.8c-6.4-12.8-25.6-12.8-32 0L134.4 537.6c-12.8 12.8 0 32 19.2 32l51.2 0C224 716.8 358.4 832 512 832c89.6 0 166.4-32 230.4-96C748.8 723.2 748.8 704 742.4 691.2L742.4 691.2zM281.6 332.8c12.8 12.8 25.6 12.8 38.4 0C371.2 275.2 441.6 249.6 512 249.6c128 0 230.4 89.6 256 204.8l-44.8 0c-19.2 0-25.6 19.2-19.2 32l76.8 108.8c6.4 12.8 25.6 12.8 32 0l76.8-108.8c12.8-12.8 0-32-19.2-32l-51.2 0C800 307.2 665.6 192 512 192 422.4 192 345.6 230.4 281.6 288 275.2 300.8 275.2 320 281.6 332.8L281.6 332.8zM627.2 556.8c0 25.6-25.6 51.2-51.2 51.2l-128 0c-25.6 0-51.2-25.6-51.2-51.2L396.8 473.6c0-25.6 25.6-51.2 51.2-51.2l128 0c25.6 0 51.2 25.6 51.2 51.2L627.2 556.8 627.2 556.8zM627.2 556.8" p-id="5312" fill="#2c2c2c"></path></svg></span>`
  ).insertAfter('h1.title+p>a')
  const themes = ['', 'dark'],
    n = themes.length
  let i = 0,
    timer
  $('#theme-switcher>svg').click(function () {
    console.log('clicked')
    if (++i >= n) {
      i = 0
    }
    const theme = themes[i]
    $('html').attr('class', '').attr('class', theme)
    $(this)
      .css('transform', 'rotate(360deg)')
      .css('transition', 'transform .5s linear')
    $('#theme-switcher .theme-name').remove()
    $('#theme-switcher').append(`<span class="theme-name">${theme}</span>`)

    clearTimeout(timer)
    timer = setTimeout(() => {
      $(this).css('transform', 'none').css('transition', 'none')
    }, 800)
  })
}
