# ERC20 (DEX) 🏛️ 🪙 

This is a complete Decentralized Marketplace (DEX) for a Sepolia Test Network  with scripts and deploys made with Solidity using Hardhat.

## Setting Up


## 1. Clone the repository

## 2. Install dependencies

```bash
$ cd ERC20-DEX-Exchange
$ npm install --save-dev hardhat
$ npx hardhat
$ npm install --save dotenv @nomiclabs/hardhat-etherscan @openzeppelin/contracts @nomicfoundation/hardhat-toolbox
```
## 3. Change variables in hardhat.config.js, deploy.js and blockchain_stuff.js

```bash
# hardhat.config.js
$ ALCHEMY_API_KEY
$ SEPOLIA_PRIVATE_KEY
# deploy.js
$ myWallet
$ sepoliaETH_Wallet_liquid
$ sepoliaETH_Wallet_swap
# blockchain_stuff.js
$ FACTORY_ADDRESS
$ ROUTER_LIQUIDITY_ADDRESS
$ ROUTER_SWAPS_ADDRESS
$ TOKENA_ADDRESS
$ TOKENB_ADDRESS

```

## 4. Deployment
```bash
$ npx hardhat clean
$ npx hardhat compile
```

``` bash
$ npx hardhat run scripts/deploy.js --network sepolia
```

<a href="https://imgur.com/3uQFfbn"><img src="https://i.imgur.com/3uQFfbn.gif" title="source: imgur.com" /></a>


## 5. Install Lite Server

 For to use index.html and blockchain_stuff.js basically this calls the files ERC20.json, Factory.json, Pair.json , RouterLiquidity.json and RouterSwaps.json in order to connect our Metamask. In other terminal Run next Command


``` bash
$ npm install -g lite-server
$ lite-server
```

<a href="https://imgur.com/7taYyBj"><img src="https://i.imgur.com/7taYyBj.gif" title="source: imgur.com" /></a>
