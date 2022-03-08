(function () {
  'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  /** jsx?|tsx? file header */
  function addValine() {
    // valine ///////////////////////////////////////////////////////////////////
    $('#content').append("\n    <button id=\"toggle-valine\" type=\"button\" class=\"btn btn-success\">\n      \u663E\u793A <a target=\"_blank\" href=\"https://valine.js.org/\">Valine</a> \u8BC4\u8BBA\u7CFB\u7EDF\n    </button>\n    <div id=\"vcomments\" style=\"display:none\"></div>\n    <script>\n      new Valine({\n          el: '#vcomments',\n          appId: 'dwjufJhAgWQzU3evb1th5SrC-gzGzoHsz',\n          appKey: 'z7BITHKt5oI9zuxdfp8X9tUN'\n      })\n    </script>"); // 监听事件

    $('#toggle-valine').click(function () {
      $('#vcomments').toggle();
    });
  }

  /** jsx?|tsx? file header */
  var noop = function noop() {};
  function querySearch(queryString, cb) {
    var results = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var result = queryString ? filterList(queryString, results) : results;
    cb(result);
  }
  function formatPages() {
    var ts = window.$pages;
    var pages = {};

    for (var page in ts) {
      var obj = ts[page];
      var month = obj.month,
          year = obj.year;
      var key = "".concat(year, "-").concat(String(month).length === 1 ? '0' + month : month);
      var url = obj.url || obj.href;
      if (!url) obj.href = obj.url = page;

      if (pages[key] == null) {
        pages[key] = [];
      }

      if (page !== 'index.html') {
        pages[key].push(_objectSpread2({}, obj));
      }
    } // sort by `timestamp`


    for (var prop in pages) {
      var arr = pages[prop];

      if (arr && arr.length) {
        pages[prop] = arr.sort(function (a, b) {
          return new Date(b.birthtime) - new Date(a.birthtime);
        });
      }
    }

    return pages;
  }
  function filterByTitle() {
    var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var result = {};
    var pages = JSON.parse(JSON.stringify(list));

    for (var prop in pages) {
      var pageList = pages[prop];

      if (result[prop] == null) {
        result[prop] = [];
      }

      var queryList = search ? search.replace(/\s+/g, ' ').toLowerCase().split(' ') : [];
      result[prop] = queryList.length > 0 ? filterList(queryList, pageList) : pageList;

      if (result[prop].length === 0) {
        delete result[prop];
      }
    }

    return result;
  }
  function filterList(queryList) {
    var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (typeof queryList === 'string') {
      queryList = queryList.replace(/\s+/g, ' ').toLowerCase().split(' ');
    }

    console.log(queryList, '1111');
    var cached = {}; // map<string, boolean>

    return list.map(function (page) {
      var text = $("<p>".concat(page.title || page.text || page.value, "</p>")).text().toLowerCase(); // 去重

      if (cached[text]) {
        return;
      }

      if (queryList.every(function (q) {
        return text.indexOf(q.toLowerCase()) > -1;
      })) {
        var r = new RegExp('(' + queryList.join('|') + ')', 'ig');
        page.title = text.replace(r, "<span class=\"hl-word\">$1</span>");
        cached[text] = true;
        return _objectSpread2({}, page);
      }
    }).filter(Boolean);
  }

  /** jsx?|tsx? file header */
  var config = {
    tocSelector: 'div[id^="outline-container-"]',
    ElementPlusOptions: {// size: 'small'
    },
    searchTmpl: "<div id=\"search\">Loading...</div>",
    isHome: /home\.html$/.test(location.pathname)
  };

  // 包含页面创建时间，用来创建主页的 TOC

  var pages = formatPages();
  var filename = location.pathname.replace(/.*\//g, '');
  var loaded = false;

  function loadPageStats(cb) {
    if (loaded) {
      ElementPlus.ElMessage({
        type: 'success',
        message: '全站资源已就绪。'
      });
      return;
    }

    var path = '/assets/js/stats';
    var html = '';

    for (var page in window.$pages) {
      var jsFile = "".concat(path, "/").concat(page, ".js");
      html += "<script src=\"".concat(jsFile, "\" type=\"text/javascript\" sync></script>");
    }

    $('head').append(html);
    loaded = true;
    if (cb) cb(window.$stats, window.$pages);

    for (var prop in window.$stats) {
      var _window$$stats$prop = window.$stats[prop],
          IDLinks = _window$$stats$prop.IDLinks,
          aLinks = _window$$stats$prop.aLinks;
      IDLinks.forEach(function (link) {
        return cached.whole.push(_objectSpread2({}, link));
      });
      aLinks.forEach(function (link) {
        return cached.whole.push(_objectSpread2({}, link));
      });
    }

    cached.current = cached.whole.filter(function (result) {
      var url = result.url,
          text = result.text,
          value = result.value,
          href = result.href,
          id = result.id,
          filename = result.filename;
      result.value = value || text;
      result.url = url || href || "".concat(filename, "#").concat(id);
      return result.filename === cached.filename;
    });
    console.log(cached, 333);
  } // 取出由 parse.py 生成的网站资源信息


  var cached = {
    pages: pages,
    loadPageStats: loadPageStats,
    filename: filename,
    current: [],
    // 本文
    whole: [] // 全站

  };

  var WHOLE = '1';
  var CURRENT = '2';
  var Search = Vue.defineComponent({
    template: "\n    <el-dialog  v-model=\"dialogVisible\" @open=\"clean\" @close=\"clean\" title=\"\u5168\u6587(\u7AD9)\u641C\u7D22\">\n     <div v-loading=\"loading\" element-loading-text=\"\u5168\u7AD9\u8D44\u6E90\u52A0\u8F7D\u4E2D\uFF0C\u8BF7\u8010\u5FC3\u7B49\u5F85...\">\n      <el-input autofocus v-model=\"search\" placeholder=\"\u8BF7\u8F93\u5165\u641C\u7D22\u5185\u5BB9(\u6682\u53EA\u652F\u6301\u6807\u9898\u3001\u94FE\u63A5\u3001\u951A\u70B9)\">\n        <template #prepend>\n          <el-select v-model=\"scope\" placeholder=\"Select\" style=\"width:80px\">\n            <el-option label=\"\u672C\u6587\" value=\"1\"/>\n            <el-option label=\"\u5168\u7AD9\" value=\"2\"/>\n          </el-select>\n        </template>\n        <template #append><img class=\"my-search-icon\" src=\"/assets/img/search.svg\"></template>\n      </el-input>\n      <ul class=\"search-list\" style=\"max-height:500px;overflow-y:scroll;text-align:left\">\n        <li v-for=\"(result, i) in filterResults\" :key=\"i\" @click=\"locate(result.url)\">\n          <div class=\"result-value\" v-html=\"result.title\"></div>\n          <div class=\"result-tags\">\n            <el-tag v-if=\"result.filename&&!isCurrentPage(result.filename)\" effect=\"dark\" type=\"info\">{{result.filename}}</el-tag>\n          </div>\n        </li>\n      </ul>\n     </div>\n    </el-dialog>",
    setup: function setup() {
      var state = Vue.reactive({
        results: [],
        filterResults: [],
        // 实时搜索到的数据
        search: '',
        // 搜索关键词
        dialogVisible: false,
        loading: true,
        scope: WHOLE,
        // 1 - 本文, 2 - 全站
        stats: {},
        pages: {}
      });
      Vue.onBeforeMount(function () {
        console.log('on before mount');
      });
      Vue.onMounted(function () {
        $(document.body).on('keydown', keydownHandler);
      });

      function keydownHandler(e) {
        if (e.metaKey && e.keyCode === 75) {
          state.dialogVisible = true;
          cached.loadPageStats();
          state.loading = false;
          state.results = state.scope === WHOLE ? cached.whole : cached.current;
        }
      }

      Vue.onUnmounted(function () {
        $(document.body).off('keydown', keydownHandler);
      });
      Vue.watch(function () {
        return state.scope;
      }, function (val) {
        return state.results = val === CURRENT ? cached.current : cached.whole;
      });
      Vue.watch(function () {
        return state.search;
      }, function (newVal, oldVal) {
        if (newVal) {
          // 当前输入的是空格，不需要触发搜索
          if (oldVal && newVal.replace(new RegExp("^".concat(oldVal)), '').trim() === '') {
            return;
          }

          querySearch(newVal, function (results) {
            state.filterResults = results;
          }, state.results);
        } else {
          state.filterResults = [];
        }
      });

      var clean = function clean() {
        state.filterResults = [];
        state.search = '';
      };

      return _objectSpread2(_objectSpread2({}, Vue.toRefs(state)), {}, {
        clean: clean,
        isCurrentPage: function isCurrentPage(file) {
          return new RegExp("".concat(file, "$")).test(location.pathname);
        },
        locate: function locate(link) {
          location.href = link;
          clean();
          state.dialogVisible = false;
          console.log({
            link: link
          }, 'locate');
        },
        querySearch: function querySearch$1(qs, cb) {
          return querySearch(qs, cb, state.results);
        },
        handleSelect: function handleSelect(item) {
          if (item.link) {
            location.href = item.href;
            state.search = '';
          }
        }
      });
    }
  });

  /** jsx?|tsx? file header */
  function home() {
    var handleNotHome = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    // 是不是主页 home.html
    if (!config.isHome) {
      return handleNotHome();
    }

    setTimeout(function () {
      $('#content').append($('#postamble'));
      $('#postamble').css({
        position: 'relative',
        marginTop: '1rem'
      });
      $('#postamble').show();
      $('#postamble').css({
        width: '100%',
        textAlign: 'center'
      });
    }, 500); // 收集所有标题(id包含 'outline-container-' 且以它开头的 div)
    // $(config.searchTmpl).insertAfter('h1.title')

    $("<div id=\"vue-toc\"></div>").insertAfter('h1.title');

    var _pages = JSON.parse(JSON.stringify(cached.pages));

    Vue.createApp({
      template: "\n        <el-input\n          class=\"inline-input search-input\"\n          v-model=\"search\" placeholder=\"\u641C\u7D22\u672C\u6587(\u8BF7\u6309Alt/Cmd+K \u5168\u7AD9\u641C\u7D22)\">\n          <template #suffix>\n            <img class=\"command-k\" src=\"/assets/img/command.svg\"/><span class=\"command-k\">K</span>\n          </template>\n        </el-input>\n        <el-menu class=\"el-toc-menu\">\n          <el-menu-item-group v-for=\"(list, month) in pages\" :key=\"month\" :title=\"month\">\n            <el-menu-item v-for=\"(page, i) in list\" :index=\"i+''\" :key=\"page.timestamp\">\n            <span class=\"date\">{{page.date}}</span>\n            <span class=\"title\"><a :href=\"page.url\" v-html=\"page.title\"></a></span>\n            </el-menu-item>\n          </el-menu-item-group>\n        </el-menu>\n        <div id=\"search\"><search/></div>",
      components: {
        Search: Search
      },
      data: function data() {
        return {
          search: ''
        };
      },
      computed: {
        pages: function pages() {
          return filterByTitle(this.search, _pages);
        }
      }
    }).use(ElementPlus).mount('#vue-toc');
  }

  /** jsx?|tsx? file header */
  function loadSearchApp() {
    // search component
    Vue.createApp({
      template: "\n      <el-autocomplete\n        v-model=\"search\"\n        :fetch-suggestions=\"querySearch\"\n        :trigger-on-focus=\"false\"\n        class=\"inline-input search-input\"\n        placeholder=\"\u5168\u6587\u6216\u672C\u6587\u4E2D\u641C\u7D22...\"\n        @select=\"handleSelect\"\n      >\n        <template #suffix>\n          <img class=\"command-k\" src=\"/assets/img/command.svg\"/><span class=\"command-k\">K</span>\n        </template>\n      </el-autocomplete>\n      <search/>",
      components: {
        Search: Search
      },
      data: function data() {
        return {
          search: ''
        };
      },
      methods: {
        handleSelect: function handleSelect(item) {
          this.search = '';
          location.href = item.href;
        }
      }
    }).use(ElementPlus, config.ElementPlusOptions).mount('#search');
  }

  $(function () {
    // 检测是不是移动端
    var md = null,
        isMobile = false;

    if ((typeof MobileDetect === "undefined" ? "undefined" : _typeof(MobileDetect)) !== undefined) {
      md = new MobileDetect(window.navigator.userAgent);
      isMobile = md.mobile();
    } // 主页


    home(function () {
      // 非主页搜索放在 TOC 标题下面，主页的放在内容标题下面
      $('#table-of-contents>h2').append(config.searchTmpl); // 底部个人信息

      $('#postamble').show(); // 搜索组件

      loadSearchApp();
    }); // 基于 github,  gcclll/cheng92-comments  的评论系统

    $('#content').append("<script id=\"utt-client\" type=\"text/javascript\" src=\"/assets/js/dist/client.js\" issue-term=\"pathname\" repo=\"gcclll/cheng92-comments\" theme=\"github-light\" async></script>"); // 添加基于 valine 的评论系统

    addValine(); // 移动端

    if (isMobile) {
      $('h1.title').append("<img class=\"title-phone\" src=\"/assets/img/phone.svg\"/>");
    } // 修改 span 标记颜色


    $('span').each(function () {
      var bgColor = $(this).css('background-color');

      if (bgColor === 'rgb(35, 39, 46)') {
        $(this).css('background-color', 'rgba(35, 39, 46, .1)');
      }
    }); // 添加我的 github badge

    $('#postamble .author').append($('<span class="follows"><a href="https://www.github.com/gcclll?tab=followers">' + '<img src="https://img.shields.io/github/followers/gcclll?style=social"></a></span>'));
  });

})();
