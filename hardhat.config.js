require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers")

// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "V8Vbs4XIGks4glUkuupSV2wK4O7XCG5r"; //CHANGE YOUR API-KEY FROM ALCHEMY

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts

// My Private Key of My Wallet Sepolia Metamask
const SEPOLIA_PRIVATE_KEY = "7a9477788649da440cf3b9ec44926a77f27d79b566595947eb2436ae46df2598";  

module.exports = {
  solidity: {
    compilers: [

        {
            version: "0.5.16",
        },

        {
            version: "0.6.6",
        },

        {
          version: "0.8.17",
      },

    ],

  },
  
  paths: {
    artifacts: "./artifacts",
    sources: "./contracts",
    cache: "./cache",
    tests: "./test"
  },

  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }

 
};
