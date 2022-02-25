$(function () {
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
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        class="inline-input search-input"
        placeholder="Please Input Search Content"
        @select="handleSelect"
      />`,
    setup() {
      const results = ref([]);
      const state = ref("");

      Vue.onMounted(() => {
        results.value = loadAllItems();
        console.log(results.value, "results");
      });

      return {
        state,
        querySearch: (qs, cb) => querySearch(qs, cb, results),
        handleSelect(item) {
          if (item.link) {
            location.href = item.link;
            state.value = "";
          }
        },
      };
    },
  });

  app.use(ElementPlus, ElementPlusOptions).mount("#search");

  function querySearch(queryString, cb, results) {
    console.log(queryString, "xxx");

    cb(
      queryString
        ? results.value.filter(createFilter(queryString))
        : results.value
    );
  }
  function createFilter(queryString) {
    return (restaurant) => {
      // 支持叠加搜索
      const queryList = queryString.split(" ");
      const lower = restaurant.value.toLowerCase();
      return queryList.every((val) => lower.indexOf(val.toLowerCase()) > -1);
    };
  }
  function loadAllItems() {
    const items = [];
    // #text-table-of-contents a
    $("#content a").each(function () {
      const value = $(this).text().replace(/\n/, "").replace(/\s+/, " ");
      if (/[a-z0-9 \.:]+/.test(value)) {
        items.push({ value, link: $(this).attr("href") });
      }
    });
    return items;
  }
});
