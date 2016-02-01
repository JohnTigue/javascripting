/* 
 * This is an example of the Funcy Module design pattern for JavaScript modules.
 * See funcy-module-tester.js for much more detail on the what, why, and how.
 */

/*
 * JFT-TODO:
 * So how does this become a ES6 export default function () {}?
 * Do I need to go to full-on ES6 and then babel out this ES5 code as a built file? Which I would then comment?
 */
module.exports = (function(){
  // since the whole module is an IIFE, inside this function we can be strict
  'use strict'; 

  var someClosuredState = 40;

  // Note: naming the function in the following expression is not required but it helps in stack traces
  var aFuncyObject = function FuncyObject(){
    // JFT-TODO: what really should the funcyObject module itself
    // return when called?  Is it a factory? Not yet. And not clear
    // that it should be.  
    //
    // Note that Express.js does this as well: export a single function which is a factory.
    // See http://bites.goodeggs.com/posts/export-this/
    //
    // But if it becomes a factory, no need for a new operator b/c the
    // invocation of this function creates a closure which can
    // maintain state, if this function returns a function, rather than
    // simply a primative, like it does now. Could also export a (higher order)
    // function, which returns a function...
    return someClosuredState;
    };

  var aFuncyObjectsStateModder = function(){
    return someClosuredState++;
    };
  aFuncyObject.stateModder = aFuncyObjectsStateModder;

  aFuncyObject.self = aFuncyObject;
  aFuncyObject.drummer = "Clyde Stubblefield";

  // Whatever; some value to test for.
  aFuncyObject.isDrummerFunky = function(){
    // Ya know: this Simpson guy knows his stuff. Consider reading it.
    // https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch4.md
    return this.drummer === "Clyde Stubblefield"; 
    }

  return aFuncyObject;
  }()); // if this line were })() that would be what Crockford refers to as "dog balls". See:
        // http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html#comment-1844066085
        // Personally, if the name "IIFE" is the issue then ()() seems
        // more appropriate than (()) as () is the FE and ()() is that FE
        // II'd. In both cases the first ( is just about tricking the
        // lexer to stay out of function declaration mode; the latter could
        // be argued to be cleaner. But hey, there seems to be no real 
        // difference, so do whatcha wanna.

  // Note: although not done here, passing params into the IIFE can be done to help avoid use of globals. See: 
  //   http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
  // In an ES6 context (or just having a module system via require()) the value of doing so in greatly reduced.
