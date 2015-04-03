/** This file is intended to be invoked via node in order to poke around to find out how strict mode triggering is implemented.
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




