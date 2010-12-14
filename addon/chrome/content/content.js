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

var messageQueue = [];

var running = false;
var processNext = function () {
  if (running || messageQueue.length === 0) { return; }
  running = true;
  var json = messageQueue.shift();
  var message = JSON.parse(json);
  eval('var f = ' + message.script);
  f(function (data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:1235/browser/' + message.id, true);
    xhr.send(JSON.stringify({res: data}));
    running = false;
    processNext();
  });
};

new Poller('http://localhost:1234/', function (json) {
  messageQueue.push(json);
  processNext();
});
