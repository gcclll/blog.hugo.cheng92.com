"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(function () {
  var titleRE = /[a-z0-9 \.:#]+/gi;
  var deduped = dedupStats();
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
  console.log(cached);
  $('span').each(function () {
    var bgColor = $(this).css('background-color');

    if (bgColor === 'rgb(35, 39, 46)') {
      $(this).css('background-color', 'rgba(35, 39, 46, .1)');
    }
  });
  $('#postamble .author').append($('<span class="follows"><a href="https://www.github.com/gcclll?tab=followers">' + '<img src="https://img.shields.io/github/followers/gcclll?style=social"></a></span>'));
  $('#table-of-contents>h2').append("<div id=\"search\">Loading...</div>");
  var ElementPlusOptions = {// size: "small",
  };
  var _Vue = Vue,
      createApp = _Vue.createApp;
  var app = createApp({
    template: "\n\n<el-autocomplete\n  v-model=\"search\"\n  :fetch-suggestions=\"querySearch\"\n  :trigger-on-focus=\"false\"\n  class=\"inline-input search-input\"\n  placeholder=\"Please Input Search Content\"\n  @select=\"handleSelect\"\n>\n  <template #suffix>\n    <img class=\"command-k\" src=\"/assets/img/command.svg\"/><span class=\"command-k\">K</span>\n  </template>\n</el-autocomplete>\n<el-dialog v-model=\"dialogVisible\" @open=\"clean\" @close=\"clean\" title=\"\u5168\u6587(\u7AD9)\u641C\u7D22\">\n<el-input v-model=\"search\" placeholder=\"\u8BF7\u8F93\u5165\u641C\u7D22\u5185\u5BB9(\u6682\u53EA\u652F\u6301\u6807\u9898\u3001\u94FE\u63A5\u3001\u951A\u70B9)\">\n  <template #prepend>\n    <el-select v-model=\"scope\" placeholder=\"Select\" style=\"width:80px\">\n      <el-option label=\"\u672C\u6587\" value=\"1\"/>\n      <el-option label=\"\u5168\u7AD9\" value=\"2\"/>\n    </el-select>\n  </template>\n  <template #append><img class=\"my-search-icon\" src=\"/assets/img/search.svg\"></template>\n</el-input>\n<ul class=\"search-list\" style=\"max-height:500px;overflow-y:scroll;text-align:left\">\n  <li v-for=\"(result, i) in filterResults\" :key=\"result.value\" @click=\"locate(result.link)\">\n    <div class=\"result-value\" v-html=\"highlight(result.value)\"></div>\n    <div class=\"result-tags\">\n      <el-tag v-if=\"!isCurrentPage(result.file)\" effect=\"dark\" type=\"info\">{{result.file}}</el-tag>\n    </div>\n  </li>\n</ul>\n</el-dialog>\n",
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
});