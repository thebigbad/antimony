var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    io = require('socket.io');

var notFound = function (response) {
  console.log('not found');
  response.writeHead(404);
  response.end('Not Found');
};

var methodNotAllowed = function (allow, response) {
  console.log('method not allowed');
  response.writeHead(405, { Allow: allow.join(', ') });
  response.end('Method Not Allowed');
};

var serveStatic = function (filepath,  response) {
  console.log('serving static ' + filepath);
  var extname = path.extname(filepath);
  var contentType = (extname === '.html') ? 'text/html' : 'text/javascript';
  response.writeHead(200, { 'Content-Type': contentType });
  var stream = fs.createReadStream(filepath);
  stream.on('data', function (data) { response.write(data); });
  stream.on('end', function (data) { response.end(data); });
};

var server = http.createServer(function (request, response) {
  console.log('GET: ' + request.url);
  var filepath = 'public' + request.url;
  path.exists(filepath, function (exists) {
    if (!exists) { return notFound(response); }
    if (request.method != 'GET') { methodNotAllowed(['GET'], response); }
    serveStatic(filepath, response);
  });
});
server.listen(1234);

var socket = io.listen(server);
socket.on('connection', function (client) {
  client.send('{"test":"success"}');
  // new client is here!
  client.on('message', function (message) {
    console.log(message);
    client.send('response from server');
  })
  client.on('disconnect', function () {
  })
});
