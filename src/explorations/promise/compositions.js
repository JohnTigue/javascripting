/* global describe, console, require, before, beforeEach, after, afterEach, it */

/** This file is a collection of explorations of composing Promises.
  *
  * For basic single Promise explorations of how mocha interacts with
  * Promises, see: 
  * ../mocha/promise.js
  * 
  * The Promise library used here is Bluebird.
  * The assertion library used here is Must.js.
  * Logging is by Bunyan, which will look ugly if not set up properly.
  */
describe('compositions.js:', function(){
  'use strict'; 

  // Logging machinery:
  var bunyan  = require('bunyan');
  var logger  = bunyan.createLogger({name: 'myapp'});
  logger.level('info');
  
  // Testing machinery:
  var must    = require('must');

  var Promise = require('bluebird');


  /* Basic sanity check:
   */
  context('when insta-resolving a Promise in before()', function(){
    var bPromise = null;
    before(function(){
      bPromise = Promise.resolve('basically, unit');
      });

    it('must in then(), find the value supplied earlier during resolve()', function(){
      return bPromise.then(function(aValue){
        must(aValue).equal('basically, unit');
        });
      });
    });


  /* A simple Promises-based construct for how to serially execute a
   * series of async tasks.
   *
   * Check out this conversation:
   * http://derickbailey.com/2015/03/12/serially-iterating-an-array-asynchronously/
   *
   * Someone, in the comments cranked out an elegant solutions with
   * Promises serially chained via reduce(). That was the basis for the
   * solution worked out in this context(): 
   * http://jsbin.com/bikiba/10/edit?js,console 
   * 
   * Basically, using Array.prototype.reduce() to take an Array of
   * functions which are async tasks that need to be performed, one at
   * a time, and chain their execution together into a sequentially
   * executed series of Promises. If any one Promise gets rejected,
   * then the chaining halts and the rest of the functions/tasks
   * are not executed.
   */
  context('When given an Array of tasks to perform', function(){
    var whatWereTheResults = null;

    function kickOff(aTask, recordTo){
      // JFT-TODO: Perhaps a good place for Promise.promisify:
      // http://derickbailey.com/2015/03/12/serially-iterating-an-array-asynchronously/#comment-1906542548
      return new Promise(function(chooseResolve, chooseReject){
        aTask(recordTo, function(err){
          if(err){
            chooseReject(err);
            }
            else{
              chooseResolve(recordTo);
              }
          });   
        });   
      }

    function seriallyExecute(someTasks){
      return someTasks.reduce(function(chainedPromises, nowDoThis){
        return chainedPromises.then(function(resultsAccumulator){
          return kickOff(nowDoThis, resultsAccumulator);
          });
        },
        Promise.resolve([]) 
        );      
      } 

    /* This test is stuctured in a style wherein before() drives the
     * SUT to the state at which to be tested. In this style it() just
     * does asserts, it does not change the state of SUT. Mocha will
     * wait for the Promise returned by before to resolve before calling
     * it.
     */
    before(function(){ 
      var someAsyncNoteGeneratingTasks = ['a', 'b', 'c', 'd'].map(function(i){
        return function(aNoteArchive, callback){
	  var someMillis = Math.floor(Math.random() * 100);
	  logger.debug('async task '+i+' is starting');
          var onCompleted = function(){
	    logger.debug('async task '+i+' completed');
            aNoteArchive.push(i);
            callback();
	    };
          setTimeout(onCompleted, someMillis);
	  };
	});
      return whatWereTheResults = seriallyExecute(someAsyncNoteGeneratingTasks);
      });

    it('must execute them serially', function(){
      // By the time it() is called, the Promise returned by before() has resolves
      whatWereTheResults.then(function(theResults){
        must(theResults).eql(['a', 'b', 'c', 'd']);
        });
      });
    });
  });
