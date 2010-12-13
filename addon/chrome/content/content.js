var Server;
document.getElementById('antimony').addEventListener("load", function () {
Server = function () {
  var that = this;
  this.requestHandler = function () {};
  this.frame = window.frames['antimony'];
  window.addEventListener(
    'message',
    function (e) { that.readMessage(e.data); },
    false
  );
};
Server.prototype.sendMessage = function (data) {
  var json = JSON.stringify(data);
  this.frame.postMessage(json, '*');
};
Server.prototype.readMessage = function (json) {
  var request = JSON.parse(json);
  this.requestHandler(request);
};

var server = new Server();
server.requestHandler(function (request) {
  alert(JSON.stringify(request));
});
}, false);
