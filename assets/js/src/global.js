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

  $("h1.title").append(
    $(`
<div>
<script async src="https://cse.google.com/cse.js?cx=a0d16d11f3d4a3b9c"></script>
<div class="gcse-search"></div>
</div>`)
  );
});
