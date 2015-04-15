/* global describe, console, require, before, beforeEach, after, afterEach, it */
/* The above line is for letting JSHint know that mocha's function are OK to not complain about */

/** This file is intended to be run by mocha. This file does
  * not actually test anything, rather it documents my writing style
  * in mocha test files.
  * 
  * Mocha needs an assert library. Chai is very popular but I view 
  * it as a mistake. I got that insight from:
  *   https://github.com/moll/js-must#asserting-on-property-access
  * For an explicit test of that issue in this repo, see 
  *   ../chai/dangerous-assert-on-property-access.js
  *
  * Instead I use Must.js as the assertion library:
  *   npm install must --save-dev
  *   https://github.com/moll/js-must
  */
describe('writing-style.js:', function(){
  /** All code in my to-be-run-by-mocha files is contained within
    * a single describe(). The benefits of which include:
    * 1. JSHint will not say: Use the function form of "use strict"
    * 2. The functional form of the Use Strict Directive can be used
    *    and os external unrestricted code will not be forced into strict
    *    mode.
    * 3. I put the filename in the desciption so when multiple test
    *    files are run in a batch, the test report will contain the
    *    file name wherein test failures occurred.
    */
  'use strict'; 

  // Following invocation brings Must.js in as a single prop on Object.prototype.must?
  // I.e. not defining a var for use later in here a la must();
  //require('must');  

  // Following invocation probably does same side effects as previous one, plus now
  // "must" can be called as a function later.
  var must    = require('must');

  // Sundry usual suspects.
  var http    = require('http');
  var fs      = require('fs');
  var Promise = require('promise');

  context('when simply assert true !== false', function(){
    /** With this assert style it is possible to have Object.protype.must available 
      * for every "thing" except null and undefined:
      *   https://github.com/moll/js-must#asserting-on-null-and-undefined-values
      * So for a truly "unified style" it would seem could start asserts with an 
      * assert(), expect(), demand() or something:
      * 1. "expect" just leads to expect(foo).to.be
      * 2. "demand" (Must.js's style) would be terser i.e. demand(foo).be
      * 3. "must" clearly states who is doing the asserting and thumbs off this 
      * whole "I want an English sentence in my test asserts" thing. Also since "must"
      * is in it()'s descriptor, the parallel is somewhat obvious. And the English belongs
      * there in the descriptor for when the descriptors are concat'd:
      */
    it('must know true !== false',function(){
      must(true).not.equal(false);
      });
    });

  context('when just calling must(false)', function(){
    it('I would expect it to throw an error but noooooooooooooooooooo (Granted, that would probably require serious trickery)', function(){
      must(false);
      });
    })
  });
