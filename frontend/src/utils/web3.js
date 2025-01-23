import Web3 from 'web3';

let web3;

//checking for a window.ethereum object (injected by metamask if installed)
if(window.ethereum) {
    //if a metamask instance is detected, web3 uses this window.ethereum as a provider
    web3 = new Web3(window.ethereum);
} else {
    //if no wallet is detected : direct connexion to the ganache dev environment
    web3 = new Web3(process.env.REACT_APP_RPC_URL);
}

export default web3;