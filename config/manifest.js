/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
  // See https://github.com/san650/ember-web-app#documentation for a list of
  // supported properties

  return {
    name: "monday-night",
    short_name: "monday-night",
    description: "",
    start_url: "/",
    display: "standalone",
    background_color: "#475761",
    theme_color: "#475761",
    icons: [{
      src: "/assets/icon.png",
      sizes: "540x540",
      type: "image/png"
    }],
    ms: {
      tileColor: '#475761'
    }
  };
}
