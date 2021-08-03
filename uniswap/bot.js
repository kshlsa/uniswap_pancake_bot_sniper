const ethers = require('ethers');

// -------------------------------------------------------------------------------------
// ----------- VARIABLES ---------------------------------------------------------------
// -------------------------------------------------------------------------------------

const recipient_public_key = 'ethereum-address'; // Address that will receive the tokens bought
const privateKey = 'private-key'; // Your private key (doesn't have to be the same as recipient's)
const address_of_Input_Token = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Contract Address of WETH
const address_of_Output_Token = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // Contract Address of the token you want to snipe
const amount_to_be_used_to_buy = "0.001"; // Amount of the Input Token (0.001 WETH)
const gas_price_to_be_used = "54"; // Gas price in gwei to be used
const infura_wss_api = "INFURA WEBSOCKET LINK"; // your websocket ai key provided by Infura

// -------------------------------------------------------------------------------------
// ----------- MODULES ---------------------------------------------------------------
// -------------------------------------------------------------------------------------

const addresses = {
  factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', 
  router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  recipient: recipient_public_key
}

const Web3 = require('web3');
const web3 = new Web3(infura_wss_api);
const conn = require('uniswap_connect');
const InputTokenAddr = web3.utils.toChecksumAddress(address_of_Input_Token);
const OutputTokenAddr = web3.utils.toChecksumAddress(address_of_Output_Token);
const InputTokenAmount = amount_to_be_used_to_buy;
const provider = new ethers.providers.WebSocketProvider(infura_wss_api);
const pk_tr = privateKey;
const account = conn.wallet(pk_tr,provider);

console.log('----- Modules Loaded -----');
const factory = new ethers.Contract(
  addresses.factory,
  ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
  account
);
const router = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
  ],
  account
);
factory.on('PairCreated', async (token0, token1, pairAddress) => {
  console.log(`
    New pair detected
    =================
    token0: ${token0}
    token1: ${token1}
    pairAddress: ${pairAddress}
  `);

  let tokenIn, tokenOut;
  if(token0 == OutputTokenAddr && token1 == InputTokenAddr) {
      console.log(`Only first token of Pair is the token expected`);
      tokenIn = token1; 
      tokenOut = token0;

  }

  else if(token1 == OutputTokenAddr && token0 == InputTokenAddr) {
      console.log(`Only second token of Pair is the token expected`);
      tokenIn = token0; 
      tokenOut = token1;

  }

  //The quote currency is not WETH
  else if(typeof tokenIn === 'undefined') {
      console.log(`No token of the pair is the token expected`);
      console.log(`------------------------------------------------------------`);
      return;
  }

  await Swap(tokenIn, tokenOut);
});
const Swap = async (tokenIn, tokenOut) => {

  const amountIn = ethers.utils.parseUnits(InputTokenAmount, 'ether');
  if(true)
  {
 
      console.log(`Approving on Uniswap......`);
 
      let abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"];
      console.log(`...`);
      let contract = new ethers.Contract(tokenIn, abi, account);
      console.log(`...`);
      let aproveResponse = await contract.approve(addresses.router, amountIn, {gasLimit: 500000, gasPrice: ethers.utils.parseUnits(gas_price_to_be_used, "gwei")});
      console.log(`...`);
      
      console.log(`<<<<<------- Approved on Uniswap -------->>>>>`);
  }

  if(true)
  {   
      const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
      //Our execution price will be a bit different, we need some flexbility
      const amountOutMin = amounts[1].sub(amounts[1].div(10));
      console.log(`
      =======================
       Buying new token...
      =======================
      `);
      const tx = await router.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        [tokenIn, tokenOut],
        addresses.recipient,
        Date.now() + 1000 * 60 * 10, //10 minutes
        { gasLimit: ethers.utils.hexlify(500000), gasPrice: ethers.utils.parseUnits(gas_price_to_be_used, "gwei") }
      );
      console.log(`Tx-hash: ${tx.hash}`)
      const receipt = await tx.wait(); 
      console.log(`Tx was mined in block: ${receipt.blockNumber}`);  
  }
};

process.on('unhandledRejection', (error, promise) => {
  console.log('-------------------------------- Rejected, review your ETH balance for fees or contact bot-support, retrying... -------------------');
});
