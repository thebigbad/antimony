var http = require('http'),
    router = require('./router');

var pushResponses = [];

var push = http.createServer(function (req, res) {
  console.log('test');
  pushResponses.push(res);
});
push.listen(1234);

var clientResponses = {};

router.post('client', function (req, res) {
  var script = '';
  req.on('data', function (data) { script += data; });
  req.on('end', function (data) {
    if (data) { script += data; }

    var id = (new Date()).getTime();
    clientResponses[id] = res;

    var message = JSON.stringify({script : script, id: id});
    pushRes = pushResponses.pop();
    pushResponses = [];
    pushRes.writeHead(200, {'Content-Type': 'application/json'});
    pushRes.end(message);
  });
});

router.post('browser/:id', function (req, res, id) {
  var json = '';
  req.on('data', function (data) { json += data; });
  req.on('end', function (data) {
    if (data) { json += data; }
    var clientRes = clientResponses[id];
    delete clientResponses[id];
    clientRes.writeHead(200);
    clientRes.end(json);
    res.writeHead(200);
    res.end('fries are done');
  });
});

router.server.listen(1235);
