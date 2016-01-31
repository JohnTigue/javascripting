## Funcy modules

This is an interface style for modules which maximally leverages JavaScript's features: when `require()`ed or `import`ed a funcy module returns an Object which is a Function, optionally with various properties defined on the object. In other words the module provides a function-y (funcy) object. Part of the design motivation is to align with JavaScript's native module machinery which has ["a preference for single exports"](http://www.2ality.com/2014/09/es6-modules-final.html) so that single thing could be a Function.

There are a few files in this directory.
- `funcy-objects.js` simply explores the fundimentals of JavaScript on the topic of Functions juxtaposed with Objects.
- `funcy-modules.js` describes the Funcy Modules interface. The file is actually a Mocha test script which works through the features of Funcy Modules.
- `funcy-module-example.js` is an example of a Funcy Module. It is actually the object under test in `funcy-object-module-interface.js`.

