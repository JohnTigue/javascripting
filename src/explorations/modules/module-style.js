/* global console, require, describe, context, before, beforeEach, after, afterEach, it */

/* This exploration is for working out a idiomatically JavaScript
 * style of module "design pattern."
 */

/* Goals
 * - Elegant in ES6 module syntax
 * - Elegant in ES5 modules
 * - Enable 'use strict' in the "function form" to keep
 *   JSHint happy and reap the benefits of the Use Strint Directive
 * - Enable documentation generation via JSDoc
 *   http://usejsdoc.org/howto-commonjs-modules.html
 * - Provide as much info as possible for debugging
 */

/* See ../javascript/funcy-objects.js for the basic language
 * syntax and capabilities that are leveraged in this
 * design. This work is probably not original; someone
 * must have trodden very similar territory before me
 * but it's fun and educational as to what might be maximially
 * idiomatic modular JavaScript.
 */

/* Writing in mid-2015, ES5 and ES6 should both be taken into
 * consideration. So, this is how to write modules in a style
 * that is explicitly ES5, but which migrates trivially to ES6.
 *
 * I definitely like the idea of export a single thing, which in
 * JavaScript means an Object. Further, if the exported Object is a
 * Function, a [[FunctionObject]], then it can be invoked but also can
 * have properties that can be externally get/set. Note: the Function
 * returned is not intended to be used as a constructor. For
 * that-which-is-to-be-eported, all that seems like a natural, native,
 * maximally JS choice (especially if the Function exported is the
 * product of an IIFE, meaning that the invoked FE's closure can hang
 * around to keep internal state).
 *
 * This is encouraged by node:
 * https://nodejs.org/docs/latest/api/all.html#all_module_exports
 *   The module.exports object is created by the Module system. Sometimes this is not acceptable; 
 *   many want their module to be an instance of some class. To do this, assign the desired export object to module.exports. 
 *
 * As an example, require() itself seems to have properies.
 *
 * Anohter example, Express apps start as follows:
 *   var express = require('express');
 *   var app = express();
 *
 * OK, so this is what? Some mutant FP style JS module?
 *
 * Note also that in ES6 default exports, that-which-is-exported is anonymous:
 *     export default function (...) { ... };

 * So, that ES6 default has the same interface as in the earlier JS module pattern wherein
 * a IIFE returns an anonymous function, so that is an nice style similarity
 * upon which to design now.
 *
 * Of course, the ES6 default just a function
 * being returned, without a closure to maintain state across
 * invocations. The similarity here is simply that the interface is
 * similar in that what is returned is a function, but note the
 * separate issue of the IIFE of the module pattern is intended to set
 * up a state preservation mechanism via a closure, which is why a function
 * is returned, a an Object would also suffice to cause the "parent"
 * closure to hang around on the heap after teh associated function invokation
 * completes. It's lexical scoping that cuases the hang-around, not necessarily
 * first class functions. Right? But wikipedia says:
 * (http://en.wikipedia.org/wiki/Closure_%28computer_programming%29)
 *
 *   "closures (also lexical closures or function closures) are a
 *   technique for implementing lexically scoped name binding in
 *   languages with first-class functions."
 * 
 * If just an Object is exported then it cannot be invokes as a
 * Function. (How this works according to strict CommonJS is not clear
 * to me... i.e.  exports expects to have properties assigned on it,
 * not to be redefined via: exports = randomFunction(). But node just blows 
 * that restriction off by also passing in module.exports not just
 * CommonJS's exports. Right?
 * 
 * More importantly, for reasons I have not dug into, it seems the TC39
 * folks feel the same:
 *     "One of the design goals of the ES6 modules spec was to favour default
 *     exports. There are many reasons behind this, and there is a very
 *     detailed discussion on the ES Discuss site about it. That said, if you
 *     find yourself preferring named exports, that’s fine, and you shouldn’t
 *     change that to meet the preferences of those designing the spec."
 * At least according to:
 *     http://24ways.org/2014/javascript-modules-the-es6-way/
 * Which does link to the ES Discuss site's discussion of said gaol:
 *     https://esdiscuss.org/topic/moduleimport#content-0
 * Which, again, I haven't digested b/c big-time TL;dr but I did catch:
 *     "ES6 favors the single/default export style"
 * Search that doc for "single/default"
 * I only got a quarter the way through the doc.
 *     
 *
 * Babel is one of the two best ES6 to ES5 transpilers:
 * https://babeljs.io/
 * 
 * Put this into it:
 * export function foo(){}
 * 
 * Out comes the following:
 * exports.foo = foo; function foo(){}
 * 
 * Why exports and not modules.exports? Seems the former is from
 * the CommonJS spec, while the latter is a node extension:
 * http://wiki.commonjs.org/wiki/Modules/1.1
 * 
 * Arguably (and I agree) module.exports is more explicit but I really
 * wonder about the wisdom of the node folks with regards to
 * introducing what seems like a conceptually noxious foolish
 * redundancy. I just don't know the history enough, I guess. Perhaps
 * it has to do with being able to export a Function rather than
 * assign properties to exports.
 * http://stackoverflow.com/questions/7137397/module-exports-vs-exports-in-node-js
 * 
 * <rant> 
 *
 * Seriously, WTF!?! JavaScript was already ugly enough and then when
 * it finally gets a second chance as it broke out of the browser
 * with a solid beachhead in the server via Node.js, well, more
 * ugliness. For example: fucking nodebacks. Seriously? Another missed
 * opportunity to give some self-respect to JS coders. Oh, well, at least
 * Promise.promisify() and other denodifiers can be used to bury that
 * skeleton.
 *
 * </rant>
 * 
 * So, just to be uptight and explicit, the main/final statement will
 * be an assignment of a function to module.export like in the sample
 * module exportation in the above stackoverflow link, which is of the
 * form:
 * module.exports = exports = fooer = function foo_module(cfg) {...}

[ ] JFT-TODO: well, doesn't that kinda tie the module to node? and
for what benefit? Would it not be wiser to just:
 * exports = fooer = function foo_module(cfg) {...}
except of course that will fail in node b/c module is what matters,
  specifically module.exports, while on the other hand exports is just an unbound variable that starts out referencing module.exports 
  so the above will just reassign exports and the exporation process will leave module.exports == null (or undefined, or maybe it's {})
  I wonder why the CommonJS folks didn't, similar to AMD, have the concept of a define function call with, say, a return value which becomes the module's export
    have a free variable for the interface point seems crude. Sure ADMs define is ugly but was there not some middle ground?
  [ ] what actually goes on under the hood? is the require() file's contents "included" inside a IIFE or such? and if so what precisely does "included" mean?

[ ] But then exports AND fooer are unbound (with regards to having JSHint STFU).

Here's what node has to say about it:
https://nodejs.org/api/modules.html#modules_module_exports
https://nodejs.org/api/modules.html#modules_exports_alias

Maybe node already had a "Module system" going and then in harmonizing to CommonJS standardization
they added exports as a ref to module.exports just to satisfy the standard,
and the "coincidence" of exports and module.exports have the same name
has caused confusion ever since.



[ ] Wait, does CommonJS prevent returning just a single function? B/c cannot:
    exports = function(){}
No one yelled at this guy:
    http://stackoverflow.com/questions/9736957/is-it-ok-to-make-the-exports-object-a-function-in-commonjs
    but both folks in the chat are actually assigning to module.exports which isn't a CommonJS thing
    And what the one answer IDs as "revealing module pattern, isn't if using Osmani's books def
    Responder does provide some nice links


Then there is the "revealing module pattern":
  http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript
  The only distinction between "module pattern" and "revealing module pattern" that I see
  is that the latter just cleans up the returned object litteral to only have props whose values are names of other props/functions
    sure looks like an interface that is being returned so why not call it that rather than just return an anonylous Object literal.
       what would be the benefit of that and wouldn't it be overloading the word "interface" although JS doesn't use that word...

Notice also that Osmani is making a distinction between returning an Object (via module pattern) and "returning a function" (via IIFE)
  http://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript
  "
  I'm confused. an IIFE just runs a
 */


