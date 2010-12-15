var request = require('request');

var Client = function (host) {
  this.host = host;
  this.out = 0;
  this.limit = 100;
  this.pending = [];
};

Client.prototype._runOnPage = function (url, f, callback) {
  var that = this;
  this.out++;
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
    if (error) { throw error; }
    var data = JSON.parse(body);
    callback(data.res);
    that.out--;
    that.handlePending();
  });
};

Client.prototype.handlePending = function () {
  var that = this;
  if (this.out >= this.limit) { return; }
  if (this.pending.length === 0) { return; }
  var remaining = this.limit - this.out;
  var j = (remaining <= this.pending.length) ? remaining : this.pending.length;
  for (var i = 0; i < j; i++) {
    var next = this.pending.shift();
    this._runOnPage(next.url, next.f, next.callback);
  }
};

Client.prototype.runOnPage = function (url, f, callback) {
  if (this.out < this.limit) {
    return this._runOnPage(url, f, callback);
  }
  this.pending.push({ url: url, f: f, callback: callback });
};

module.exports = Client;
