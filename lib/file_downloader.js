(function (exports) {
  'use strict';

  var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
  var http = require('http');
  var fs = require('fs');

  function downloadJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (4 == this.readyState) {
        if (200 == this.status) {
          try {
            var obj = JSON.parse(this.responseText);
            callback(obj);
          } catch (ex) {
            console.log('xhr error: ' + this.status + ', '
              + this.responseText + ', ' + ex.message);
            callback(null);
          }
        } else {
          console.log('xhr error: ' + this.status + ', '
            + this.responseText);
          callback(null);
        }
      }
    };
    xhr.open('GET', url);
    xhr.send();
  }

  function downloadFile(url, filePath, cb) {
    var file = fs.createWriteStream(filePath);
    var request = http.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);
      });
    });
  }

  exports.downloadJSON = downloadJSON;
  exports.downloadFile = downloadFile;

})(exports || window);
