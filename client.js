var request = require('request');

var Client = function (host) {
  this.host = host;
};

Client.prototype.runOnPage = function (url, f, callback) {
  var data = {
    type: 'page',
    url: url,
    script: f.toString()
  };
  var params = {
    uri: 'http://' + this.host + '/client',
    method: 'POST',
    body: JSON.stringify(data)
  };
  request(params, function (error, response, body) {
    var data = JSON.parse(body);
    callback(data.res);
  });
};

module.exports = Client;
