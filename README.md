Antimony is automated testing in the browser done right.

Ways in which Antimony kicks Selenium's ass:

* *Fast fast fast.* Selenium works everywhere in every language, sort of. Antimony works on one browser in one language in 964 lines of code.
* *Speaks your language.* Antimony runs Javascript in the browser, because that's what runs in the browser. If you want to generate Javascript from some other language in order to test how languages which don't work in the browser might sort of work in the browser, that's between you and your god.
* *Async.* The browser runs Javascript and Javascript is async, so why aren't your tests?
* *Knows it's an extension.* Firefox extensions run with all kinds of permissions and access, so why tie one hand behind your back and pretend you don't have the keys to the Mustang? Feel free to run tests from the context of the page most of the time, but when you want to really tear it up, Antimony has you covered.

Setup
===

* clone the repo @git clone git@repo.borderstylo.com:antimony.git@
* start the server @nodes server.js@
* build the extension @make@
* open antimony.xpi in firefox

Testing with Curl
===

You can interact with antimony by POSTing to http://localhost:1235/client

*Example:*

    $ curl -d '{"type":"page","url":"http://google.com","script":"function (callback) { callback(document.title); }"}' http://localhost:1235/client
    {"res":"Google"}

*Arguments:*

* type: where to run the script. &quot;page&quot; or &quot;browser&quot;. optional (defaults to &quot;browser&quot;)
* url: which page to run the script on (required when type: &quot;page&quot;, ignored otherwise)
* script: string function to run. function should take a callback argument and call it (return values are ignored).

Testing with the Client Library
===

In addition to raw POSTs, there is a nice library in node.js for running tests.

*Example:*

    var Client = require('./vendor/antimony/client');
    var client = new Client('localhost:1235');

    client.runOnPage(
      'http://google.com',
      function (callback) {
        callback(document.title);
      },
      function (title) {
        console.log(title) // Google
      }
    );

Clients take a host as a constructor argument.

runOnPage takes three arguments:

* the url to run the test on
* a function to run on the page. two things to keep in mind with these functions is that they don't have a closure and should take a callback argument
* a callback to pass the results to

Extras
===

In addition to the usual goodies you'll expect to be in scope (like window and document for the page and Components for the browser), Antimony provides a require a la CommonJS and a $ a la jQuery. See [commonjs-ffext](https://github.com/borderstylo/commonjs-ffext) and [windex](https://github.com/borderstylo/windex) for details.

TODO
===

* ANY. ERROR. HANDLING. Antimony should return a 5** status code and a description of the Javascript error. This is a big pain at the moment, because it means you need to keep an eye on the console in the browser when running tests.
