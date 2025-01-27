import web3 from "./web3";

//import abi files
import DexPool from '../assets/abi/DexPool.json';
import DexLiquidityToken from '../assets/abi/DexLiquidityToken.json';

//import utils
import { approveToken } from "./tokenContract";

// creating a web3.eth.Contract instance for a designted pool
/**
 * Creating a web3.eth.Contract instance for a designated pool
 * @param {string} poolAddress 
 * @returns {web3.eth.Contract} DexPool contract instance of the designated address
 */
export const getDexPoolContract = (poolAddress) => {
    if(!web3.utils.isAddress(poolAddress)) {
        throw new Error(`${poolAddress} is not a valid Ethereum address`);
    }
    //creating and returing new dexpool contract
    return new web3.eth.Contract(DexPool.abi, poolAddress);
};

/**
 * Obtain details from a designated pool (managed tokens and reserves)
 * @async
 * @param {string} poolAddress Pool address from which one we want to obtain details
 * @returns {Promise<JSON>} return infos
 */
export const getPoolDetails = async (poolAddress) => {
    //creating contract instance
    const poolContract = getDexPoolContract(poolAddress);

    //requesting infos from SC
    const [tokenA, tokenB, reserves] = await Promise.all([
        poolContract.methods.token1().call(),
        poolContract.methods.token2().call(),
        poolContract.methods.getReserves().call(),
    ]);

    //returning infos
    return {
        tokenA,
        tokenB,
        reserves:{
            tokenA : reserves[0],
            tokenB : reserves[1],
        },
    };

};

export const getLPTokenInfo = async (poolAddress) => {
    //creating contract instance
    const poolContract = getDexPoolContract(poolAddress);

    // getting LPtoken address & creating LPtoken Contract instance
    const lpTokenAddress = await poolContract.methods.liquidityToken().call();
    const lpTokenContract = new web3.eth.Contract(DexLiquidityToken.abi, lpTokenAddress);

    //getting info from LPtoken contract instance
    const name = await lpTokenContract.methods.name().call();
    const symbol = await lpTokenContract.methods.symbol().call();
    const totalSupply = await lpTokenContract.methods.totalSupply().call();

    return {name, symbol, totalSupply, lpTokenAddress,};
}

/**
 * Add liquidity to a pool
 * @async
 * @param {string} poolAddress 
 * @param {uint} amountToken1 amount in ether
 * @param {uint} amountToken2 amount in ether
 * @param {string} account 
 */
export const addLiquidity = async (poolAddress, amountToken1, amountToken2, account) => {
    //creating contract instance
    const poolContract = getDexPoolContract(poolAddress);

    // getting tokens addresses
    const addressToken1 = await poolContract.methods.token1().call();
    const addressToken2 = await poolContract.methods.token2().call();

    //need approval for DexPool to be able to spend the necessery amount of tokens :
    await approveToken(addressToken1, poolAddress, account, amountToken1);
    await approveToken(addressToken2, poolAddress, account, amountToken2);

    //converting everything in wei
    const amountToken1InWei = web3.utils.toWei(amountToken1.toString(), 'ether');
    const amountToken2InWei = web3.utils.toWei(amountToken2.toString(), 'ether');

    //reqeust to SC
    await poolContract.methods.addLiquidity(amountToken1InWei, amountToken2InWei).send({from: account});

    console.log(`Liquidity added to pool : ${poolAddress}`);
}