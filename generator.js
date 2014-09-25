#!/usr/bin/env node

if (process.argv.length < 3) {
  console.log('syntax: node generator.js config.json');
  process.exit(-1);
  return;
}

var path = require('path');
var fs = require('fs');
var Hawkeye = require('./lib/hawkeye.js').Hawkeye;
var downloader = require('./lib/file_downloader.js');

var config;
if (process.argv[2][0] === path.sep ||
    process.argv[2].substr(1, 2) === (':' + path.sep)) {
  config = require(process.argv[2]);
} else {
  config = require(process.cwd() + path.sep + process.argv[2]);
}

if (!config) {
  console.error('wrong or empty config file');
  process.exit(-1);
}

var unprocessItems;
var tmpFile = process.cwd() + path.sep + 'tmp.mp3';

var hawkeye = new Hawkeye();
var executor = new (require('./lib/external_executor.js').Executor)();

var langIdx = 0;
tryLanguage();

function tryLanguage() {
  console.log('listing request for language: ' + config.languages[langIdx]);
  var listingUrl = config.urls.list + '?k=' + config.key + '&l=' +
                   config.languages[langIdx++];

  downloader.downloadJSON(listingUrl, function(items) {
    console.log('unprocess items got: ' + items.length);
    if (items.length) {
      unprocessItems = items;
      processItem();
    } else {
      // we don't have any records to generate. Try next language.
      setTimeout(tryLanguage);
    }
  });
}

function executeOk(item, tmpFile) {
  executor.addTask({
    'cmd': './post.sh',
    'args': [
      config.key,
      item.category,
      item.language,
      item.topic,
      tmpFile,
      config.engine,
      config.urls.upload
    ],
    'callback': function(out) {
      if (out) {
        console.log(out);
      }
      setTimeout(processItem, 5000);
    }
  });
  executor.start();
}

function executeFail(item) {
  executor.addTask({
    'cmd': './fail.sh',
    'args': [
      config.key,
      item.category,
      item.language,
      item.topic,
      config.engine,
      config.urls.upload
    ],
    'callback': function(out) {
      if (out) {
        console.log(out);
      }
      setTimeout(processItem, 5000);
    }
  });
  executor.start();
}

function processItem() {
  if (!unprocessItems || !unprocessItems.length) {
    return;
  }
  var item = unprocessItems.pop();
  if (!item) {
    setTimeout(processItem, 1000);
  }
  console.log('process item: ' + item.category + ', ' + item.language + ', ' +
              item.topic);
  var json = JSON.parse(item.content);
  try {
    fs.unlinkSync(tmpFile);
  } catch (ex) {
    // catch the error while trying to unlink a inexistent file
  }
  hawkeye.say(json.label, item.language, tmpFile, config.engine, function(e) {
    if (Hawkeye.ERROR_UNABLE_TO_GENERATE === e) {
      console.log('say error: ' + e);
      executeFail(item);
    } else if (Hawkeye.ERROR_WRONG_ENGINE === e) {
      console.log('say error: ' + e);
      setTimeout(processItem, 5000);
    } else {
      executeOk(item, tmpFile);
    }
  });
}
