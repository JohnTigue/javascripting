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
    var aPromise = null;

    /* These tests are stuctured in a style wherein before() drives the
     * SUT to the state at which to be tested. In this style it() just
     * does asserts, it() does not change the state of SUT. Mocha will
     * wait for the Promise returned by before to resolve before calling
     * it.
     */
    before(function(){
      aPromise = Promise.resolve('basically, unit');
      });

    it('must in then(), find the value supplied earlier during resolve()', function(){
      return aPromise.then(function(aValue){
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

    function seriallyExecute(someTasks){
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
      whatWereTheResults = seriallyExecute(someAsyncNoteGeneratingTasks);
      return whatWereTheResults;
      });

    it('must execute them one at a time', function(){
      // By the time it() is called, the Promise returned by before() has resolves
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
   * type signature ("nodeback") is nasty and one can find oneself
   * interacting with those turds frequently. Some of the Promises
   * libraries have utilities for just such a situation i.e. "take a
   * node system library an wrap it in a Promise." In Q it is called
   * Q.denodeify() and in Bluebird it is called
   * Promise.promisify(). Here the code uses Bluebird.
   *
   * Bluebird's wiki even encourages the use of promisify for reasons
   * of efficiency and error handling:
   * https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns#the-deferred-anti-pattern
   *
   * Note that if promisify (or an equivalent denodeifier) is used
   * then seriallyExecute() is just a one-liner. Promises!
   */
  context.only('When there is a list of nodeback async tasks to perform sequentially', function(){
    var whatWereTheResults = null;

    /* For the purposes of testing, need to come up with some
     * node-style "library" function a.k.a. a nodebacker. In this
     * case, just take in a number and after a random few milliseconds
     * return the number squared.
     *
     * Normally, such a thing wouldn't know about promisify, but for
     * self-pedagogical purposes the callback is labeled
     * aPromisifyGeneratedCallback to indicate where the in the world
     * that thing came from.
     */
    function aNodebacker(someNumericInputParam, aPromisifyGeneratedCallback){
      logger.debug('aNodesqueFunction('+someNumericInputParam+') kicked off');
      var someMillis = Math.floor(Math.random() * 100);
      logger.debug('aNodesqueFunction('+someNumericInputParam+') is starting');
      var onCompleted = function(){
        logger.debug('aNodesqueFunction('+someNumericInputParam+'): calling back');
	aPromisifyGeneratedCallback(null, someNumericInputParam * someNumericInputParam);
	};
      setTimeout(onCompleted, someMillis);
      }

    var aPromisifiedNodebacker = Promise.promisify(aNodebacker);

    function seriallyExecute(someTasks){
      return someTasks.reduce(function(chainedPromises, nowDoThis){
        return chainedPromises.then(function(aResultsAccumulator){
console.log('in cP.then()');

          return aPromisifiedNodebacker(nowDoThis).then(function(aResult){
console.log('aPN('+nowDoThis+') --> '+aResult);
            aResultsAccumulator.push(aResult);
            return(aResultsAccumulator);
/*


          return nowDoThis().then(function(aResult){
            return aResultsAccumulator.push(aResult);
*/
            });
          });
        },
        Promise.resolve([]) 
        );      
      } 

    before(function(){ 
      var someNodeStyleAsyncTasksPromisified = [1, 2, 3, 4];
        //.map(function(i){
        //return aNodesqueFunctionPromisified;
        //JFT-TODO: console.log() these and they are different: return aNodesqueFunctionPromisified.bind(null, i);
	//});

//console.log(someNodeStyleAsyncTasksPromisified.length);
someNodeStyleAsyncTasksPromisified.forEach(function(each){console.log(each);});

      whatWereTheResults = seriallyExecute(someNodeStyleAsyncTasksPromisified);
      return whatWereTheResults;
      });

    it('must execute them one at a time', function(){
      // By the time it() is called, the Promise returned by before() has resolves
      whatWereTheResults.then(function(theResults){
        must(theResults).eql([1, 4, 9, 16]);
        });
      });
    });

  
  });
