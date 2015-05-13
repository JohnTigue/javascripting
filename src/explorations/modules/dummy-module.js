/* The whole idea of the code in this directory is to come up with a module 
 * interface style that will be calledy FuncyObject. See module-style.js for
 * a whole bunch o' commentary on what, why, and how.
 */
module.exports = (function(){
  var someClosuredState = 40;

  var aFuncyObject = function(){
    // JFT-TODO: what really should the funcyObject module itself return when called?
    // Is it a factory?
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
  })();


