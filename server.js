var http = require('http'),
    router = require('./router');

var timestamp = function () { return (new Date()).getTime(); };

var pushResponses = [];

var push = http.createServer(function (req, res) {
  console.log('push connected');
  pushResponses.push(res);
});
push.listen(1234);

var clientResponses = {};

router.post('client', function (req, res) {
  var id = timestamp();
  console.log('post from client (' + id + ')');

  var json = '';
  req.on('data', function (data) { json += data; });
  req.on('end', function (data) {
    if (data) { json += data; }

    console.log('\tsaving response');
    clientResponses[id] = res;

    var data = JSON.parse(json);
    data.id = id;
    json = JSON.stringify(data);
    console.log('\tsending to push: ' + json);
    pushRes = pushResponses.pop();
    pushResponses = [];
    pushRes.writeHead(200, {'Content-Type': 'application/json'});
    pushRes.end(json);
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
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OREN FOR PRESIDENT');
  });
});

router.server.listen(1235);
console.log('listening at http://localhost:1235');
