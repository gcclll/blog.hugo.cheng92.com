$(function () {
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)')
    .matches
    ? 'github-dark'
    : 'github-light'

  const preferredThemeId = 'preferred-color-scheme'

  const url = new URL(location.href)
  // slice session from query string
  const session = url.searchParams.get('utterances')
  if (session) {
    localStorage.setItem('utterances-session', session)
    url.searchParams.delete('utterances')
    history.replaceState(undefined, document.title, url.href)
  }

  let script = document.currentScript
  if (script == null) {
    script = document.querySelector('#utt-client')
  }

  // gather script element's attributes
  const attrs = {}
  for (let i = 0; i < script.attributes.length; i++) {
    const attribute = script.attributes.item(i)
    if (attribute) {
      attrs[attribute.name.replace(/^data-/, '')] = attribute.value // permit using data-theme instead of theme.
    }
  }

  if (attrs.theme === preferredThemeId) {
    attrs.theme = preferredTheme
  }
  console.log(attrs, 123)

  // gather page attributes
  const canonicalLink = document.querySelector(`link[rel='canonical']`)
  attrs.url = canonicalLink
    ? canonicalLink.href
    : url.origin + url.pathname + url.search
  attrs.origin = url.origin
  attrs.pathname =
    url.pathname.length < 2
      ? 'index'
      : url.pathname.substr(1).replace(/\.\w+$/, '')
  attrs.title = document.title
  const descriptionMeta = document.querySelector(`meta[name='description']`)
  attrs.description = descriptionMeta ? descriptionMeta.content : ''
  // truncate descriptions that would trigger 414 "URI Too Long"
  const len = encodeURIComponent(attrs.description).length
  if (len > 1000) {
    attrs.description = attrs.description.substr(
      0,
      Math.floor((attrs.description.length * 1000) / len)
    )
  }
  const ogtitleMeta = document.querySelector(
    `meta[property='og:title'],meta[name='og:title']`
  )
  attrs['og:title'] = ogtitleMeta ? ogtitleMeta.content : ''
  attrs.session = session || localStorage.getItem('utterances-session') || ''

  // create the standard utterances styles and insert them at the beginning of the
  // <head> for easy overriding.
  // NOTE: the craziness with "width" is for mobile safari :(
  document.head.insertAdjacentHTML(
    'afterbegin',
    `<style>
    .utterances {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      max-width: 760px;
      margin-left: auto;
      margin-right: auto;
    }
    .utterances-frame {
      color-scheme: light;
      position: absolute;
      left: 0;
      right: 0;
      width: 1px;
      min-width: 100%;
      max-width: 100%;
      height: 100%;
      border: 0;
    }
  </style>`
  )

  // create the comments iframe and it's responsive container
  const utterancesOrigin = 'https://utteranc.es'
  const frameUrl = `${utterancesOrigin}/utterances.html`
  script.insertAdjacentHTML(
    'afterend',
    `<div class="utterances">
    <iframe class="utterances-frame" title="Comments" scrolling="no" src="${frameUrl}?${new URLSearchParams(
      attrs
    )}" loading="lazy"></iframe>
  </div>`
  )
  const container = script.nextElementSibling
  script.parentElement.removeChild(script)

  // adjust the iframe's height when the height of it's content changes
  addEventListener('message', (event) => {
    if (event.origin !== utterancesOrigin) {
      return
    }
    const data = event.data
    if (data && data.type === 'resize' && data.height) {
      container.style.height = `${data.height}px`
    }
  })
})
