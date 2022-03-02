"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(function () {
  // 网站胡一些静态数据 ////////////////////////////////////////////////////
  var deduped = dedupStats();
  console.log(window.$stats, window.$timestamp);
  var tocSelector = 'div[id^="outline-container-"]'; // 检测是不是移动端 //////////////////////////////////////////////////////

  var md = new MobileDetect(window.navigator.userAgent);
  var isMobile = md.mobile();
  var cached = {
    current: deduped.reduce(function (arr, curr) {
      if (curr && curr.file && new RegExp("".concat(curr.file, "$")).test(location.pathname)) {
        arr.push(curr);
      }

      return arr;
    }, []),
    // 本文
    whole: deduped // 全站

  };
  var ElementPlusOptions = {// size: "small",
  };
  console.log($('#postamble .date').text());
  $('#toggle-valine').click(function () {
    $('#vcomments').toggle();
  });
  var isHome = /home\.html$/.test(location.pathname); // if (isHome) {
  // ...
  // } else {

  $('#content').append("<script id=\"utt-client\" type=\"text/javascript\" src=\"/assets/js/dist/client.js\" issue-term=\"pathname\" repo=\"gcclll/cheng92-comments\" theme=\"github-light\" async></script>"); // valine ///////////////////////////////////////////////////////////////////

  $('#content').append("\n    <button id=\"toggle-valine\" type=\"button\" class=\"btn btn-success\">\n      \u663E\u793A <a target=\"_blank\" href=\"https://valine.js.org/\">Valine</a> \u8BC4\u8BBA\u7CFB\u7EDF\n    </button>\n    <div id=\"vcomments\" style=\"display:none\"></div>\n    <script>\n      new Valine({\n          el: '#vcomments',\n          appId: 'dwjufJhAgWQzU3evb1th5SrC-gzGzoHsz',\n          appKey: 'z7BITHKt5oI9zuxdfp8X9tUN'\n      })\n    </script>"); // }

  var searchTmpl = "<div id=\"search\">Loading...</div>"; // 自定义 TOC

  if (isHome) {
    $('#table-of-contents').hide();
    $('#content').append($('#postamble'));
    $('#postamble').css({
      position: 'relative',
      marginTop: '1rem'
    }); // $('#postamble').hide()

    $('#content').css({
      margin: 'auto'
    });
    $('#postamble').css({
      width: '100%',
      textAlign: 'center'
    }); // 收集所有标题(id包含 'outline-container-' 且以它开头的 div)

    $(searchTmpl).insertAfter('h1.title');
    $("<div id=\"vue-toc\"></div>").insertAfter('#search');
    var outlines = findOutlines();
    $(tocSelector).remove();
    Vue.createApp({
      template: "\n  <el-menu clas=\"el-toc-menu\">\n    <template v-for=\"(ol,i) in outlines\">\n      <el-sub-menu v-if=\"ol.children.length\" :index=\"''+i\">\n        <template #title><h2 :id=\"ol.id\"><span>{{ol.title}}</span></h2></template>\n        <el-menu-item style=\"padding-left:20px\" v-for=\"(child, ii) in ol.children\" :index=\"i+'-'+ii\">\n          <h3 :id=\"child.id\">\n            <a v-if=\"child.href\" :href=\"child.href\">{{child.title}}</a>\n            <span v-else>{{child.title}}</span>\n          </h3>\n        </el-menu-item>\n      </el-sub-menu>\n      <el-menu-item v-else style=\"padding:0\">\n        <h2 :id=\"ol.id\">\n          <a v-if=\"ol.href\" :href=\"ol.href\">{{ol.title}}</a>\n          <span v-else>{{ol.title}}</span>\n        </h2>\n      </el-menu-item>\n    </template>\n  </el-menu>",
      setup: function setup() {
        return {
          outlines: outlines
        };
      }
    }).use(ElementPlus).mount('#vue-toc');
  } else {
    $('#table-of-contents>h2').append(searchTmpl); // n. 网站搜索功能

    $('#table-of-contents').show();
    $('#postamble').show();
  } // $('h1.title').append(`<span>${navigator.userAgent}</span>`)


  if (isMobile) {
    $('h1.title').append("<img class=\"title-phone\" src=\"/assets/img/phone.svg\"/>");
  } // 1. add github badge /////////////////////////////////////////////////////////


  $('span').each(function () {
    var bgColor = $(this).css('background-color');

    if (bgColor === 'rgb(35, 39, 46)') {
      $(this).css('background-color', 'rgba(35, 39, 46, .1)');
    }
  });
  $('#postamble .author').append($('<span class="follows"><a href="https://www.github.com/gcclll?tab=followers">' + '<img src="https://img.shields.io/github/followers/gcclll?style=social"></a></span>'));
  var app = Vue.createApp({
    template: "\n\n<el-autocomplete\n  v-model=\"search\"\n  :fetch-suggestions=\"querySearch\"\n  :trigger-on-focus=\"false\"\n  class=\"inline-input search-input\"\n  placeholder=\"\u5168\u6587\u6216\u672C\u6587\u4E2D\u641C\u7D22...\"\n  @select=\"handleSelect\"\n>\n  <template #suffix>\n    <img class=\"command-k\" src=\"/assets/img/command.svg\"/><span class=\"command-k\">K</span>\n  </template>\n</el-autocomplete>\n<el-dialog v-model=\"dialogVisible\" @open=\"clean\" @close=\"clean\" title=\"\u5168\u6587(\u7AD9)\u641C\u7D22\">\n<el-input autofocus v-model=\"search\" placeholder=\"\u8BF7\u8F93\u5165\u641C\u7D22\u5185\u5BB9(\u6682\u53EA\u652F\u6301\u6807\u9898\u3001\u94FE\u63A5\u3001\u951A\u70B9)\">\n  <template #prepend>\n    <el-select v-model=\"scope\" placeholder=\"Select\" style=\"width:80px\">\n      <el-option label=\"\u672C\u6587\" value=\"1\"/>\n      <el-option label=\"\u5168\u7AD9\" value=\"2\"/>\n    </el-select>\n  </template>\n  <template #append><img class=\"my-search-icon\" src=\"/assets/img/search.svg\"></template>\n</el-input>\n<ul class=\"search-list\" style=\"max-height:500px;overflow-y:scroll;text-align:left\">\n  <li v-for=\"(result, i) in filterResults\" :key=\"result.value\" @click=\"locate(result.link)\">\n    <div class=\"result-value\" v-html=\"highlight(result.value)\"></div>\n    <div class=\"result-tags\">\n      <el-tag v-if=\"!isCurrentPage(result.file)\" effect=\"dark\" type=\"info\">{{result.file}}</el-tag>\n    </div>\n  </li>\n</ul>\n</el-dialog>\n",
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
          _querySearch(newVal, function (results) {
            return state.filterResults = results;
          }, state.results);
        } else {
          state.filterResults = [];
        }
      });

      var clean = function clean() {
        state.filterResults = [];
        state.search = '';
      };

      return _objectSpread(_objectSpread({}, Vue.toRefs(state)), {}, {
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
        querySearch: function querySearch(qs, cb) {
          return _querySearch(qs, cb, state.results);
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
  app.use(ElementPlus, ElementPlusOptions).mount('#search');

  function _querySearch(queryString, cb, results) {
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

  function trimText(ele, h) {
    return $(ele).children(h).text().replace(/\n/g, '').replace(/\s+/g, ' ');
  }

  function findOutlines(parents) {
    var hn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var children = [];

    if (parents == null) {
      parents = $(tocSelector);
    } else {
      parents = $(parents).children(tocSelector);
    }

    parents.each(function () {
      var title = trimText(this, "h".concat(hn));

      if (title) {
        children.push({
          title: title,
          id: $(this).find("h".concat(hn)).attr('id'),
          href: $(this).find("h".concat(hn, ">a")).attr('href'),
          children: findOutlines(this, hn + 1)
        });
      }
    });
    return children;
  }
});