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

  $(`<div id="search">Loading...</div>`).insertAfter("h1.title");

  const { createApp, ref } = Vue;

  const app = createApp({
    template: `
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        class="inline-input"
        placeholder="Please Input"
        @select="handleSelect"
      />`,
    setup() {
      const results = ref([]);

      Vue.onMounted(() => {
        results.value = loadAllItems();
      });

      return {
        state: ref(""),
        querySearch: (qs, cb) => queryString(qs, cb, results),
        handleSelect(item) {
          console.log(item, "select");
        },
      };
    },
  });

  app.use(ElementPlus).mount("#search");

  function querySearch(queryString, cb, results) {
    cb(
      queryString
        ? results.value.filter(createFilter(queryString))
        : results.value
    );
  }
  function createFilter(queryString) {
    return (restaurant) => {
      return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      );
    };
  }
  function loadAllItems() {
    return [{ value: "vue", link: "https://github.com/vuejs/vue" }];
  }
});
