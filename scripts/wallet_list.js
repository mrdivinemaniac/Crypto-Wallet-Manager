/*
 * Crypto Wallet Manager
 * Version 1.0
 * Created by Divinemaniac (Bikash Paneru)
 */

var WalletList = function(key, createdCallback) {
  var _this = this;

  if(key) key = key + "_wallets";
  var allData = [];

  //Renders after load if set to a selector
  var renderAfterLoad = false;
  var loading = false; //Loading flag
  var lastOpenQR = null;

  function getWalletURL(provider) {
    var info = App.Providers[provider];
    if(!info || !info['url']) return;
    else return info["url"];
  }

  function toggleQR(el, wallet) {
    //Close last opened QR
    if(lastOpenQR) toggleQR(lastOpenQR);
    if(el.style.display=="none") {
      el.style.display = "";
      if(el.innerHTML == "") {
        new QRCode(el, {
          text: wallet.address,
          width: 128,
          height: 128,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });
      }
      lastOpenQR = el;
    } else el.style.display = "none";
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
    if(wallet.coin) info.innerHTML = wallet.coin;
    else info.innerHTML = "";
    if(wallet.provider) {
      var walletURL = getWalletURL(wallet.provider);
      if(walletURL)
        info.innerHTML += "@<a href='" + walletURL + "' target='_blank'>" + wallet.provider + "</a>";
      else 
        info.innerHTML += "@" + wallet.provider;
    }

    var qrLink = document.createElement("img");
    qrLink.setAttribute("src", "icons/qrcode.png");
    qrLink.setAttribute("alt", "Toggle QR");
    qrLink.setAttribute("title", "Toggle QR");
    qrLink.setAttribute("class", "action");

    var qrDiv = document.createElement("div");
    qrDiv.setAttribute("class", "wallet-qr");
    qrDiv.style.display = "none";

    qrLink.addEventListener("click", function() {
      toggleQR(qrDiv,wallet);
    });

    name.appendChild(editLink);
    address.appendChild(addressLink);
    //if(App.Providers[wallet.provider] && App.Providers[wallet.provider].url) info.appendChild(walletLink);
    info.appendChild(qrLink);
    container.appendChild(name);
    container.appendChild(address);
    container.appendChild(info);
    container.appendChild(qrDiv);

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