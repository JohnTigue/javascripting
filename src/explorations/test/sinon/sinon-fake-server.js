'use strict';

/** Drive this via mocha, say:
  *   mocha -watch --recursive --bail src/explorations/sinon/   
  *
  * Following this style:
  *   https://sites.google.com/site/unclebobconsultingllc/specs-vs-tests
  * I.e. the it()'s only do asserts. Rigging state happens in the various before()'s
  *
  * The follow were sources for the techniques used herein:
  *   http://sinonjs.org/
  *   https://www.airpair.com/javascript/posts/unit-testing-ajax-requests-with-mocha
  */
var assert = require('chai').assert;
var sinon  = require('sinon');


/** These tests evolved out of work on a caching geocoder which fetches data from OSM's Nomimatim geocoder, ergo the fake data's domain
  */
describe('sinon-fake-server.js', function(){

  var fakeNominatimAnswerForFes =  [{lat:'34.0341156', lon:'-5.0133482'}, {lat:'34.02813075', lon:'-5.01220890165468'}];
  describe.skip('when running test 1', function(){
    var aFakeServer = null;
    var requestUrl = "";

    before(function(){
      aFakeServer = sinon.fakeServer.create();

      aFakeServer.requests[0].respond(
        200,
        { "Content-Type": "application/json" },
        JSON.stringify([{ id: 1, text: "Provide examples", done: true }]));
      });

    it('should pass b/c not doing anything except testing async-ability and chai\'s assert', function(thatsAllFolks){  
      // The arity===1 of this function makes it async in that mocha will wait for thatsAllFolks to be called before moving on.
      assert(false, "Hitler was a nice guy");
      thatsAllFolks();
      });

    after(function(){
      aFakeServer.restore();
      });      
    });


  describe.skip('when experimenting with sinon.fakeServer.respondWith()',function(){
    var aFakeServer = null;

    before(function(){
      aFakeServer = sinon.fakeServer.create();
      aFakeServer.respondWith(
        "GET", 
        "/search/?q=Fes%2C%20Morocco&limit=5&format=json&addressdetails=1",
        //"http://nominatim.openstreetmap.org/search/?q=Fes%2C%20Morocco&limit=5&format=json&addressdetails=1",
        [200, { "Content-Type": "application/json" }, JSON.stringify(fakeNominatimAnswerForFes)]
        );
      });

    it('should route that fakery to through the system',function(thatsAllFolks){
      assert(false);
      thatsAllFolks();
      });

    after(function(){aFakeServer.restore();});      
    });
  });
