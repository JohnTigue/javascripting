/** This file explores unexpected behavior by mocha with regards to strict mode.
  * This was only tested on mocha@2.2.1 on OSX 10.8.5
  *
  * For reference here is the relevant part of the ECMAScript Spec 5.1
  *   14.1 Directive Prologues and the Use Strict Directive
  *     http://www.ecma-international.org/ecma-262/5.1/#sec-14.1
  *
  * For clarity to distinguish the 2 instances of the Use Strict Directive in this file both variants are used, each once:
  *   'use strict';
  *   "use strict";
  * In all of the following steps only the former case is being commented out and re-enabled.
  * I.e. the test only modifies the first statement in the code, not the Use Strict Directive inside an it() further down in the file.
  *
  * Here's the unexpected bahavior:
  * 1. Have this file with the Use Strict Directive enabled (i.e. the way it was found in the code repository).
  * 2. Run mocha --watch strict-mode-in-mocha.js
  *    It will throw twice:
  *      ReferenceError: foo is not defined
  *      ReferenceError: bas is not defined
  *    That is expected.
  * 3. Comment out 'use strict'; and save.
  * 4. mocha will re-execute the 2 tests and both will pass. (It re-executes b/c of the --watch parameter.)
  *    The first test will pass.
  *    It will throw once:
  *      ReferenceError: bas is not defined
  *    That is expected.
  * 5. Uncomment 'use strict'; (i.e. return file to original state) and save.
  * 6. mocha will re execute the 2 tests with the same results as in step 4.
  *    The first test will pass.
  *    It will throw once:
  *      ReferenceError: bas is not defined
  *    That is _NOT_EXPECTED_. It was expected that the program would be back in strict mode.
  * 
  * Similar things happen if mocha is started with 'use strict'; commented out
  * 1. Have this file with the Use Strict Directive DISanabled i.e. commented out.
  * 2. Run mocha --watch strict-mode-in-mocha.js
  *    Test 1) passes and 2) fails.
  *    That is expected.
  * 3. Uncomment out 'use strict'; and save
  * 4. mocha will re execute the 2 tests
  *    1) passes and 2) fails
  *    That is _NOT_EXPECTED_. Expected the program to execute in strict mode.
  */
'use strict';

var assert = require('assert');

describe('use-strict.js', function(){
  context('when the Use Strict Directive is in a file\'s Directive Prologue', function(){
    it('should throw if an undefined variable is referenced', function(){
      foo = "bar";
      });
    });

  context('when the Use Strict Directive is in a functions\'s Directive Prologue', function(){
    it('should throw if an undefined variable is referenced', function(){
      "use strict";
      bas = "qux";
      });
    });
  });
