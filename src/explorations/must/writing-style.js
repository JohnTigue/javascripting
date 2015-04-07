/* global describe, console, require, before, beforeEach, after, afterEach, it */

/** The explorations of mocha's fundimentals series continues...
  * 
  * This file is the first wherein Must.js is being explored:
  *   npm install must --save-dev
  *   https://github.com/moll/js-must
  *
  * Main question:
  * 1. How is Must.js better than node's built in assert?
  */
describe('playground.js', function(){
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
