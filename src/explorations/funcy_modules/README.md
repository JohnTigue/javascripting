## Funcy modules: a JavaScript design pattern

Funcy Modules is a design pattern for JavaScript module interfaces which maximally leverages the language's features. For example, on the deep level the Funcy Modules design explicitly leverages closures; more shallowly, Funcy Modules also incorporates various smaller best practices (e.g. the entire module if an IIFE).

When `require()`ed or `import`ed a funcy module returns an Object which is a Function, optionally with various properties defined on the object, and internal state can be maintained within the module (via the closure). In other words the module provides a function-y object, ergo the name "funcy module interface."

Part of the design motivation is to align with JavaScript's new native module machinery which has ["a preference for single exports"](http://www.2ality.com/2014/09/es6-modules-final.html). Given that philosophy, if there is only going to a single thing provided by a module then a funcy object seems to be the most flexible thing to provide.

There are a few files in this directory.
- `funcy-objects.js` simply explores the fundimentals of JavaScript with regards to the topic of Functions juxtaposed and mixed with Objects.
- `funcy-module-tester.js` describes the Funcy Modules interface and shows how to work with it. The file is actually a Mocha test suite.
- `funcy-module-example.js` is an example of a Funcy Module. It is actually the object under test in `funcy-module-tester.js`.

