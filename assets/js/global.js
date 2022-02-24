/** jsx?|tsx? file header */

$(function () {
  $("span").each(function () {
    var bgColor = $(this).css("background-color");
    if (bgColor === "rgb(35, 39, 46)") {
      $(this).css("background-color", "rgba(35, 39, 46, .1)");
    }
  });

  $(
    '<p class="gccll-github">Github: <a href="https:www.github.com/gcclll?tab=followers">' +
      '<img src="https:img.shields.io/github/followers/gcclll?style=social"></a></p>'
  ).insertBefore($("#postamble .date"));
});
