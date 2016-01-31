## Funcy modules

This is an interface style for modules which maximally leverages JavaScript's features: when `require()`ed or `import`ed a funcy module returns an Object which is a Function, optionally with various properties defined on the object. In other words the module provides a function-y (funcy) object.

There are a few files in this directory.
- `funcy-objects.js` simply explores the fundimentals of JavaScript on the topic of Functions juxtaposed with Objects.
- `funcy-object-module-interface.js` describes the Funcy Modules interface. The file is actually a Mocha test script which works through the features of Funcy Modules.
- `example-funcy-object-module.js` is an example of a Funcy Module. It is actually the object under test in `funcy-object-module-interface.js`.

