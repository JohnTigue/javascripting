/* global console, require, describe, context, before, beforeEach, after, afterEach, it */

/** This exploration focuses on the JavaScript Function object type,
  * a.k.a. [[FunctionObject]] instances.
  *
  * Some of this is just the basics, and sanity checks.
  * Some of it is about the foundations for a potentially interesting
  * module design pattern. More on that in:
  * ../modules/module-style.js
  */
describe('function-objects.js', function(){  
  'use strict'; 

  var must   = require('must');
  var logger = require('utilios/logger')('funcyObjs');
  logger.level('debug');


  /* This context explores extremely basic stuff down in the roots of
   * JavaScript's type system. 
   */
  context('when metaprogramatically reflecting', function(){
    // curious, no name conflict. I guess foo defined on the RHS, and then redefined on the left?
    var foo = function foo(){
      throw new Error("look, don't touch");
      }

    /* Initially it seemed there might be an issue here:
     * http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
     * That's worth reading just to wrap one's head around some possibly non-intuitive details.
     *
     * Nonetheless, seems this really isn't an complex issue. There is
     * a simple and performant solution. Just use typeof:
     * http://jsperf.com/alternative-isfunction-implementations/4
     */
    it('must be able to determine if an object is a Function', function(){
        // As per the above jsperf link, both of the following are
        // pretty close in performance, so whichever or whatever makes
        // the linter happy.
	must(typeof foo == 'function').true();
	must(typeof foo === 'function').true();
      });

    it.skip('should mess around with Object instanceof Function and Function instanceof Object', function(){
      //JFT-TODO: might as well
      //http://stackoverflow.com/questions/23622695/why-in-javascript-both-object-instanceof-function-and-function-instanceof-obj
      });

    //JFT-TODO: more tomfoolery:
    //http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class
    });


  // http://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript
  context('when using the module design pattern', function(){

    var aModule =  (function(){
      return function(){
	return "yo";
	}
      })();

    var anotherModule =  (function(){
      var crossCallsState = 1;

      // if IIFE is not a method invocation, then (in strict mode) "this" should not be defined
      must(this).undefined();

      var underConstruction = function(){
	return 42;
        };

      var underConstructionsStateModder = function(){
        return crossCallsState++;
        };
      underConstruction.stateModder = underConstructionsStateModder;

      underConstruction.self = underConstruction;
      underConstruction.someProp = "value of someProp";
      return underConstruction;
      })();


    it('should be returning a function', function(){
      var fooMod = aModule;
      var isThatAFunction =  fooMod && {}.toString.call(fooMod) === '[object Function]';
      must(isThatAFunction).true(); 
      });  

    it('should be able to call the module function', function(){
      must(aModule()).equal('yo');
      });  

    it('a funcy object should be 1. invokable, 2. maintain stated, & 3. have properties', function(){
      var daMod = anotherModule;
      must(daMod()).equal(42);
      must(daMod.stateModder()).equal(1);
      must(daMod.stateModder()).equal(2);
      must(daMod.stateModder()).equal(3);
      must(daMod.someProp).equal('value of someProp');
      });  
    });


  });
