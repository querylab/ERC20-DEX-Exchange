const NETWORK_ID = 11155111 //Sepolia Network Chain

//CHANGE!! Variable for your contract adreess deployment
const FACTORY_ADDRESS =             "0x841cD6485Ae70E0109EfC4574607D5c6CD918A71"
const ROUTER_LIQUIDITY_ADDRESS =    "0x61d4011c4E97a62DF3B1742511aaA8149Ca4A6D7"
const ROUTER_SWAPS_ADDRESS =        "0x97749a7Ad04b947365307d51B879d46C8C2A69b0"
const TOKENA_ADDRESS =              "0x30b47c126310006FC8866bAa1b6dAde94dDf50FD"
const TOKENB_ADDRESS =              "0xF341AC700dA56D9b3Bd80d192073d921aa10B81f"

var PAIR_ADDRESS =                "" //leave empty do not touch

const FACTORY_ABI_PATH =            "./Factory.json"
const PAIR_ABI_PATH =               "./Pair.json"
const ROUTER_SWAPS_ABI_PATH =       "./RouterSwaps.json"
const ROUTER_LIQUIDITY_ABI_PATH =   "./RouterLiquidity.json"
const ERC20_ABI_PATH =              "./ERC20.json"

var factoryContract
var pairContract
var routerSwapsContract
var routerLiquidityContract
var tokenAContract
var tokenBContract

var accounts
var web3

function metamaskReloadCallback() {
  window.ethereum.on('accountsChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Se cambió el account, refrescando...";
    window.location.reload()
  })
  window.ethereum.on('networkChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Se el network, refrescando...";
    window.location.reload()
  })
}

const getWeb3 = async () => {
  return new Promise((resolve, reject) => {
    if(document.readyState=="complete")
    {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum)
        window.location.reload()
        resolve(web3)
      } else {
        reject("must install MetaMask")
        document.getElementById("web3_message").textContent="Error: Please connect to Metamask";
      }
    }else
    {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          resolve(web3)
        } else {
          reject("must install MetaMask")
          document.getElementById("web3_message").textContent="Error: Please install Metamask";
        }
      });
    }
  });
};

const getContract = async (web3, address, abi_path) => {
  const response = await fetch(abi_path);
  const data = await response.json();

  const netId = await web3.eth.net.getId();
  contract = new web3.eth.Contract(
    data,
    address
    );
  return contract
}

async function loadDapp() {
  metamaskReloadCallback()
  document.getElementById("web3_message").textContent="Please connect to Metamask"
  var awaitWeb3 = async function () {
    web3 = await getWeb3()
    web3.eth.net.getId((err, netId) => {
      if (netId == NETWORK_ID) {
        var awaitContract = async function () {
          factoryContract = await getContract(web3, FACTORY_ADDRESS, FACTORY_ABI_PATH)
          PAIR_ADDRESS = await factoryContract.methods.getPair(TOKENA_ADDRESS, TOKENB_ADDRESS).call()
          pairContract = await getContract(web3, PAIR_ADDRESS, PAIR_ABI_PATH)
          routerSwapsContract = await getContract(web3, ROUTER_SWAPS_ADDRESS, ROUTER_SWAPS_ABI_PATH)
          routerLiquidityContract = await getContract(web3, ROUTER_LIQUIDITY_ADDRESS, ROUTER_LIQUIDITY_ABI_PATH)
          tokenAContract = await getContract(web3, TOKENA_ADDRESS, ERC20_ABI_PATH)
          tokenBContract = await getContract(web3, TOKENB_ADDRESS, ERC20_ABI_PATH)
          document.getElementById("web3_message").textContent="You are connected to Metamask"
          onContractInitCallback()
          web3.eth.getAccounts(function(err, _accounts){
            accounts = _accounts
            if (err != null)
            {
              console.error("An error occurred: "+err)
            } else if (accounts.length > 0)
            {
              onWalletConnectedCallback()
              document.getElementById("account_address").style.display = "block"
            } else
            {
              document.getElementById("connect_button").style.display = "block"
            }
          });
        };
        awaitContract();
      } else {
        document.getElementById("web3_message").textContent="Please connect to Goerli";
      }
    });
  };
  awaitWeb3();
}

async function connectWallet() {
  await window.ethereum.request({ method: "eth_requestAccounts" })
  accounts = await web3.eth.getAccounts()
  onWalletConnectedCallback()
}

