var Client = require('../client');

var client = new Client('localhost:1235');


for (var i = 0; i < 100; i++) {
  client.runOnPage(
    'http://www.twitter.com/writeonglass',
    function (callback) {
      var twitterComments = require('comments').twitterComments;
      var c = twitterComments(document, $);
      callback(c);
    },
    function (data) {
      console.log(data);
    }
  );
}
