/* global describe, console, require, before, beforeEach, after, afterEach, it */

/*
 * This file is intended to be driven by mocha
 */
describe('dangerous-assert-on-property-access.js', function(){
  var expect = require('chai').expect;
  var aDummyObject = {};

  /** That this is a thing is so very unfortunate:
    * https://github.com/moll/js-must#asserting-on-property-access
    *
    * Seems that the core mistake was to take Ruby culture and apply
    * it to JavaScript, which does not have Ruby's method_missing to
    * catch the undefined property being used.
    */
  describe('when dangerously asserting on undefined property access', function(){
    it('should fail but it actually passes', function(){
      // The following just evaluates to undefined, silently
      // i.e. without throwing to indicate that a test did not go as
      // expected:
      expect(aDummyObject).to.throwAnErrorOnThisUndefinedPropertyButNoooooooooooooooooooo;

      // Instead always assert on function calls which will throw if undefined 
      // (even, of course, if not under the control of Use Strict Directive).
      // For example, uncomment the following line and the test will fail
      //expect(aDummyObject).anUndefinedMethod();

      // But notice that this do-not-assert-on-property-access rule 
      // cannot be enforced in Chai, so no thank you.
      });
    });
  });
