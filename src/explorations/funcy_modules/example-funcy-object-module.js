/* The whole idea of the code in this directory is to come up with a module 
 * interface style that will be calledy FuncyObject. See module-style.js for
 * a whole bunch o' commentary on what, why, and how.
 */
module.exports = (function(){
  // since the whole module is an IIFE, inside this function we can be strict
  'use strict'; 

  var someClosuredState = 40;

  var aFuncyObject = function(){
    // JFT-TODO: what really should the funcyObject module itself
    // return when called?  Is it a factory? Not yet. And not clear
    // that it should be.  
    //
    // But if it becomes a factory, no need for a new operator b/c the
    // invocation of this function creates a closure which can
    // maintain state, if this function returns a function, rather than
    // simply a primative, like it does now.
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
  // http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
  // Moving forward into ES6 (or just have a module system via require()) means the value of doing so in greatly reduced.
