netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead UniversalBrowserWrite UniversalXPConnect');

// handle communication with the server
var Server = function (requestHandler) {
  var that = this;
  this.requestHandler = requestHandler;
  var socket = this.socket = new io.Socket('localhost', {
    port: 1234,
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

var Cc = Components.classes,
    Ci = Components.interfaces;

var Tab = function (url) {
  var windowManager = Cc["@mozilla.org/appshell/window-mediator;1"].
      getService(Ci.nsIWindowMediator);
  var chromeWindow = windowManager.getMostRecentWindow("navigator:browser");
  var gBrowser = chromeWindow.gBrowser;
  var tab = gBrowser.addTab(url);
};

var server = new Server(function (request) {
  new Tab(request.url);
});

