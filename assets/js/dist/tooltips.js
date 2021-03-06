"use strict";

/** jsx?|tsx? file header */
$(function () {
  var tts = $(".tooltip").tooltipster;
  if (typeof tts !== 'function') return;
  tts({
    theme: "tooltipster-punk",
    contentAsHTML: true,
    animation: "grow",
    delay: [100, 500],
    // trigger: 'click'
    trigger: "custom",
    triggerOpen: {
      // mouseenter: true,
      originClick: true,
      click: true,
      tap: true
    },
    triggerClose: {
      originClick: true,
      scroll: true,
      tap: true
    },
    plugins: ["sideTip", "scrollableTip"]
  });
});