/** This file is intended to be invoked via node in order to 
  * poke around to find out how strict mode triggering is implemented.
  *
  * NOTE:
  * This is not meant to be invoked by mocha, which has it's own
  * quirks regarding the Use Strict Directive. For that see:
  * ../mocha/strict-mode-in-mocha.js
  *
  * For reference, here is the relevant part of the spec:
  * 14.1 Directive Prologues and the Use Strict Directive
  *   http://www.ecma-international.org/ecma-262/5.1/#sec-14.1
  */


/*
// Starting a file with comments does not disable a following "use strict"
'use strict';
console.log('1');
foo = "bar"; // throws foo is not defined
 */


/*
// Other directives (i.e. ExpressionStatements consisting entirely of a StringLiteral followed by a semicolon) proceeding a Use Strict Directive will not disable strict mode
"use fat finger directive";
"use strict";
console.log('2');
foo = "bar"; // throws foo is not defined
 */


/*
// Use Strict Directive outside of Directive Prologue will drop execution into unrestricted mode
console.log('3: fooled ya');
"use strict";
foo = "bar"; // does NOT throw
 */


'use strict';
var bullPatties = "lovely"; // as expected, if not defined via var this will throw a ReferenceError
function testUseStrict(){
  whoIsThis = "IamUndefined";
  }
/** Ho, boy. Seems that undefines are not discovered at parse time i.e. when the 
  * engine reads this file (for a parse time error, try dropping a " to cause a malformed 
  * StringLiteral) but rather run time. Such is the nature of dynamic languages, I guess, perhaps?
  *
  * Point is, as is this program executes without errors. Uncomment next line and a ReferenceError will be thrown
  */
//testUseStrict(); 



