/*
 * Crypto Wallet Manager
 * Version 1.0
 * Created by Divinemaniac (Bikash Paneru)
 */

/**
 * The Default app configuration.
 * Change this when adding providers and coins
 * Providers: 
 * ------------------------------------------
 * An object containing other objects, each of
 * which contains information on a provider
 * Format is, 
 * "Provider Name": {
 *    url: "The url to the login page of the provider",
 *    identifier: "The identifier used to login to the wallet"
 *  }
 * Coins:
 * ------------------------------------------
 * "Coin Name" : {
 *    providers: ["array","of","supported","providers"]
 *  }
 */
var App = {
  Providers: {
    "Block.io": {
      url: "https://block.io/users/sign_in",
      identifier: "Email"
    },
    "Blockchain.info": { 
      url: "https://blockchain.info/wallet/#/login",
      identifier: "Wallet ID"
    },
    "Bitgo": {
      url: "https://www.bitgo.com/login",
      identifier: "Email"
    },
    "Coin.Space": {
      url: "https://coin.space/",
      identifier: "Passphrase"
    },
    "Coinapult": {
      url: "https://coinapult.com/login",
      identifier: "Email"
    },
    "Coinbase": {
      url: "https://www.coinbase.com/signin",
      identifier: "Email"
    },
    "Green Address": {
      url: null,
      identifier: null
    },
    "Xapo": {
      url: "https://account.xapo.com/",
      identifier: "Email"
    }
  },
  Coins: {
    "Bitcoin" : {
      providers : [
        "Blockchain.info", 
        "Bitgo", 
        "Coin.Space", 
        "Coinapult", 
        "Coinbase", 
        "Green Address", 
        "Desktop Wallet", 
        "Mobile Wallet", 
        "Xapo"
      ]
    },
    "Dash" : {
      providers : [
        "Desktop Wallet", 
        "Mobile Wallet", 
        "Hardware Wallet", 
        "Paper Wallet"
      ]
    },
    "Dogecoin" : {
      providers : [
        "Block.io",
        "Desktop Wallet", 
        "Mobile Wallet", 
        "Hardware Wallet", 
        "Paper Wallet"
      ]
    },
    "Ethereum" : {
      providers : [
        "My Ether Wallet",
        "Desktop Wallet", 
        "Mobile Wallet", 
        "Hardware Wallet", 
        "Paper Wallet"
      ]
    },
    "Litecoin" : {
      providers : [
        "Desktop Wallet", 
        "Mobile Wallet", 
        "Hardware Wallet", 
        "Paper Wallet"
      ]
    },
    "Monero" : {
      providers : [
        "Desktop Wallet", 
        "Mobile Wallet", 
        "Hardware Wallet", 
        "Paper Wallet"
      ]
    },
    "Raiblocks" : {
      providers : [
        "Desktop Wallet", 
        "Mobile Wallet", 
        "Hardware Wallet", 
        "Paper Wallet"
      ]
    },
  },
  KEY_OWNED_WALLETS: "owned",
  KEY_CONTACTS: "contacts"
}