/* Enabling JSDoc to do its job: 
 
 /

/* Bibliography:
 * http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
 * http://benalman.com/news/2010/11/immediately-invoked-function-expression/
 *   This may well be where IIFE was defined in 2010, although the same thing moved under a different name earlier
 * http://toddmotto.com/mastering-the-module-pattern/
 * http://24ways.org/2014/javascript-modules-the-es6-way/
 * https://esdiscuss.org/topic/moduleimport#content-0
 * JSDoc: documentation for CommonJS (ergo node) modules. And I have to assume ES6
 *   http://usejsdoc.org/howto-commonjs-modules.html
 * http://dailyjs.com/2012/01/26/effective-node-modules/
 * - just some intermediate style tips
 * returning a Function (rather than simply an Object literal), 3 styles of module.export =  
 * - also: the "double constructor" idiom. 
 * - http://stackoverflow.com/questions/18503349/differences-between-three-different-ways-using-module-exports
 */
describe('module-style.js', function(){  
  'use strict'; 

  var must   = require('must');
  var logger = require('utilios/logger')('funcyObjs');
  logger.level('debug');


  /* Simply to ensure that the module system, (reified as require()
   * and module.exports, is actually being fully tested, a trivial
   * module is imported. 
   *
   * This is an unusual test in that what is actually under test is
   * the module interface style, rather than some specific
   * functionality. So, some dummy Math-y functions will be used to
   * simply to have something done, including maintaining state.
   *
   * I would not expect that normally names would include "FuncyObject" 
   * because it is simply a module interface design style name, rather
   * than indicative of what the thing being imported is/does.
   */
  var exampleFuncyObject = require('./example-funcy-object-module.js');

  context('when using the FuncyObject module design pattern', function(){
    it('must metaprogramatically be able to reflect that a funcyObject module instance is a Function', function(){
	must(typeof exampleFuncyObject === 'function').true();
      });

    it('a FuncyObject should 1. Be invokable', function(){
      must(exampleFuncyObject()).equal(40);
      });  

    it('a FuncyObject should 2. Be able to maintain stated', function(){
      must(exampleFuncyObject.stateModder()).equal(40);
      must(exampleFuncyObject.stateModder()).equal(41);
      must(exampleFuncyObject.stateModder()).equal(42);
      });  

    it('a FuncyObject should 3. Have properties', function(){
      must(exampleFuncyObject.drummer).equal('Clyde Stubblefield');
      });

    it('must be able to internally access those properties', function(){
      must(exampleFuncyObject.isDrummerFunky()).equal(true);
      });  
    });
  });
