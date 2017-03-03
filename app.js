function message(statusText) {
  var elem = document.getElementById('status');
  if(statusText) {
    elem.innerHTML = statusText;
    elem.style.display = "block";
  } else {
    elem.innerHTML = "";
    elem.style.display = "none";
  }
}

function title(text) {
  document.getElementById("title-text").innerHTML = text;
}

var App = {
  Providers: {
    "Blockchain.info": { 
      url: "https://blockchain.info/wallet/#/login",
      identifier: "Wallet ID"
    },
    "Coinbase": {
      url: "https://www.coinbase.com/signin",
      identifier: "Email"
    },
    "Xapo": {
      url: "https://www.coinbase.com/signin",
      identifier: "Email"
    },
  },
  Coins: {
    "Bitcoin" : {providers : ["Blockchain.info", "Coinbase", "Xapo"]},
    "Litecoin" : {},
    "Ethereum" : {providers : ["Xapo"]},
    "Dogecoin" : {},
    "Raiblocks" : {providers : ["Raiblocks Software Wallet"]}
  },
  KEY_OWNED_WALLETS: "owned",
  KEY_CONTACTS: "contacts"
}

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

var WalletList = function(key, createdCallback) {
  var _this = this;

  if(key) key = key + "_wallets";
  var allData = [];

  //Renders after load if set to a selector
  var renderAfterLoad = false;
  var loading = false; //Loading flag

  function openWallet(provider) {
    var info = App.Providers[provider];
    if(!info) return;
    chrome.tabs.create({
      url:info["url"],
      active: true
    });
  }

  function copyToClipboard(text) {
    //Taken from: http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      var success = document.execCommand('copy');
      if(success) message("Address copied to clipboard");
      else message("Failed to Copy");
    } catch (e) {
      console.log("failed to copy");
    }

    document.body.removeChild(textArea);
  }

  var walletHTML = function(wallet, i) {
    var provider = App.Providers[wallet.provider];

    var container = document.createElement("div");
    container.setAttribute("class", "wallet");
    
    var name = document.createElement("div");
    name.setAttribute("class", "wallet-name");
    name.innerText = wallet.name;

    var editLink = document.createElement("img");
    editLink.setAttribute("src", "icons/edit.png");
    editLink.setAttribute("alt", "Edit");
    editLink.setAttribute("title", "Edit");
    editLink.setAttribute("class", "action");
    editLink.addEventListener("click", function() {
      ui.changeMode("edit",i);
    });

    var address = document.createElement("div");
    address.setAttribute("class", "wallet-address");
    address.innerText = wallet.address;

    var addressLink = document.createElement("img");
    addressLink.setAttribute("src", "icons/copy.png");
    addressLink.setAttribute("alt", "Copy Address");
    addressLink.setAttribute("title", "Copy Address");
    addressLink.setAttribute("class", "action");
    addressLink.addEventListener("click", function() {copyToClipboard(wallet.address)});

    var info = document.createElement("div");
    info.setAttribute("class", "wallet-info");
    if(wallet.coin) info.innerText = wallet.coin;
    else info.innerText = "";
    if(wallet.provider) info.innerText += "@"+wallet.provider;

    var walletLink = document.createElement("img");
    walletLink.setAttribute("src", "icons/link.png");
    walletLink.setAttribute("alt", "Open Wallet");
    walletLink.setAttribute("title", "Open Wallet");
    walletLink.setAttribute("class", "action");
    walletLink.addEventListener("click", function() {openWallet(wallet.provider)});

    name.appendChild(editLink);
    address.appendChild(addressLink);
    info.appendChild(walletLink);
    container.appendChild(name);
    container.appendChild(address);
    container.appendChild(info);

    return container;
  }

  this.load = function(callback) {
    loading = true;
    chrome.storage.local.get(key, function(items) {
      if(items.hasOwnProperty(key)) {
        allData = JSON.parse(items[key]);
      }
      loading = false;
      if(renderAfterLoad !== false) _this.render(renderAfterLoad);
      renderAfterLoad = false;
      if(callback) callback(allData, _this);
    });
  };

  this.getAll = function() {
    return allData;
  }

  this.render = function(selector) {
    if(!selector) return;
    if(loading) {
      renderAfterLoad = selector;
      return;
    }
    var wallets = allData;
    var container = document.querySelector(selector);
    if(!container) return;

    container.innerHTML = "";

    if(wallets.length > 0) {
      var html = "";
      for(var i=0; i < wallets.length; ++i) {
        container.appendChild(walletHTML(wallets[i],i));
      }
    } else {
      message("You currently have no wallets added.<br/>Please click on the add button to add a wallet.");
    }
  }

  this.add = function(wallet) {
    allData.push(wallet);
  };

  this.save = function(callback) {
    var obj = {};
    obj[key] = JSON.stringify(allData);
    chrome.storage.local.set(obj, callback);
  };

  this.deleteAtIndex = function(index) {
    allData.splice(index,1);
  };

  this.editAtIndex = function(index, wallet) {
    allData[index] = wallet;
  };

  this.get = function(index) {
    return allData[index];
  };

  this.delete = function(key) {
    var i;
    for(i = 0; i < allData.length; ++i) {
      var item = allData[i];
      if(item.name == key || item.address == key) break;
    }
    this.deleteAtIndex(i);
  };

  this.load(createdCallback);
};

