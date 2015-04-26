/*
 First test is to invoke node and pass it this file to run:
 ~/jft/gits/nodeio:% node this.js 
 When this.js consists of the single line as follows:
     console.log(this===root);
 
 Running node as above will print false. 
 But same one-liner in the REPL is different:
 ~/jft/gits/nodeio:% node
 > console.log(this===root);
 true
 undefined
 */


/* 
 Second test of node REPL vs node-passed-a-file is the following 2-liner:
     var a=this;
     console.log(a===root);

 node REPL will say they are equal.
 this.js passed as a param to node will say they are not equal.

 This is probably why:
     console.log(this)
 In node-passed-a-file is {}.
 In node-REPL is root/GLOBAL and all its various properties.

 So, seemingly when a file is passed as execute-this to node on 
 command line invocation, different context is set than while in REPL.
 */


/* 
 * Test lexical scope trickery of functions inside functions
 */

/*
'use strict';
var f = function(){
  function g(){
    console.log('in g, this:' + this); // in g, this:undefined
    }
  g();
  }
f();
 */


/*
// same a previous but no Use Strict Directive
var f = function(){
  function g(){
    console.log('in g, this:' + this); // in g, this:[object global]
    }
  g();
  }
f();
 */


/*
var f = function f(){
  var g = function(){
    console.log('in g, this:' + this); // in g, this:[object global]
    }
  g();
  }
f.h = function(){
  console.log('in h, this:' + this); // in h, this:<souce code starting at function f()...
  }
f.h();
f();
*/


/*
function f(){
  console.log('in f, this:' + this); // in f, this:[object Object] i.e. a
  var g = function(){
    console.log('in g, this:' + this); // in g, this:[object global]
    }
  g();
  }
a={x:'y'};
a.b=f;
a.b();
 */

