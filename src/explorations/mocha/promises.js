/* global describe, console, require, before, beforeEach, after, afterEach, it */

/** The explorations of mocha's fundimentals series continues...
  * 
  * This file explores the handling of promises, maximally leveraging what is built into 
  * mocha while minimizing help from other libraries. Turns out mocha-as-promised
  * is not necessary. And node's build-in assert does just fine.
  *
  * After a bit of research, decided to go with Forbes Lindesay's Promise library:
  *   https://www.npmjs.com/package/promise
  *
  * One can read up on that at https://www.promisejs.org/
  *
  * He also did talks on it:
  *   Forbes Lindesay: Promises and Generators: control flow utopia -- JSConf EU 2013:
  *     https://www.youtube.com/watch?v=qbKWsbJ76-s
  *
  * Install it:
  *   npm install promise --save
  */
describe('builtin-promises-test.js:', function(){
  // Moved all the code into one big file-wide describe to keep JSHint from saying: 
  //   Use the function form of "use strict"
  'use strict'; 

  var assert = require('assert');
  var http   = require('http');
  var fs     = require('fs');

  // Following Lindesay's style here. I guess the Capital is to imply class-ness? Dunno.
  var Promise = require('promise');

  context('when simply instantiating a Promise', function(){
    var aPromise = null;
    before(function(){
      // If no function as first param throws: TypeError: not a function
      //   var aPromise = new Promise();	
      aPromise = new Promise(function(){});
      });

    it('should be able to instantiate a Promise', function(){
      assert(aPromise, 'aPromise is truthy');
      });
    });


  context('when auto-resolving a Promise', function(){
    var bPromise = null;
    before(function(){
      bPromise = new Promise(function(resolve, reject){
        resolve("insta-resolve");
        });
      });

    // Notice how there is no need for a done callback in params of the function passed in.
    // With a simple async callback, that would need to be function(done){}
    it('should find the supplied resolved value in then()', function(){
      return bPromise.then( function( resolution ) {
        assert.equal(resolution, 'insta-resolve', 'bPromise insta-resolved');
        });
      });
    });


  context('when auto-rejecting a Promise', function(){
    var aPromise = null;
    before(function(){
      aPromise = new Promise(function(resolve, reject){
        reject( "insta-resolve" );
        });
      });

    // Here's the most elegant solution from 2014-11:
    //   http://stackoverflow.com/a/26572442
    //   1. No done passed into it()'s callback
    //   2. No rejection handler (could suppress errors)
    //   3. Return the Promise
    //   4. I guess mocha will then() on it and repsond appropriately
    it('should throw', function(){
      return aPromise.then(function(resolution){
        assert.fail("", "", "aPromise should have rejected", "");
        });
      });
    });
  });