loadDapp()

const onContractInitCallback = async () => {
  if(PAIR_ADDRESS != "0x0000000000000000000000000000000000000000")
  {
    reserves = await pairContract.methods.getReserves().call()
    reserve0 = reserves._reserve0
    reserve1 = reserves._reserve1

    console.log(reserves)
    console.log(reserve0)
    console.log(reserve1)

    if(reserve0 == TOKENA_ADDRESS)
    {
      tokenAPrice = "1 TokenA = " + (reserve0/reserve1) + " TokenB"
      tokenBPrice = "1 TokenB = " + (reserve1/reserve0) + " TokenA"
    }else
    {
      tokenAPrice = "1 TokenA = " + (reserve1/reserve0) + " TokenB"
      tokenBPrice = "1 TokenB = " + (reserve0/reserve1) + " TokenA"
    }

    document.getElementById("tokenAPrice").textContent= tokenAPrice;
    document.getElementById("tokenBPrice").textContent= tokenBPrice;
  }else
  {
    document.getElementById("tokenAPrice").textContent= "Can't swap: Please add liquidity";
    document.getElementById("tokenBPrice").textContent= "Can't swap: Please add liquidity";
  }
}

const onWalletConnectedCallback = async () => {
  var balanceTokenA = await tokenAContract.methods.balanceOf(accounts[0]).call()
  var balanceTokenB = await tokenBContract.methods.balanceOf(accounts[0]).call()

  var contract_state = ""
  contract_state += "You have: " + web3.utils.fromWei(balanceTokenA) + " " + await tokenAContract.methods.symbol().call()
  contract_state += ", " + web3.utils.fromWei(balanceTokenB) + " " + await tokenBContract.methods.symbol().call()

  document.getElementById("contract_state").textContent = contract_state;
}


//// Functions ////

const approveTokenALiquidity = async (amount) => {
  const result = await tokenAContract.methods.approve(ROUTER_LIQUIDITY_ADDRESS, web3.utils.toWei(amount))
  .send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Executing...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

const approveTokenBLiquidity = async (amount) => {
  const result = await tokenBContract.methods.approve(ROUTER_LIQUIDITY_ADDRESS, web3.utils.toWei(amount))
  .send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Executing...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

const addLiquidity = async (amountADesired, amountBDesired) => {

  const deadline = Math.round(Date.now() / 1000) + 60

  const result = await routerLiquidityContract.methods.addLiquidity(
    TOKENA_ADDRESS,
    TOKENB_ADDRESS,
    web3.utils.toWei(amountADesired),
    web3.utils.toWei(amountBDesired),
    web3.utils.toWei("0"),
    web3.utils.toWei("0"),
    accounts[0],
    deadline
  ).send({ from: accounts[0], value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Executing...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

const approveTokenASwaps = async (amount) => {
  const result = await tokenAContract.methods.approve(ROUTER_SWAPS_ADDRESS, web3.utils.toWei(amount))
  .send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Executing...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

const approveTokenBSwaps = async (amount) => {
  const result = await tokenBContract.methods.approve(ROUTER_SWAPS_ADDRESS, web3.utils.toWei(amount))
  .send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Executing...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

const swapExactTokensForTokensTokenAForTokenB = async (amountIn) => {
  const deadline = Math.round(Date.now() / 1000) + 60

  const result = await routerSwapsContract.methods.swapExactTokensForTokens(
    web3.utils.toWei(amountIn),
    0,
    [TOKENA_ADDRESS, TOKENB_ADDRESS],
    accounts[0],
    deadline
  ).send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Executing...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}

const swapExactTokensForTokensTokenBForTokenA = async (amountIn) => {
  const deadline = Math.round(Date.now() / 1000) + 60

  const result = await routerSwapsContract.methods.swapExactTokensForTokens(
    web3.utils.toWei(amountIn),
    0,
    [TOKENB_ADDRESS, TOKENA_ADDRESS],
    accounts[0],
    deadline
  ).send({ from: accounts[0], gas: 0, value: 0 })
  .on('transactionHash', function(hash){
    document.getElementById("web3_message").textContent="Executing...";
  })
  .on('receipt', function(receipt){
    document.getElementById("web3_message").textContent="Success.";    })
  .catch((revertReason) => {
    console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
  });
}
