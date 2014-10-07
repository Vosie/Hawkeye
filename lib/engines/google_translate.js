(function(exports) {
  var fs = require('fs');
  var execQueue = new (require('../external_executor.js').Executor)();

  var URL = 'http://translate.google.com/translate_tts?ie=UTF-8&tl=';
  var URL_Q = '&q='

  exports.__NAME__ = 'google-translate';
  exports.say = function gt_say(text, language, targetFile, callback) {
    // we need to use %27 to replace the single quote because it confuse the
    // shell command.
    var url = URL + encodeURIComponent(language) +
              URL_Q + encodeURIComponent(text.replace('\'', '%27'));
    execQueue.addTask({
      'cmd': 'wget',
      'args': ['-q', '-U', 'Mozilla', '-O', targetFile, url],
      'callback': function() {
        if (callback) {
          var stats = fs.statSync(targetFile)
          callback(stats["size"] > 1024);
        }
      }
    });
    execQueue.start();
  };
})(exports || window);
