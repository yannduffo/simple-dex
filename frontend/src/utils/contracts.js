// src/utils/contracts.js
// creation of web3.contract instances

import web3 from './web3';
import DexFactory from '../assets/abi/DexFactory.json';
import ERC20 from '../assets/abi/ERC20.json';

import tokenAddresses from '../assets/config/deployedTokens.json';

// dexFactory contracts ------------------------------------------------------------------------------

//geting network id (the ganache dev network one)
const networkId = Object.keys(DexFactory.networks)[0]; //using 1st available network
if(!networkId) {
    console.error("No networkId find in ABI files");
    throw new Error("Contracts aren't deployed on local network");
}

//getting DexFactory contract address from ABI file
const dexFactoryAddress = DexFactory.networks[networkId]?.address;
//cheking if addresses exists
if(!dexFactoryAddress){
    console.error("DexFactory contract address not found");
    throw new Error("DexFactory contract adress is missing in the ABI file");
}

//creating web3.contract instance
export const dexFactory = new web3.eth.Contract(DexFactory.abi, dexFactoryAddress);

// token contracts ----------------------------------------------------------------------------------

// TODO dynamicaly manage more than 2 tokens
//validate token addresses
if(!tokenAddresses.tokenABC || !tokenAddresses.tokenDEF) {
    console.error("Token addresses are missing");
    throw new Error("Token addresses not found in deployedTokens.json file");
}

//creating web3.contract instances for tokenABC and tokenDEF 
export const tokenABCContract = new web3.eth.Contract(ERC20.abi, tokenAddresses.tokenABC);
export const tokenDEFContract = new web3.eth.Contract(ERC20.abi, tokenAddresses.tokenDEF);