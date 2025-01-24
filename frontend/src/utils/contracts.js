// src/utils/contracts.js
// creation of web3.contract instances

import web3 from './web3';
import DexSwap from '../abi/DexSwap.json';
import DexPool from '../abi/DexPool.json';
import ERC20 from '../abi/ERC20.json';

//geting network id (the ganache dev network one)
const networkId = Object.keys(DexSwap.networks)[0]; //using 1st available network
if(!networkId) {
    console.error("No networkId find in ABI files");
    throw new Error("Contracts aren't deployed on local network");
}

//getting contract addresses from ABI files
const dexSwapAddress = DexSwap.networks[networkId]?.address;
const dexPoolAddress = DexPool.networks[networkId]?.address;
//cheking if addresses exists
if(!dexPoolAddress || !dexSwapAddress){
    console.error("Contracts addresses not found");
    throw new Error("Contract adresses are missing in the ABI file");
}

//creating web3.contract instances
export const dexSwap = new web3.eth.Contract(DexSwap.abi, dexSwapAddress);
export const dexPool = new web3.eth.Contract(DexPool.abi, dexPoolAddress);

//addresses of tokenAcontract and tokenBcontract : 
const tokenAddresses = {
    "tokenABC": "0x62233bDb4ad24776F68042a2014AC10A6eEc80E5",
    "tokenDEF": "0x2e1BC7305a0Ff7C1B263768c31fF237ca6ec5229"
};

//creating web3.contract instances for tokenABC and tokenDEF 
export const tokenABCContract = new web3.eth.Contract(ERC20.abi, tokenAddresses.tokenABC);
export const tokenDEFContract = new web3.eth.Contract(ERC20.abi, tokenAddresses.tokenDEF);