;(function(exports) {
  'use strict';

  var loaded = false;

  // Namespace
  var Loader = {};
  Loader.onLoad = function() {};
  Loader.done = function(callback) {
    // Since we're not loading external files anymore,
    // we can call the callback immediately
    callback();
    loaded = true;
  };

  // Exports
  exports.Loader = Loader;

})(window);