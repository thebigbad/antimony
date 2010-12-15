var Client = require('../client');

var client = new Client('localhost:1235');

client.runOnPage(
  'http://cnn.com/',
  function (callback) {
    $(document.body).html('Boo Yeah!');
    setTimeout(function () {
      callback(document.title);
    }, 3000);
  },
  function (data) {
    console.log(data);
  }
);
