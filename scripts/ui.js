/*
 * Crypto Wallet Manager
 * Version 1.0
 * Created by Divinemaniac (Bikash Paneru)
 */
 
var UI = function(modes, defaultMode) {
  var _this = this;

  if(!modes) throw "No Modes Defined";

  var currentMode = null;
  var currentModeName = null;
  var currentModeData = null;

  this.changeMode = function(modeName, modeData) {
    if(!modes.hasOwnProperty(modeName)) return;
    //Hide previous mode
    if(currentMode) {
      if(currentMode.beforeHide) mode.beforeHide.call(this,currentModeData);
      UI.hideElem(currentMode.elem);
    }

    if(modeData!=null || modeData!=undefined) currentModeData = modeData;
    else currentModeData = null;

    //Display current mode's elem
    var mode = modes[modeName];
    if(mode.beforeShow) mode.beforeShow.call(this,modeData);
    UI.showElem(mode.elem);
    currentMode = mode;
    currentModeName = modeName;
  };

  this.getCurrentMode = function() {
    return {
      name: currentModeName,
      data: currentModeData,
      config: currentMode
    }
  };

  for(var mode in modes) {
    if(modes.hasOwnProperty(mode) && modes[mode].elem) {
        UI.hideElem(modes[mode].elem);
    }
  };

  if(defaultMode) {
    this.changeMode(defaultMode);
  }
};

UI.showElem = function(id) {
  document.getElementById(id).style.display = "";
};

UI.hideElem = function(id) {
  document.getElementById(id).style.display = "none";
};