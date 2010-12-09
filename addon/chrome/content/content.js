var socket = new io.Socket(
  'http://localhost:1234/',
  { rememberTransport: false }
);
socket.on('connect', function () {
  alert('connect');
});
socket.on('message', function () {
  alert('message');
});
socket.on('disconnect', function () {
  alert('disconnect');
});
