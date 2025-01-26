import web3 from "./web3";
import DexPool from '../assets/abi/DexPool.json';

// creating a web3.eth.Contract instance for a designted pool
export const getDexPoolContract = (poolAddress) => {
    if(!web3.utils.isAddress(poolAddress)) {
        throw new Error(`${poolAddress} is not a valid Ethereum address`);
    }
    //creating and returing new dexpool contract
    return new web3.eth.Contract(DexPool.abi, poolAddress);
};

//getting pool detail (tokens and reserve) for a designated pool
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