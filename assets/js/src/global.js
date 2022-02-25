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

  const { createApp } = Vue;

  const app = createApp({
    template: `
      <el-input v-model="input" class="w-50 m-2" placeholder="Type something">
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>`,
    data() {
      return {
        input: "Input your search content...",
      };
    },
  });

  app.use(ElementPlus).mount("#search");
});
