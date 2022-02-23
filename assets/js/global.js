/** jsx?|tsx? file header */

$(function () {
  $("span").each(function () {
    var bgColor = $(this).css("background-color");
    if (bgColor === "rgb(35, 39, 46)") {
      $(this).css("background-color", "rgba(35, 39, 46, .1)");
    }
  });
});
