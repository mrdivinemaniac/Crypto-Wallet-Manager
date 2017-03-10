/*
 * Crypto Wallet Manager
 * Version 1.0
 * Created by Divinemaniac (Bikash Paneru)
 */

/**
 * Displays the passed message on the status div
 */
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

/**
 * Changes the text in the title-text span
 */
function title(text) {
  document.getElementById("title-text").innerHTML = text;
}

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
        ui.changeMode("wallet");
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
    ui.changeMode("add");
  };
  navItems[2].onclick = function() {
    ui.changeMode("about");
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
    about: {
      beforeShow: function() {
        title("About");
      },
      elem: "about"
    }
  },"wallet");
  
});