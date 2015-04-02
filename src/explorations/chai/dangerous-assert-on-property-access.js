'use strict';

/** Drive this via mocha, say:
  *   mocha -watch --recursive --bail src/explorations/chai/   
  */
var expect = require('chai').expect;
var aDummyObject = {};

describe('dangerous-assert-on-property-access.js', function(){

  /** That this is a thing is so very unfortunate:
    *   https://github.com/moll/js-must#asserting-on-property-access
    */
  describe('when dangerously asserting on undefined property access', function(){
    it('should fail but it actually passes', function(){
      // this just evaluates to undefined, silently.
      expect(aDummyObject).to.not.throwAnErrorEvenThoughThisPropertyIsNotDefined;      

      // instead always assert on function calls which will throw if undefined.
      //assert(aDummyObject.aMethodUndefined());
      });
    });
  });
