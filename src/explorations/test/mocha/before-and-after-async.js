/* global describe, console, require, before, beforeEach, after, afterEach, it */

/** Drive this via mocha. 
  * XSimple 101 explorations of mocha.
  * The episode is for the before and after hooks, specifically the async aspects.
  * For async'ing during setup looks like in before(foo), foo can be passed a done function, just like the it()'s.
  * In both cases, before() and it(), mocha waits for done().
  */

var assert = require('chai').assert;

describe('async-before-and-after.js', function(){
  'use strict';
  describe('when before\' 1st param is a function with arity=0', function(){
    before(function(){
      console.log("before1");
      });
    it('should move along rather synchronously',function(){
      console.log("it1");
      });
    });

  describe('when before\'s 1st param is a function with arity=1', function(){
    before(function(thatsAllFolks){
      console.log("before2.1");
      thatsAllFolks();
      console.log("before2.2 i.e. still in before() and 'done' has been call-backed already.");
      });
    it('should wait for that function to get callbacked',function(){
      console.log("it2");
      });
    });

  describe.skip('when before\'s 1st param is a function with arity=1 but that callback doesn\'t get called (it should #FAIL)', function(){
    before(function(thatsAllFolks){
      console.log("before3");
      });
    // This should #FAIL
    it('should wait for that function to get calledbacked',function(){
      console.log("it3");
      });
    });
  });