var ui;

document.addEventListener('DOMContentLoaded', function() {

  var contacts = new WalletList(App.KEY_CONTACTS);

  var myWallets = new WalletList(App.KEY_OWNED_WALLETS);

  document.getElementById("save-button").addEventListener("click", function(e) {
    var elems = document.forms[0].elements;
    var name = elems["name"].value;
    var address = elems["address"].value;
    var coin = elems["coin"].value;
    var provider = elems["provider"].value;

    if(!name) message("Please enter a name for your wallet");
    else if(!address) message("Please provide your wallet address");
    else if(!coin) message("Please choose the type of coin");
    else if(!provider || provider == "none") message("Please choose the provider for your wallet");
    else {
      message("Saving...");
      var mode = ui.getCurrentMode();
      if(mode.name == "add") {
        myWallets.add({
          "name": name,
          "address": address,
          "coin": coin,
          "provider": provider
        });
      } else if(mode.name == "edit") {
        myWallets.editAtIndex(mode.data, {
          "name": name,
          "address": address,
          "coin": coin,
          "provider": provider
        });
      } else return;

      myWallets.save(function() {
        message("Saved!");
      });
    }
  });

  document.getElementById("cancel-button").addEventListener("click", function(e) {
    ui.changeMode("wallet");
  });

  document.getElementById("delete-button").addEventListener("click", function(e) {
    var mode = ui.getCurrentMode();
    if(mode.name != "edit") return;
    var answer = confirm("Are you sure that you want to delete this wallet?");
    if(answer) {
      myWallets.deleteAtIndex(mode.data);
      myWallets.save(function() {
        ui.changeMode("wallet");
      });
    }
  });

  function fillSelect(select, values, selected, _default) {
    function getOption(text, value) {
      var option = document.createElement('option');
      option.text = text;
      if(selected == value) option.setAttribute("selected", "selected");
      option.setAttribute("value", value);
      return option;
    }
    select.innerHTML = "";

    if(_default) { select.appendChild(getOption(_default, "none")); }
    
    if(Array.isArray(values)) {
      for(var i=0; i<values.length; ++i) {
        select.appendChild(getOption(values[i],values[i]));
      }
    } else {
      for(provider in values) {
        select.appendChild(getOption(provider, provider));
      }
    }

    select.appendChild(getOption("Other","other"));
  };

  var coinSelect = document.forms[0].elements["coin"];
  var providerSelect = document.forms[0].elements["provider"];

  coinSelect.addEventListener("change", function() {
    var select = coinSelect.value;
    if(!select) return;
    if(!App.Coins[select]) {
      fillSelect(
        providerSelect,
        App.Providers,
        "other",
        "Please Select Your Wallet Provider")
    } else {
      fillSelect(
        providerSelect,
        App.Coins[select].providers,
        false,
        "Please Select Your Wallet Provider"
      );
    }
    
  });

  //Setup Navigation
  var navItems = document.getElementById("nav-menu").children;
  navItems[0].onclick = function() {
    ui.changeMode("wallet");
  };
  navItems[1].onclick = function() {
    ui.changeMode("contacts");
  };
  navItems[2].onclick = function() {
    ui.changeMode("add");
  };

  fillSelect(coinSelect, App.Coins, "Bitcoin");

  ui = new UI({
    wallet: {
      beforeShow: function() {
        message("");
        myWallets.render("#wallet-list"); 
        title("MY WALLETS");
      },
      elem: "wallet-list"
    },
    add: {
      beforeShow: function() {
        UI.hideElem("delete-button");
        title("ADD WALLET"); 
        message("");
        //Empty all the form fields
        var elems = document.forms[0].elements;
        elems["name"].value = "";
        elems["address"].value = "";
        elems["coin"].value = "Bitcoin";

        fillSelect(
          providerSelect, 
          App.Providers, 
          false,
          "Please Select Your Wallet Provider"
        );
      },
      elem: "wallet-form"
    },
    edit: {
      beforeShow: function(item) {
        UI.showElem("delete-button");
        message("");
        title("EDIT WALLET");
        var wallet = myWallets.get(item);
        var elems = document.forms[0].elements;
        elems["name"].value = wallet.name;
        elems["address"].value = wallet.address;
        elems["coin"].value = wallet.coin;
        //Update provider select
        fillSelect(
          providerSelect,
          (App.Coins[wallet.coin])? App.Coins[wallet.coin].providers:App.Providers,
          false,
          "Please Select Your Wallet Provider"
        );

        elems["provider"].value = wallet.provider;
      },
      elem: "wallet-form"
    },
    contacts: {
      beforeShow: function() {contacts.render("#wallet-list"); title("FRIENDS");},
      elem: "wallet-list"
    }
  },"wallet");
  
});