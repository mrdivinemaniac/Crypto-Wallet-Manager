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
 * An object containing other objects each of
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