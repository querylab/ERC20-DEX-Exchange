// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();


    // Get the ContractFactories and Signers here.
const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
const myWallet = "0xF126e8928cA513Cb4427255739b40eC53996Ea1B"; //SepoliaETH_myWallet CHANGE!! FOR YOR WALLET METAMASK ADRESS SEPOLIA NETWORK
// deploy contracts Factory and myWallet Address
const factory = await Factory.deploy(myWallet);


// For Contract UniswapV2Router02Liquidity
const Liquidity = await hre.ethers.getContractFactory("UniswapV2Router02Liquidity");
const sepoliaETH_Wallet_liquid = "0xF12d6e8928cA513Cb4427255739b30eCF3996Ea1B"; //SepoliaETH_myWallet CHANGE!! FOR YOR WALLET METAMASK ADRESS SEPOLIA NETWORK
// deploy contracts
const liquid = await Liquidity.deploy(factory.address,sepoliaETH_Wallet_liquid);

// For Contract UniswapV2Router02Swaps
const Swaps = await hre.ethers.getContractFactory("UniswapV2Router02Swaps");
const sepoliaETH_Wallet_swap = "0xF12d6e8928cA514Cb4427255739b40eCF3996Ea1B"; //SepoliaETH_myWallet CHANGE!! FOR YOR WALLET METAMASK ADRESS SEPOLIA NETWORK
const swaping = await Swaps.deploy(factory.address,sepoliaETH_Wallet_swap);



  //Token A and Token B deploying for contract SimpleToken
const MyTokenA = await ethers.getContractFactory('SimpleToken')
const tokenAContract = await MyTokenA.deploy("MyTokenA","MTA",100000)
await tokenAContract.deployed()

const MyTokenB = await ethers.getContractFactory('SimpleToken')
const tokenBContract = await MyTokenB.deploy("MyTokenA","MTB",100000)
await tokenBContract.deployed()



//Consol View
console.log("***********************************************************************************");
console.log("Deploying contracts with the account:", deployer.address);
console.log("Account balance:", (await deployer.getBalance()).toString());
console.log("***********************************************************************************\n");
console.log("***********************************************************************************");
console.log("Factory Contract Address: ",await factory.address);
console.log("Liquity Contract Address: ",await liquid.address);
console.log("Swaping Contract Address: ",await swaping.address);
console.log("***********************************************************************************\n");
console.log("***********************************************************************************");
console.log("Deployed Tokens ");
console.log('Token A deployed to Contract Address:', tokenAContract.address)
console.log('Token B deployed to Contract Address:', tokenBContract.address)
console.log("***********************************************************************************");




/*
// Save copies of each contracts abi and address to the frontend.
saveFrontendFiles(factory , "UniswapV2Factory");
saveFrontendFiles(liquid , "UniswapV2Router02Liquidity");
saveFrontendFiles(swaping , "UniswapV2Router02Swaps");
saveFrontendFiles(tokenAContract , "SimpleToken");
saveFrontendFiles(tokenBContract , "SimpleToken");   */

}//End Main


/*
function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../json_abi/contractsData";
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  
  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );
  
  const contractArtifact = artifacts.readArtifactSync(name);
  
  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
  } */



main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});