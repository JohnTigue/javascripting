'use strict';

// weird, sometime it seems like strict mode is not being enforced but here it is i.e. remove "var" and compilation fails
var bullPatties = "lovely";
function testUseStrict(){
  "use strict";
  // WTH? this next line does not throw an error but bullPatties would?
  whoIsThis = "IamUndefine";
  }
//testUseStrict(); //ho, boy. seems that undefines are not discovered at parse time (i.e. when the engine reads this file (try dropping a " to cause a parse error) but rather run time.

