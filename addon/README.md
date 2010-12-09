antimony - a Barebones Extension For Firefox, Ya'll
============

A basic Firefox extension with a menu item, for copying and pasting into new projects.

For Development
============

Like they say in the [good book](https://developer.mozilla.org/en/Setting_up_extension_development_environment#Firefox_extension_proxy_file), navigate to:

    ~/.mozilla/firefox/$PROFILE_NAME/extensions

...and create a file named:

    antimony@thebigbad.github.com

Inside that file, write the path of this project (making sure it ends in slash).

For Sharing
===========

    make

... and open antimony.xpi in Firefox

Credit
===========

* it's all [retiman](http://github.com/retiman) and his wonderful [browser science](http://github.com/retiman/browser-science)
