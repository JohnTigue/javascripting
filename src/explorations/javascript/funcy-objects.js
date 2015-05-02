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
