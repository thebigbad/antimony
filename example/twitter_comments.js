var puts = require('sys').puts;

var Client = require('../client');

var client = new Client('localhost:1235');

var responses = 0;

for (var i = 0; i < 500; i++) {
  client.runOnPage(
    'http://www.twitter.com/writeonglass',
    function (callback) {
      var twitterComments = require('comments').twitterComments;
      var c = twitterComments(document, $);
      callback(c);
    },
    function (data) {
      responses++;
      puts(responses);
    }
  );
}
