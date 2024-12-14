;(function(exports) {
  'use strict';

  // Define the Loader namespace object
  var Loader = {
    // Default empty load callback
    onLoad: function() {},
    
    // Since we don't need to load external files anymore,
    // we can just execute the callback immediately
    done: function(callback) {
      callback();
    }
  };

  // Export the Loader to the global scope (window)
  exports.Loader = Loader;

})(window);