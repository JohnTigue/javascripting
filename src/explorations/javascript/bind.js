/* JFT-TODO: probably want to call this fpification-via-bind-adaptors.js or such */

'use strict';

console.log('--------------');
/* For the motivation behind this funky metaprogramming, check out 
 *  Braithwaite's (@raganwald) article on adaptors, The Symmetry of 
 *  JavaScript Functions:
 *  http://raganwald.com/2015/03/12/symmetry.html
 */
 

/* A specific example can be found on MDN:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Example:_Creating_shortcuts
 */

// The inelegant syntax:
var slice = Array.prototype.slice;
slice.call(arguments); // turns arguments into an array

// The above nasty looking ".call" can be gotten rid of as follows, in the elegant rewrite
// same as "slice" in the previous example
var unboundSlice = Array.prototype.slice;
try{
// Following link says next line of code should throw yet...
// https://variadic.me/posts/2013-10-22-bind-call-and-apply-in-javascript.html
console.log('About to throw, right?')
var wat = unboundSlice(0,4); 
//should have => TypeError: can't convert undefined to object. JFT-TODO: yet, node has no problem with this
//console.log('wat:'+wat);
console.log('Why didn\'t that throw???'); 
}
catch(e){
console.log('Yup, it threw');
}

// This is how to use bind to make it a function, not a method, yet will still have something to call 'this'
var slice = Function.prototype.call.bind(unboundSlice);
// ...
slice(arguments);

/* More generally, this ca be done with any Foo.prototype.doBar 
 * with the result being that the method can now be called as a function
 * where the first argument to the new form will be what would previously
 * have been the object that doBar would have been invoked as a method
 * So the form x.y(z) is now y(x,z) but cannot be y(z,x) because of the
 * specifics of how call() works. But that is sufficient to be useful to
 * get the method into a form where it can be used in FP style programming.
 * And in that space combinators could be used to create y(z,x) or many
 * other possibilities.
 */
function functionize(aMethod){
  return Function.prototype.call.bind(aMethod);
  }
var slice = functionize(Array.prototype.slice);


/* The bestest example of the same trick that will warm the hearts of
 * the FP folks (because bind() if fundimental to FP) is almost
 * recursively seft referencial: functionize bind() itself, as shown
 * in:
 * https://variadic.me/posts/2013-10-22-bind-call-and-apply-in-javascript.html
 */
var bind = Function.prototype.call.bind(Function.prototype.bind); 

