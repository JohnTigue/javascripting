/* global console, require, describe, context, before, beforeEach, after, afterEach, it */

/** This file kicks the tires of SuperAgent and Nock:
  * http://visionmedia.github.io/superagent
  *
  * The goala here are to:
  * - exercise SuperAgent's basic functionality
  *   - GET
  *   - JSON handling
  *   - cancelling (currently a #FAIL b/c of Bluebird, search for "BROKEN IN LIB")
  * - interact with it via Promises (via an adaptor)
  * - ensure that isolated unit testing can be done via Nock 
  */
describe('sueragent-tirekicker.js', function(){  
  'use strict'; 

  // Logging machinery:
  var bunyan = require('bunyan');
  var logger = bunyan.createLogger({name: 'myapp'});
  logger.level('debug');
  
  // Testing machinery:
  var must   = require('must');
  var nock   = require('nock');

  /* Note: in any normal situation other than this unusual one
   * (i.e. here I am testing SuperAgent and the Promise adaptor)
   * would only require superagent-bluebird-promise.
   */
  // The SuperAgent docs require() into "var request =" but why not call it what it is?
  var superAgent = require('superagent');
  // The superagent-bluebird-promise docs also "var request =". Why not do better?
  var supestAgent = require('superagent-bluebird-promise');


  /* First, how about the absolute minimal 101 exploration: a GET, no
   * Promises i.e. via superagent, not superagent-bluebird-promise.
   */
  context('When dealing with a simple GET, without adaptors (read: not Promisified)', function(){
    before(function(){
      var aScope = nock('http://tigue.com')
	.get('/foo/bar')
        .reply(200, 'blah blah John Tigue blah bla');
      });

    it('should be able to find "John Tigue" in tigue.com/foo/bar response', function(done){
      superAgent
      .get('http://tigue.com/foo/bar')
      .end(function(anErr, aResp){
        if(anErr){
          console.log(anErr);
          throw anErr;
          }
        must(aResp.status).equal(200);
        must(/John Tigue/.test(aResp.text)).true();
        done();
        });   
      });
   
    after(function(){
      nock.cleanAll();
      });
    }); 


  /* Seems SuperAgent doesn't do Promises out of the box. It would
   * be easy enough to hand-craft an adaptor but that would be 
   * foolish as it seems someone is already on it, even specifically
   * for Bluebird Promises which is what I've settle on after 
   * experimenting with other Promise implementations. 
   * 
   * So, bring that existing work in and kick it around a bit:
   * https://www.npmjs.com/package/superagent-bluebird-promise
   * https://github.com/KyleAMathews/superagent-bluebird-promise
   */
  context('When adapted to be all fancy with those Promise things', function(){
    before(function(){
      var aScope = nock('http://example.com')
	.get('/')
        .reply(200, 'blah blah foo bar blah bla');
      });

    /* This is a trivial test of superagent-bluebird-promise. Moving
     * into Promises so notice that no "done" is passed into the
     * callback, rather just return the Promise, no catch()
     * needed either. Mocha's tight like that.
     */
    it('should be able to interact via bluebird-promises', function(){
      return supestAgent
        .get('http://example.com/')
        .then(function(aResp){
          must(aResp.status).equal(200);
          // The following form give lame error message like: AssertionError: false must be true
          // must(/John Tigue/.test(aResp.text)).true();
	  // So instead the following (at cost of no regexp but better message):  
          must(aResp.text).include('foo bar');
          });
      });

    after(function(){
      nock.cleanAll();
      });
    });


  /* petkaantonov is Bluebird's lead and he said:
   * https://github.com/petkaantonov/bluebird/issues/537#issuecomment-84051835
   * 
   * "cancellation in 2.x is horribly broken by design and wontfix and
   * cannot be made to work with all bluebird features
   * consistently. Cancellation has been redone for 3.0"
   *
   * As I write this Bluebird is at 2.9.24
   */
  context.skip('BROKEN IN LIB: When cancelling a response Promise', function(){
    var subjectRequestCompleted = false;

    it('should be cancellable', function(){
      var aPromise = supestAgent
        .get('http://tigue.com/')
        .then(function(aResp){
        if(aResp.status == 200)
            subjectRequestCompleted = true;
          }); 
      aPromise.cancel();
      return aPromise;
      });

    after(function(){
      // Asserting in here is weird but the Promise will have resolved
      // one way or another at this point,
      must(subjectRequestCompleted).equal(false);
      });
    });


  context('when a JSON Resource is requested', function(){
    before(function(){
      var scope = nock('http://example.com')
        .replyContentLength()
        .get('/foo')
        .reply(200, {foo:"bar"}, {"Content-Type": "application/json"});

	// The follow works as well:
        //.reply(200, '{"foo":"bar"}', {"Content-Type": "application/json"});
      });

    function dumpHeaders(aResp){
      for(var aPropKey in aResp.header){
        logger.debug('aResp.header["'+aPropKey+'"]='+aResp.header[aPropKey]);
        };
      };
      
    it('should have a shiny res.body with pre-parsed JSON', function(){
      // http://visionmedia.github.io/superagent/#response-properties
      return supestAgent
        .get('http://example.com/foo')
        .then(function(aResp){
	  must(aResp.status).equal(200);
	  //dumpHeaders(aResp);
	  must(aResp.header['content-type']).equal('application/json');
	  must(aResp.body).eql({foo:'bar'});
          });
      });  

    after(function(){
      nock.cleanAll();
      });
    });
  });
