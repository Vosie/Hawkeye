(function(exports) {
  'use strict';
  var engines = require('./engines');

  function Hawkeye() {
  }

  Hawkeye.ERROR_WRONG_ENGINE = 'wrong_engine';
  Hawkeye.ERROR_UNABLE_TO_GENERATE = 'unable_to_generate';

  Hawkeye.prototype.say = function(text, language, saveTo, engine, callback) {
    var engine = engines.getEngine(engine);
    if (engine) {
      engine.say(text, language, saveTo, function(result) {
        if (callback) {
          callback(result ? null : Hawkeye.ERROR_UNABLE_TO_GENERATE);
        }
      });
    } else if (callback) {
      callback(Hawkeye.ERROR_WRONG_ENGINE);
    }
  }

  exports.Hawkeye = Hawkeye;

})(exports || window);
