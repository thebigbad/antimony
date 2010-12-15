var request = require('request');

var runOnPage = function (url, f, callback) {
  var data = {
    type: 'page',
    url: url,
    script: f.toString()
  };
  var params = {
    uri: 'http://localhost:1235/client',
    method: 'POST',
    body: JSON.stringify(data)
  };
  request(params, function (error, response, body) {
    var data = JSON.parse(body);
    callback(data.res);
  });
};

runOnPage(
  'http://jquery.com',
  function (callback) {
    $(document.body).html('Boo yeah!');
    callback($(document.body).html());
  },
  function (data) {
    console.log(data);
  }
);
