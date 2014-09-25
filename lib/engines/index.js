(function(exports) {
  'use strict';
  var gt = require('./google_translate.js');

  var engines = [gt];
  exports.getEngine = function getEngine(type) {
    for (var i = 0; i < engines.length; i++) {
      if (engines[i].__NAME__ === type) {
        return engines[i];
      }
    }
    // return undefined when we don't find proper engine.
  };
})(exports || window);
