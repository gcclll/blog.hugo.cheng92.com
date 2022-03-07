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
    var result = queryString ? results.filter(createFilter(queryString)) : results;
    cb(result);
  }
  function createFilter(queryString) {
    return function (item) {
      // 支持叠加搜索
      var queryList = queryString.split(' ');
      var lower = item.value.toLowerCase();
      return queryList.every(function (val) {
        return lower.indexOf(val.toLowerCase()) > -1;
      });
    };
  }
  function dedupStats() {
    var results = [];
    window.$stats.forEach(function (stat) {
      if (!results.find(function (r) {
        return r && r.value === stat.value;
      })) {
        results.push(stat);
      }
    });
    return results;
  }
  function formatPages() {
    var ts = window.$timestamp;
    var pages = {};

    for (var page in ts) {
      var obj = ts[page];
      var month = obj.month;

      if (pages[month] == null) {
        pages[month] = [];
      }

      if (obj.file !== 'index.html') {
        pages[month].push(obj);
      }
    }

    return pages;
  }

  /** jsx?|tsx? file header */
  var config = {
    tocSelector: 'div[id^="outline-container-"]',
    ElementPlusOptions: {// size: 'small'
    },
    searchTmpl: "<div id=\"search\">Loading...</div>",
    isHome: /home\.html$/.test(location.pathname)
  };

  /** jsx?|tsx? file header */

  var deduped = dedupStats(); // 包含页面创建时间，用来创建主页的 TOC

  var pages = formatPages(); // 取出由 parse.py 生成的网站资源信息

  var cached = {
    pages: pages,
    current: deduped.reduce(function (arr, curr) {
      if (curr && curr.file && new RegExp("".concat(curr.file, "$")).test(location.pathname)) {
        arr.push(curr);
      }

      return arr;
    }, []),
    // 本文
    whole: deduped // 全站

  };

  var Search = Vue.defineComponent({
    template: "\n    <el-dialog v-model=\"dialogVisible\" @open=\"clean\" @close=\"clean\" title=\"\u5168\u6587(\u7AD9)\u641C\u7D22\">\n      <el-input autofocus v-model=\"search\" placeholder=\"\u8BF7\u8F93\u5165\u641C\u7D22\u5185\u5BB9(\u6682\u53EA\u652F\u6301\u6807\u9898\u3001\u94FE\u63A5\u3001\u951A\u70B9)\">\n        <template #prepend>\n          <el-select v-model=\"scope\" placeholder=\"Select\" style=\"width:80px\">\n            <el-option label=\"\u672C\u6587\" value=\"1\"/>\n            <el-option label=\"\u5168\u7AD9\" value=\"2\"/>\n          </el-select>\n        </template>\n        <template #append><img class=\"my-search-icon\" src=\"/assets/img/search.svg\"></template>\n      </el-input>\n      <ul class=\"search-list\" style=\"max-height:500px;overflow-y:scroll;text-align:left\">\n        <li v-for=\"(result, i) in filterResults\" :key=\"result.value\" @click=\"locate(result.link)\">\n          <div class=\"result-value\" v-html=\"highlight(result.value)\"></div>\n          <div class=\"result-tags\">\n            <el-tag v-if=\"!isCurrentPage(result.file)\" effect=\"dark\" type=\"info\">{{result.file}}</el-tag>\n          </div>\n        </li>\n      </ul>\n    </el-dialog>",
    setup: function setup() {
      var state = Vue.reactive({
        results: [],
        filterResults: [],
        search: '',
        dialogVisible: false,
        scope: '2' // 1 - 本文, 2 - 全站

      });
      Vue.onMounted(function () {
        state.results = state.scope === '1' ? cached.current : cached.whole;
        $(document.body).on('keydown', keydownHandler);
      });

      function keydownHandler(e) {
        if (e.metaKey && e.keyCode === 75) {
          state.dialogVisible = true;
        }
      }

      Vue.onUnmounted(function () {
        $(document.body).off('keydown', keydownHandler);
      });
      Vue.watch(function () {
        return state.scope;
      }, function (val) {
        return state.results = val === '1' ? cached.current : cached.whole;
      });
      Vue.watch(function () {
        return state.search;
      }, function (newVal) {
        if (newVal) {
          querySearch(newVal, function (results) {
            state.filterResults = results;
            console.log(state, '1000');
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
        // 高亮匹配内容
        highlight: function highlight(value) {
          var words = state.search.split(' ');
          words.forEach(function (word) {
            value = value.replace(new RegExp("".concat(word), 'gi'), "<span class=\"hl-word\">".concat(word, "</span>"));
          });
          return value;
        },
        isCurrentPage: function isCurrentPage(file) {
          return new RegExp("".concat(file, "$")).test(location.pathname);
        },
        locate: function locate(link) {
          location.href = link;
          clean();
          state.dialogVisible = false;
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

  function home() {
    var handleNotHome = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    // 是不是主页 home.html
    if (!config.isHome) {
      return handleNotHome();
    }

    $('#table-of-contents').hide();
    setTimeout(function () {
      $('#content').append($('#postamble'));
      $('#postamble').css({
        position: 'relative',
        marginTop: '1rem'
      });
      $('#postamble').show();
      $('#content').css({
        margin: 'auto'
      });
      $('#postamble').css({
        width: '100%',
        textAlign: 'center'
      });
    }, 500); // 收集所有标题(id包含 'outline-container-' 且以它开头的 div)
    // $(config.searchTmpl).insertAfter('h1.title')

    $("<div id=\"vue-toc\"></div>").insertAfter('h1.title');
    $(config.tocSelector).remove();

    var _pages = JSON.parse(JSON.stringify(cached.pages));

    Vue.createApp({
      template: "\n        <el-input\n          class=\"inline-input search-input\"\n          v-model=\"search\" placeholder=\"\u8BF7\u8F93\u5165\u6807\u9898\u641C\u7D22\">\n          <template #suffix>\n            <img class=\"command-k\" src=\"/assets/img/command.svg\"/><span class=\"command-k\">K</span>\n          </template>\n        </el-input>\n        <el-menu clas=\"el-toc-menu\">\n          <el-menu-item-group v-for=\"(list, month) in pages\" :key=\"month\" :title=\"month\">\n            <el-menu-item v-for=\"(page, i) in list\" :index=\"i+''\" :key=\"page.timestamp\">\n            <span class=\"date\">{{page.date}}</span>\n            <span class=\"title\"><a :href=\"page.file\" v-html=\"page.title\"></a></span>\n            </el-menu-item>\n          </el-menu-item-group>\n        </el-menu>\n        <search id=\"search\"/>",
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
          var _this = this;

          var result = {};

          var _loop = function _loop(prop) {
            var pageList = _pages[prop];

            if (result[prop] == null) {
              result[prop] = [];
            }

            var queryList = _this.search.toLowerCase().split(' ');

            result[prop] = queryList.length > 0 ? pageList.map(function (page) {
              if (page && queryList.every(function (q) {
                return page.title.toLowerCase().indexOf(q) > -1;
              })) queryList.forEach(function (q) {
                var text = $("<span>".concat(page.title, "</span>")).text();

                if (q) {
                  page.title = text.replace(new RegExp("(".concat(q, ")"), 'ig'), "<span class=\"hl-word\">$1</span>");
                }

                console.log({
                  q: q,
                  t: page.title,
                  text: text
                }, 111);
              });
              return _objectSpread2({}, page);
            }).filter(Boolean) : pageList;
          };

          for (var prop in _pages) {
            _loop(prop);
          }

          return result;
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
      $('#table-of-contents>h2').append(config.searchTmpl); // TOC

      $('#table-of-contents').show(); // 底部个人信息

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
