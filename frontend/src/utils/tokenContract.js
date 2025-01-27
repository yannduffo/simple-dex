import web3 from "./web3";
import ERC20 from '../assets/abi/ERC20.json';

import tokenAddresses from '../assets/config/deployedTokens.json';

//check if some addresses are in the deployedToken.json file
if(!tokenAddresses || Object.keys(tokenAddresses).length ===0) {
    console.error("No deployed tokens found in deployedToken.json");
    throw new Error("No token found in deployedTokens.json file");
}

//new tokenContract table
const tokenContracts = {};

//read deployedToken.json file and create a contract instance for each token
Object.entries(tokenAddresses).forEach(([tokenName, tokenAddress]) => {
    if(!web3.utils.isAddress(tokenAddress)) {
        console.error(`Invalid token address for ${tokenName}`);
        throw new Error(`Invalid token address for ${tokenName}`);
    }

    //creating tokenContract instance and pushing it on the table
    tokenContracts[tokenAddress] = new web3.eth.Contract(ERC20.abi, tokenAddress);
});

//dynamicaly export all tokenContracts
export default tokenContracts;

/**
 * Approve an address to spend a designated quantity of a designated token
 * @async
 * @param {string} tokenContractAddress token contract address
 * @param {string} spenderAddress address which will be allowed to spend the tokens
 * @param {string} account user address 
 * @param {number|string} amount Token quantity to approve (in ether)
 */
export const approveToken = async (tokenContractAddress, spenderAddress, account, amount) => {
    try {
        //getting the contract from our tokenContracts table
        const tokenContract = tokenContracts[tokenContractAddress];
        if(!tokenContract) {
            throw new Error(`No token contract at this address : ${tokenContractAddress}`);
        }

        //convert amount in wei
        const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

        //approve spenderAddress
        await tokenContract.methods.approve(spenderAddress, amountInWei).send({from : account});
        console.log(`Approved ${amount} tokens for ${spenderAddress}`);
        
    } catch (err) {
        console.error("Error while approving token to be spend", err);
        throw err;
    }
};