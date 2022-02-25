/** jsx?|tsx? file header */

$(function () {
  $(".tooltip").tooltipster({
    theme: "tooltipster-punk",
    contentAsHTML: true,
    animation: "grow",
    delay: [100, 500],
    // trigger: 'click'
    trigger: "custom",
    triggerOpen: {
      // mouseenter: true,
      click: true,
    },
    triggerClose: {
      originClick: true,
      scroll: true,
    },
  });
});
