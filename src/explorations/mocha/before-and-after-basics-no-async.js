/* global describe, console, require, before, beforeEach, after, afterEach, it */

/** Drive this via mocha. Simple 101 explorations of the hooks in mocha.
  */

var assert = require('chai').assert;

/** So, just how complicated do the hooks get?
  * https://medium.com/@kanyang/hooks-in-mocha-87cb43baa91c
  */
describe('moch-before-and-after-basics-no-async.js', function(){
  'use strict';
  before(function(){console.log('beforeA');});
  beforeEach(function(){console.log('beforeEachA');});
  it('should be happy to be aliveA.1',function(){
    console.log('itA.1');
    assert(true);
    });
  it('should be happy to be aliveA.2',function(){
    console.log('itA.2');
    assert(true);
    });
  describe('describeB', function(){
    before(function(){console.log('beforeB');});
    beforeEach(function(){console.log('beforeEachB');});
    it('should be happier to be alive', function(){
      console.log('itB');
      assert(true);
      });
    afterEach(function(){console.log('afterEachB');});
    after(function(){console.log('afterB');});
    });
  it('should be happy to be aliveA.3',function(){
    // This will happen before itB
    console.log('itA.3');
    assert(true);
    });
  afterEach(function(){console.log('afterEveryA');});
  after(function(){console.log('afterA');});
  });

