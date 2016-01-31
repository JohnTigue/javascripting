'use strict';

// Just reality checks regarding ASI and semicolons in general

function foo(){
  return
  'wat';
  }

console.log(foo());


if(false){
  console.log('first if is true');
  } // not exactly ASI but if put a ; here it will cause: SyntaxError: Unexpected token else
else{
  console.log('first else ran');
  }
