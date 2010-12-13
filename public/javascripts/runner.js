netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');

// handle communication with the server
var Server = function (requestHandler) {
  var that = this;
  this.requestHandler = requestHandler;
  var socket = this.socket = new io.Socket('localhost', {
    transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
  });
  socket.connect();
  socket.on('message', function (data) { that.readMessage(data); });
};
Server.prototype.sendMessage = function (obj) {
  var json = JSON.stringify(obj);
  this.socket.send(json);
};
Server.prototype.readMessage = function (json) {
  var obj = JSON.parse(json);
  this.requestHandler(obj);
};

var server = new Server(function (request) {
  alert(JSON.stringify(request));
});
