import web3 from './web3';
import DexFactory from '../assets/abi/DexFactory.json';

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

//creating and export web3.contract instance
export const dexFactory = new web3.eth.Contract(DexFactory.abi, dexFactoryAddress);

/**
 * Get the pool address for a specific token pair
 * @async
 * @param {string} addressTokenA 
 * @param {string} addressTokenB 
 * @returns {Promise<string>} Pool address if exists
 * @throws {Error} If no pool exists for this pair of tokens
 */
export const getPoolAddress = async (addressTokenA, addressTokenB) => {
    try {
        const poolAddress = await dexFactory.methods.getPoolAddress(addressTokenA, addressTokenB).call();
        if(poolAddress === '0x0000000000000000000000000000000000000000') {
            throw new Error("No pool exist for this pair of tokens");
        }
        return poolAddress;
    } catch (err) {
        console.error("Error fetching pool addr", err);
        throw err;
    }
}

