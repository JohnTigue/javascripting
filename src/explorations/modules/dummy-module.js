module.exports = (function(){
  var someClosuredState = 40;

  var underConstruction = function(){
    // JFT-TODO: what really should the funcyObject module itself return when called?
    // Is it a factory?
    return someClosuredState;
    };

  var underConstructionsStateModder = function(){
    return someClosuredState++;
    };
  underConstruction.stateModder = underConstructionsStateModder;

  underConstruction.self = underConstruction;
  underConstruction.someProp = "blueSky";


  underConstruction.isTheSkyBlue = function(){
    return this.someProp == "blueSky";
    }

  return underConstruction;
  })();


