var http = require('http'),
    router = require('./router');

var id = 0;
var pushRes = null;
var clientMessages = [];
var clientResponses = {};

var forwardNextMessage = function () {
  if (!pushRes) { return; }
  if (clientMessages.length === 0) { return; }
  var message = clientMessages.shift();
  var res = clientResponses[message.id];
  var json = message.json;
  console.log('\tsending to push ' + json);
  pushRes.writeHead(200, {'Content-Type': 'application/json'});
  pushRes.end(json);
  pushRes = null;
};

http.createServer(function (req, res) {
  console.log('push connected');
  pushRes = res;
  forwardNextMessage();
}).listen(1234);

router.post('client', function (req, res) {

  var json = '';
  req.on('data', function (data) { json += data; });
  req.on('end', function (data) {
    if (data) { json += data; }

    id++;
    var data = JSON.parse(json);
    data.id = id;
    json = JSON.stringify(data);
    console.log('\tsaving message (' + id + ')');
    clientMessages.push({ id: id, json: json});
    clientResponses[id] = res;
    forwardNextMessage();
  });
});

router.post('browser/:id', function (req, res, id) {
  console.log('post from browser (' + id + ')');

  var json = '';
  req.on('data', function (data) { json += data; });
  req.on('end', function (data) {
    if (data) { json += data; }
    console.log('\trecieved from browser: ' + json);
    console.log('\tresponding to client');
    var clientRes = clientResponses[id];
    delete clientResponses[id];
    clientRes.writeHead(200);
    clientRes.end(json);
    res.writeHead(204);
    res.end();
  });
});

router.server.listen(1235);
console.log('listening at http://localhost:1235');
