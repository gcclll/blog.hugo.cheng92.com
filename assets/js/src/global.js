$(function () {
  const titleRE = /[a-z0-9 \.:#]+/gi;

  $("span").each(function () {
    const bgColor = $(this).css("background-color");
    if (bgColor === "rgb(35, 39, 46)") {
      $(this).css("background-color", "rgba(35, 39, 46, .1)");
    }
  });

  $("#postamble .author").append(
    $(
      '<span class="follows"><a href="https://www.github.com/gcclll?tab=followers">' +
        '<img src="https://img.shields.io/github/followers/gcclll?style=social"></a></span>'
    )
  );

  // $("h1.title").append(
  //     $(`
  // <div>
  // <script async src="https://cse.google.com/cse.js?cx=a0d16d11f3d4a3b9c"></script>
  // <div class="gcse-search"></div>
  // </div>`)
  //   );

  $("#table-of-contents>h2").append(`<div id="search">Loading...</div>`);
  // $(`<div id="search">Loading...</div>`).insertAfter("#table-of-contents>h2");

  const ElementPlusOptions = {
    size: "small",
  };
  const { createApp, ref } = Vue;

  const app = createApp({
    template: `
<img src="/assets/img/command.svg"/>K
<el-autocomplete
  v-model="search"
  :fetch-suggestions="querySearch"
  :trigger-on-focus="false"
  class="inline-input search-input"
  placeholder="Please Input Search Content"
  @select="handleSelect"
/>
<el-dialog v-model="dialogVisible" @open="handleOpen" @close="handleClose">
<el-input v-model="search" placeholder="请输入搜索内容"/>
<ul style="max-height:500px;overflow-y:scroll;text-align:left">
  <li v-for="(result, i) in filterResults" :key="result.link">{{result.value}}</li>
</ul>
</el-dialog>
`,
    setup() {
      const state = Vue.reactive({
        results: [],
        filterResults: [],
        search: "",
        dialogVisible: false,
      });

      Vue.onMounted(() => {
        state.results = loadAllItems();
      });

      function keydownHandler(e) {
        if (e.metaKey && e.keyCode === 75) {
          state.dialogVisible = true;
        }
      }
      Vue.onUnmounted(() => {
        $(document.body).off("keydown", keydownHandler);
      });

      Vue.watch(
        () => state.search,
        (newVal) => {
          if (newVal) {
            querySearch(
              newVal,
              (results) => (state.filterResults = results),
              state.results
            );
          } else {
            state.filterResults = [];
          }
        }
      );

      $(document.body).on("keydown", keydownHandler);

      const clear = () => {
        state.filterResults = [];
        state.search = "";
      };

      return {
        ...Vue.toRefs(state),
        handleOpen() {
          clear();
        },
        handleClose() {
          clear();
        },
        querySearch: (qs, cb) => querySearch(qs, cb, state.results),
        handleSelect(item) {
          if (item.link) {
            location.href = item.link;
            state.search = "";
          }
        },
      };
    },
  });

  app.use(ElementPlus, ElementPlusOptions).mount("#search");

  function querySearch(queryString, cb, results) {
    const result = queryString
      ? results.filter(createFilter(queryString))
      : results;
    cb(result);
  }
  function createFilter(queryString) {
    return (item) => {
      // 支持叠加搜索
      const queryList = queryString.split(" ");
      const lower = item.value.toLowerCase();
      return queryList.every((val) => lower.indexOf(val.toLowerCase()) > -1);
    };
  }

  function loadAllItems() {
    const items = [];
    // #text-table-of-contents a
    $("#content a").each(function () {
      const value = trim($(this).text());
      const tag = $(this).get(0).tagName;
      if (titleRE.test(value)) {
        const item = {
          value,
          link: $(this).attr("href"),
          tag,
        };
        items.push(concatValue(item));
      }
    });

    $("#content *[id]").each(function () {
      const id = $(this).attr("id");
      const value = trim($(this).text()) || id;
      const tag = $(this).get(0).tagName;
      const isValid = /h[1-9]|span/i.test(tag);
      if (isValid && id && titleRE.test(value)) {
        const item = { value, link: `#${id}`, tag };
        items.push(concatValue(item));
      }
    });

    return items.reduce((list, next) => {
      if (!list.find((it) => next.link === it.link)) {
        list.push(next);
      }
      return list;
    }, []);
  }

  function trim(text = "") {
    return text.replace(/\n/g, "").replace(/\s+/g, " ").trim();
  }

  function concatValue(item) {
    const { value, link } = item;
    let tmp = [value, link].join("------");
    // if (tmp.length > 30) {
    // tmp = tmp.slice(0, 30) + "...";
    // }
    item.value = tmp;
    return item;
  }
});
