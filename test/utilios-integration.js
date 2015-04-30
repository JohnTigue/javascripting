/* global console, require, describe, context, before, beforeEach, after, afterEach, it */

/** This is a curious case. I don't really know where to put this code. 
  * Since this whole nodeio repo is for me kicking around node and such,
  * well this code is being put here in the nodeio repo because "and such"
  * includes npm. What needs to be test is I have modules wired up properly.
  * I want to do that short of publishing a package on the npm system. Fortunately,
  * npm can install dependencies via GitHub URLs, so if you look in this
  * repos package.json you will find the follow bit:
  *   "dependencies": {
  *      "bluebird": "^2.9.24",
  *      "bunyan": "^1.3.5",
  *      "superagent-bluebird-promise": "^2.0.1",
  *      "utilios": "git://github.com/JohnTigue/utilios.git"
  *      }
  *
  * That last one is the unusual bit. Notice how it is a git:// URL rather
  * than simply a npm semver spec. `npm install` will grap that git:// URL and
  * park its contents in this repo's node_modules directory along with the
  * other 3 dependencies. (Notice how this git URL spec provides a greater 
  * level of naming freedom compared to the usual way of having to name dependencies 
  * using their "global" name in the npm system. But since this is a test run of
  * how a package would be used in npm and that package would be named "utilios"
  * then is seems like a good idea to arbitrarily name it "utilios when fetched
  * via git:// rather than through the npm package libary system. [ugh, so wordy])
  * 
  * Furthermore, that freedom really isn't there if using npm CLI to install:
  *   `npm install JohnTigue/utilios --save`	
  * That will update package.json as follows:
  *   "dependencies": {
  *     "utilios": "git://github.com/JohnTigue/utilios.git"
  *     }
  */
describe('utilios-integration.js', function(){  
  'use strict'; 

  var must = require('must');

  // One more than normal level of context/descibe in this case b/c lexically hiding required modules from other test.
  context('when requiring specific utilios sub-modules', function(){
    var logger = require('utilios/logger')('someLogComponentName');
    logger.level('debug');

    describe('and have required only utilios/logger', function(){
      it('logger should exist. (And there should be "Hello, world." message in the mocha output.)', function(){
        must(logger).exist();
        logger.debug('Hello, world.');
        });
      });
    });


  context('when require utilios as one super unit', function(){
    var utilios = require('utilios');

    describe('i.e. require("utilios")', function(){
      it('the module should have its sub-modules a properties', function(){
        must(utilios.logger).exist();
        });
      });
    });
  });

