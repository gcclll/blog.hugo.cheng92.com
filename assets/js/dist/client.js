"use strict";

$(function () {
  var preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'github-dark' : 'github-light';
  var preferredThemeId = 'preferred-color-scheme';
  var url = new URL(location.href); // slice session from query string

  var session = url.searchParams.get('utterances');

  if (session) {
    localStorage.setItem('utterances-session', session);
    url.searchParams["delete"]('utterances');
    history.replaceState(undefined, document.title, url.href);
  }

  var script = document.currentScript;

  if (script == null) {
    script = document.querySelector('#utt-client');
  } // gather script element's attributes


  var attrs = {};

  for (var i = 0; i < script.attributes.length; i++) {
    var attribute = script.attributes.item(i);

    if (attribute) {
      attrs[attribute.name.replace(/^data-/, '')] = attribute.value; // permit using data-theme instead of theme.
    }
  }

  if (attrs.theme === preferredThemeId) {
    attrs.theme = preferredTheme;
  }

  console.log(attrs, 123); // gather page attributes

  var canonicalLink = document.querySelector("link[rel='canonical']");
  attrs.url = canonicalLink ? canonicalLink.href : url.origin + url.pathname + url.search;
  attrs.origin = url.origin;
  attrs.pathname = url.pathname.length < 2 ? 'index' : url.pathname.substr(1).replace(/\.\w+$/, '');
  attrs.title = document.title;
  var descriptionMeta = document.querySelector("meta[name='description']");
  attrs.description = descriptionMeta ? descriptionMeta.content : ''; // truncate descriptions that would trigger 414 "URI Too Long"

  var len = encodeURIComponent(attrs.description).length;

  if (len > 1000) {
    attrs.description = attrs.description.substr(0, Math.floor(attrs.description.length * 1000 / len));
  }

  var ogtitleMeta = document.querySelector("meta[property='og:title'],meta[name='og:title']");
  attrs['og:title'] = ogtitleMeta ? ogtitleMeta.content : '';
  attrs.session = session || localStorage.getItem('utterances-session') || ''; // create the standard utterances styles and insert them at the beginning of the
  // <head> for easy overriding.
  // NOTE: the craziness with "width" is for mobile safari :(

  document.head.insertAdjacentHTML('afterbegin', "<style>\n    .utterances {\n      position: relative;\n      box-sizing: border-box;\n      width: 100%;\n      max-width: 760px;\n      margin-left: auto;\n      margin-right: auto;\n    }\n    .utterances-frame {\n      color-scheme: light;\n      position: absolute;\n      left: 0;\n      right: 0;\n      width: 1px;\n      min-width: 100%;\n      max-width: 100%;\n      height: 100%;\n      border: 0;\n    }\n  </style>"); // create the comments iframe and it's responsive container

  var utterancesOrigin = 'https://utteranc.es';
  var frameUrl = "".concat(utterancesOrigin, "/utterances.html");
  console.log(new URLSearchParams(attrs));
  script.insertAdjacentHTML('afterend', "<div class=\"utterances\">\n    <iframe class=\"utterances-frame\" title=\"Comments\" scrolling=\"no\" src=\"".concat(frameUrl, "?").concat(new URLSearchParams(attrs), "\" loading=\"lazy\"></iframe>\n  </div>"));
  var container = script.nextElementSibling;
  script.parentElement.removeChild(script); // adjust the iframe's height when the height of it's content changes

  addEventListener('message', function (event) {
    if (event.origin !== utterancesOrigin) {
      return;
    }

    var data = event.data;

    if (data && data.type === 'resize' && data.height) {
      container.style.height = "".concat(data.height, "px");
    }
  });
});