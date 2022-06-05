# WEB3 ESHOP
Simple Web3 application. You can try it out [here](https://web3-eshop-client.azurewebsites.net) or read article on [suduj.digital](https://studuj.digital/?p=24316) blog.

## Dependencies
- [Truffle](https://trufflesuite.com/truffle/)
- If you plan to run application locally you will also need [Ganache](https://trufflesuite.com/ganache/)
- Otherwise you will need [HD wallet provider](https://www.npmjs.com/package/@truffle/hdwallet-provider)

## Setup
First install node packages using `npm install` then initialize truffle project using `truffle init`. Now move from "smart contracts" folder "2_deploy_MyToken.js" to "migrations" and "MyToken.sol" to "contracts" folder. If you plan to deploy to public network, use "truffle_config.js" from "smart contracts" folder.

## Deployment
For deployment on local network use `truffle deploy`. For public networks add `--network <network name>` flag.

## Run app
Just type `npm start` and app will run on http://localhost:3000.
