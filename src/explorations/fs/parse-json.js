'use strict';

var fs      = require('fs');
var Promise = require('promise');

var trivJsonFilename    = __dirname + "/trivial.json";
var packageJsonFilename = __dirname + "/../../../package.json";
var testee = trivJsonFilename;
//var testee = packageJsonFilename;


// Just about as naive as you can get:
fs.readFile(testee, function(error, data){
  if(error){
    throw error;
    }

  // since naive, not going to try/catch.
  console.log("naively, log w/ +        " + JSON.parse(data)); // so this is one param, a string
  console.log("naively, log w/ ,       ",   JSON.parse(data)); // 2 params b/c comma.
  console.log("naively, JSON.stringify  " + JSON.stringify(JSON.parse(data)));
  console.log("naively, String         ",   String(JSON.parse(data))); 
  });


// Simply functionize that and parameterize the filename.
// Add error handling around the parse().
function loadAndParseJson(aFilename){
  fs.readFile(aFilename, function(error, data){
    var anObject = null;
    if(error){
      console.log("loadAndParseJson received ERROR:", error);
      }
    try{
      anObject = JSON.parse(data);
      }
    catch(error){
      console.log("loadAndParseJson parse ERROR:", error);
      }
    console.log("loadAndParseJson        ", anObject);
    });
  }

loadAndParseJson(testee);


// That's a mouthful. JFT-TODO what are these functions called that get passed into Promise()?
function makeConfiggerForPromiseToLoadAnObjectFromFileContainingJson(aFilename){
  return function(aResolver,aRejector){
    fs.readFile(aFilename, function(err,data){
      var anObject = null;
      if(err)
	aRejector(err);
      try{
        anObject = JSON.parse(data);
        }
      catch(error){
        console.log("safely parse ERROR:", error);
        }  
      aResolver(anObject);
      })
    };
  }

var aPromise = new Promise(makeConfiggerForPromiseToLoadAnObjectFromFileContainingJson(testee));

aPromise.then(
  function(objectFromFile){
    console.log("promised file contents  ", objectFromFile);
    },
  function(aReason){
    console.log('promise rejected', aReason);
    }
  );

