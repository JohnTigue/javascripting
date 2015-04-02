'use strict';

/** Drive this via mocha, say:
  *   mocha -watch --recursive --bail src/explorations/sinon/   
  *
  * Following this style:
  *   https://sites.google.com/site/unclebobconsultingllc/specs-vs-tests
  * I.e. the it()'s only do asserts. Rigging state happens in the various before()'s
  */
var assert = require('chai').assert;

var sinon  = require('sinon');

// This is straight off the home page (http://sinonjs.org/) with minor tweaks to kick things around.
describe('sinon-101-test.js', function(){

  describe('when kicking the tires with spy() set up to exercise a Once', function(){
    var aSpy = null;
    function once(fn){
      var returnValue, called = false;
      return function (){
        if (!called) {
          called = true;
          returnValue = fn.apply(this, arguments);
          }
        return returnValue;
        };
      }

    before(function(){
      aSpy = sinon.spy();
      var proxy = once(aSpy);
      proxy();
      proxy();
      });

    it('the Once should only allow the spy to get called once',function(){ 
      assert(aSpy.calledOnce, 'spy called only once');
      });
    });
  });
