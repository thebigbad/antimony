// handle communication with the browser
var Browser = function () {
  var that = this;
  this.requestHandler = function () {};
  window.addEventListener(
    'message',
    function (e) { that.readMessage(e.data); },
    false
  );
};
Browser.prototype.sendMessage = function (json) {
  window.parent.postMessage(json, '*');
};
Browser.prototype.readMessage = function (json) {
  this.requestHandler(json);
};

// handle communication with the server
var Server = function () {
  var that = this;
  this.requestHandler = function () {};
  var socket = this.socket = new io.Socket('localhost', {
    transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
  });
  socket.connect();
  socket.on('message', function (data) { that.readMessage(data); });
};
Server.prototype.sendMessage = function (json) {
  this.socket.send(json);
};
Server.prototype.readMessage = function (json) {
  this.requestHandler(json);
};

var browser = new Browser();
var server = new Server();

browser.requestHandler(server.sendMessage);
server.requestHandler(browser.sendMessage);
