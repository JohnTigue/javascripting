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
  
  /* For the purposes of testing, need to come up with some
   * node-style "library" function a.k.a. a nodebacker. In this
   * case, just take in a number and after a random few milliseconds
   * return the number squared.
   *
   * Normally, a nodebacker wouldn't know about Promise.promisify()
   * and this dummy one doesn't either but, for self-pedagogical
   * purposes, here the callback is labeled
   * aPromisifyGeneratedCallback in order to indicate where in the
   * world that thing came from i.e later in this file
   * Promise.promisify() will be used and it will come up with the
   * callback (which will involve Promise settling logic). Although,
   * any node style callback (i.e. function(err,value){}) could be
   * used with this dummy nodebacker, which is representative of node-style
   * library functions, with which Promise.promisify() is designed to interact.
   */
  function aSquaringNodebacker(someNumericInputParam, aPromisifyGeneratedCallback){
    logger.debug('aNodesqueFunction('+someNumericInputParam+') kicked off');
    var someMillis = Math.floor(Math.random() * 100);
    logger.debug('aNodesqueFunction('+someNumericInputParam+') is starting');
    var onCompleted = function(){
      logger.debug('aNodesqueFunction('+someNumericInputParam+'): calling back');
      aPromisifyGeneratedCallback(null, someNumericInputParam * someNumericInputParam);
      };
    setTimeout(onCompleted, someMillis);
    }

  /* This is where the novelty of this test context is introduced:
   * the nodebacker is denodified i.e. promisified.
   */
  var aPromisifiedSquaringNodebacker = Promise.promisify(aSquaringNodebacker);

  // The SUT:
  // JFT-TODO: This could be moved out to a module. A promises-utils.js?
  // And eventually to another repo?

  /* This is the core of this experiment: using Array.prototype.reduce 
   * to serially execute an array of tasks.
   * 
   * Notice how this will called with simple single Promises and,
   * separately later in different tests, with compound Promises
   * i.e. this is reusable.
   *
   * JFT-TODO: this just feels awkward, like there's a superfluous bit
   * of Promise-ery being used.
   *
   * I still feel there's a higher level abstraction/construct
   * that I'm missing -- something that knows how to set the
   * accumulator object; as is, the accumulator is hardwired to []. 
   * But for now, as is, I have a Promises based async task
   * executor: in goes an Array of tasks and out comes an Array
   * of values, kinda a seriallyMap() or mapSequentiallyAsync().
   *
   * I would not be surprised it there is not already a standarly
   * named object that does this that I'm just not aware
   * of. ToDoList()? TaskQueue()?
   */
  function seriallyExecute(someTasks){
    return someTasks.reduce(function(chainedPromises, nowDoThis){
      return chainedPromises.then(function(aResultsAccumulator){
        return nowDoThis().then(function(aResult){
          aResultsAccumulator.push(aResult);
          return(aResultsAccumulator);
          });
        });
      },
      Promise.resolve([]) // JFT-TODO: still not happy with this [] in here.
      );      
    } 


  /* A simple Promises-based construct for how to serially execute a
   * series of async tasks, using "old-school" nodebacks (but not using
   * Promise.promisify or other denodifying utilities).
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
  context('When given an Array of async tasks to perform sequentially', function(){
    var whatWereTheResults = null;

    function kickOff(aTask, recordTo){
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

    function seriallyExecuteSansPromisify(someTasks){
      return someTasks.reduce(function(chainedPromises, nowDoThis){
        return chainedPromises.then(function(resultsAccumulator){
          return kickOff(nowDoThis, resultsAccumulator);
          });
        },
        Promise.resolve([]) 
        );      
      } 

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
      whatWereTheResults = seriallyExecuteSansPromisify(someAsyncNoteGeneratingTasks);
      return whatWereTheResults;
      });

    // By the time it() is called, the Promise returned by before() has resolves:
    it('must execute them one at a time', function(){
      whatWereTheResults.then(function(theResults){
        must(theResults).eql(['a', 'b', 'c', 'd']);
        });
      });
    });


  /* This is the exact same goal (i.e. "serially execute a series of
   * async tasks") and overall structure as the previous context. The
   * novelty is that in this case, the tasks have the type signature
   * of node system library functions i.e.:
   *   foo(inputParam, function callback(err, value)) 
   *
   * The reason this is interesting is that the standard node style
   * type signature ("nodeback") is nasty and sadly one can find oneself
   * frequently interacting with those turds. Some of the Promises
   * libraries have utilities for just such a situation i.e. "take a
   * nodebacker and wrap it in a Promise." In Q it is called
   * Q.denodeify() and in Bluebird it is called
   * Promise.promisify(). Here the Promises library uses Bluebird.
   *
   * Bluebird's wiki even encourages the use of promisify for reasons
   * of efficiency and error handling:
   * https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns#the-deferred-anti-pattern
   *
   * Note that if promisify (or an equivalent denodeifier) is used
   * then seriallyExecute() is just an -- admittedly long --
   * one-liner. Promises!
   */
  context('When there is a list of nodeback async tasks to perform sequentially', function(){
    var whatWereTheResults = null;

    before(function(){ 
      /*
       * One of the goals of this exploratory experiment is to come up
       * with a generic seriallyExecute(). Generic in that it only
       * knows it has tasks (read: zero arity functions) to run, but
       * it doesn't know about parameters to pass into the tasks. The
       * following bind() accomplishes that, yet seriallyExecute()
       * still accumulates the results... That _is_ a reduce() things
       * so maybe that's good enough. Doesn't feel right, though.
       */
      var somePromisifiedNodebackers = [1, 2, 3, 4].map(function(i){
        return aPromisifiedSquaringNodebacker.bind(null, i);
        });
      whatWereTheResults = seriallyExecute(somePromisifiedNodebackers);
      return whatWereTheResults;
      });

    // By the time it() is called, the Promise returned by before() has resolves
    it('must execute them one at a time', function(){
      whatWereTheResults.then(function(theResults){
        must(theResults).eql([1, 4, 9, 16]);
        });
      });
    });


  /* This is the same task serializer machinery as in the previous two
   * contexts, but this time each individual (composite Promise.all() based)
   * task will self-rate limit. The effect will be that for a given
   * set of tasks, the tasks will be performed one at a time and if any
   * task completes within a specified rate-limit window of time, it
   * will wait for a time-out before declaring that it has completed 
   * (read: settle the Promise as fulfilled).
   *
   * This exercise was worked out because OSM's Nominatim geocoder requires 
   * that only one lookup be performed at a time and the no more than one 
   * request happen per second.
   */
  context('when required to rate limit a sequence of tasks', function(){
    var startTime = null;
    var endTime = null;
    var rateLimitMinMillisPerTask = 100;  // OSM's Nominatim wants minimally 1000 between requests
    var somePromisifiedAndSelfRateLimitingNodebackers = null;
    var whatWereTheResults = null;

    // Simply set this to any quatity of numbers to run a different test:
    var someNumbersToBeSquaredAsync = [1, 2, 3, 4, 5];

    this.timeout((someNumbersToBeSquaredAsync.length + 1) * 1000);

    /* Each asynchronously-square-this-number task has 2 sub-Promises: 
     * 1. the dummy async worker (the squarer), which in a real context would 
     *    probably, say,  hit the net or storage for some request-response cycle.
     * 2. the rate limiter timout, which is just a setTimeout used
     *    to make sure the tasks are minimally spread out through
     *    time in order to, say, not annoy a rate limiting service.
     *
     * When both sub-Promises fulfills then the main composite Promise
     * can settle as fulfilled.
     */
    function getASelfRateLimitingPromiseOfASquaringTask(i){
      return function (){
	var aPromisedBitOfAsyncWork = aPromisifiedSquaringNodebacker(i);
	var aRateLimiterPromise = new Promise(function(resolve, reject){
	  var onCompleted = function(){
	    resolve();
	    };
	  setTimeout(onCompleted, rateLimitMinMillisPerTask);          
	});
	return Promise.all([aPromisedBitOfAsyncWork, aRateLimiterPromise]).then(function(aPairOfValues){
	  //aPairOfValues[1] is just the rate limiter resolution, w/o a value so ignore it
	  return aPairOfValues[0]; 
	  });
	};
      }

    before(function(){
      startTime = process.hrtime();
      somePromisifiedAndSelfRateLimitingNodebackers = someNumbersToBeSquaredAsync.map(function(i){
        return getASelfRateLimitingPromiseOfASquaringTask(i);
        });
      whatWereTheResults = seriallyExecute(somePromisifiedAndSelfRateLimitingNodebackers);
      return whatWereTheResults;
      });

    // Mocha will wait until the Promise returned by before() settles before calling it()
    it('must not excute the tasks in less time than the total of the minimal specified thresholds', function(){
      endTime = process.hrtime(startTime);

      whatWereTheResults.then(function(theResults){
        // Check that the workers did what was expected: asynchronously square some numbers
        must(theResults).eql(someNumbersToBeSquaredAsync.map(function(i){return i*i;}));
        });

      // Confirm that the list of things to do did not happen too fast
      var millisElapsed = endTime[0]*1000 + Math.floor(endTime[1]/1000000);
      var minimumExpectedMillis = rateLimitMinMillisPerTask * somePromisifiedAndSelfRateLimitingNodebackers.length;
      must(millisElapsed).above(minimumExpectedMillis);
      });
    });  
  });
 
