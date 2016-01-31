/** Drive this via mocha.
  * 
  * This simply reports on some experimentation with chai and Promises.
  * The two it()'s below are extremely similar:
  *   The former is not async'd, instead it returns the Promise.
  *   The latter is async'd, and fails oddly.
  */
describe('chai-101-quirks.js', function(){
  'use strict';

  var Promise = require('promise');
  var expect  = require('chai').expect;

  context('when using chai expect inside a Promise\'s then()', function(){
    it('can fail with helpful error messages', function(){
      expect(true).true; // set this to false and will appropriately throw a AssertionError
      var aPromise = new Promise(function(resolver, rejector){
        resolver('unitified null-ish');
        });
      return aPromise.then(function(aValue){
        // this does throw an AssertionError, as expected.
	expect(false).true; 
        });
      // ergo, everthing when as expected in this it(), so follow this non-async'd style.
      });

    it('can fail with lame error messages', function(done){
      expect(true).true; // set this to false and will appropriately throw a AssertionError
      var aPromise = new Promise(function(resolver, rejector){
        resolver('unitified null-ish');
        });
      aPromise.then(function(aValue){
	// This is odd bit:
        // When it() is set-up async (via the "done" in the callback params above) 
        // if expect(false).true inside this then() it will cause a timeout 
        // to be reported which is unexpected. So, don't do it() this way.
	expect(false).true; 
	done(); // this seems to not be reach, yet the previous "expect" fails silently
        });
      });
    });
  });

/** Note that chai-as-promised is not require()'d here. Yet
  * from the documentation is seems like that is just a fluent nicety, not
  * basic machinery chai needs to handle promises.
  *   http://chaijs.com/plugins/chai-as-promised
  * chai-as-promised MIGHT require mocha-as-promised:
  *   http://stackoverflow.com/questions/20931737/chai-as-promised-is-eating-assertion-errors?rq=1
  * But really, it's just a less explicitly clear "conveniences" compared to not using it?
  *   http://stackoverflow.com/a/26572442
  * 
  * I am not really digging chai. Especially given:
  *   ./dangerous-assert-on-property-access.js
  * Seems like a big downside and its value is not clear, dispite 
  * its popularity. So, not digging into chai-as-promised yet as I'll be 
  * experimenting with other assertion libraries for the time being.
  */
