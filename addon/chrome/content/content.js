Components.utils.import('resource://antimony/common.js');
require.path = [
  'resource://antimony',
  'file:///home/ryan/repos/borderstylo/curatron/lib'
];

var $ = require('windex');

var Poller = function (url, handler) {
  this.xhr = null;
  this.url = url;
  this.handler = handler;
  this.connect();
};

Poller.prototype.connect = function () {
  var that = this,
      handler = this.handler,
      xhr = this.xhr = new XMLHttpRequest();
  xhr.open("GET", this.url, true);
  xhr.channel.loadFlags |= Ci.nsIRequest.LOAD_BYPASS_CACHE;
  xhr.onreadystatechange = function (event) {
    if (xhr.readyState >= 1 && xhr.readyState <= 3) { return; }
    if (xhr.readyState === 0) { return that.restart(); }
    if (xhr.status !== 200) { return that.restart(); }
    var json = xhr.responseText;
    that.restart();
    handler(json);
  };
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send(null);
};

Poller.prototype.restart = function () {
  this.xhr.abort();
  this.connect();
};

var runInBrowser = function (script, callback) {
  eval('var f = ' + script);
  f(callback);
};

var runOnPage = function (url, script, callback) {
  var tab = gBrowser.selectedTab = gBrowser.addTab(url);
  var browser = gBrowser.getBrowserForTab(tab);
  var chwin = window;
  chwin.addEventListener('DOMContentLoaded', function (e) {
    var document = browser.contentDocument.wrappedJSObject;
    if (!document || e.originalTarget != document) { return; }
    chwin.removeEventListener('DOMContentLoaded', arguments.callee, false);
    var window = document.defaultView;
    eval('var f = ' + script);
    f(function (data) {
      callback(data);
      gBrowser.removeTab(tab);
    });
  }, false);
};

var messageQueue = [];

var running = false;
var processNext = function () {
  if (running || messageQueue.length === 0) { return; }
  running = true;
  var json = messageQueue.shift();
  var message = JSON.parse(json);
  var callback = function (data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:1235/browser/' + message.id, true);
    xhr.send(JSON.stringify({res: data}));
    running = false;
    processNext();
  };
  try {
    if (message.type == 'page') {
      runOnPage(message.url, message.script, callback);
    }
    else {
      runInBrowser(message.script, callback);
    }
  }
  catch (e) {
    Cu.reportError(e);
    running = false;
    processNext();
  }
};

new Poller('http://localhost:1234/', function (json) {
  messageQueue.push(json);
  processNext();
});
