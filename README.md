**Hey everyone,**

I built a basic sniping bot for pancake and uniswap using their libraries. Simply put, you fill the settings in bot.js and it buys the token for the amount you choose when it hits the swap.

Click on uniswap folder or pancakeswap folder and then follow the instructions in this README

**What are the features?:**
+ [x] Buy early token gems with custom gas fee, slippage, amount. (DYOR)
+ [x] Auto approve fees 
+ [x] Open source, with free node services (Literally don't have to pay anything to run this bot)

**Working on:**
+ [ ] Sell bought token with custom gas fee, slippage, amount.
+ [ ] Sell tokens with your custom increase in price, like 50%, 100%, 200%.

![Demo how the code looks](/images/demo.png)

**HOW TO RUN**
1) clone pancake or uniswap folder (Depending on what swap you want to snipe on)
2) $ npm install (<---- write this after you open the folder in the terminal of your favorite code editor)
3) Set the variables in "Variables" at the top of bot.js
4) Set up your websocket URL (Infura for Uniswap and ANKR for Pancake)
5) Input enough funds for fees and purchases into your wallet

Run with "node bot.js" command in the same terminal

Stop bot with Ctrl + C.

**Successfull 1,000 USD snipe the other day :)**

![Successfull Snipe](/images/IMG-20210508-WA0000.jpeg)

**TIPS AND TRICKS**

0) HOW TO GET ANKR WEBSOCKET? -> https://www.ankr.com/ -> click API's -> Create new -> Binance Smart Chain -> Binance Full (Deploy) -> Mainnet -> Basic -> Fill some basic info -> Create -> Click on it -> "Settings" -> API Endpoint that starts with wss: -> Done
1) For Pancakeswap have at least 1 BNB in funds, as you will need to get some fees, currencies and for the sniping itself
2) For Uniswap at least 0.5 ETH to get everything working smooth as some tokens you will want to snipe have big slippage and if the transaction fails you still pay the gas so don't waste money
3) Check new tokens on dextools
4) DYOR on dextools and see if the token contract you are sniping doesn't have rug pulls included

**WARNING**
This bot is free and I did it as a hobby project. Great starting place for new devs. DYOR.

**TROUBLESHOOT**
If your transaction failed:

1)Your gas price is too small
2)Your slippage is too small (use 20+ for early token)
