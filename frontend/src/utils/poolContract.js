import web3 from "./web3";
import DexPool from '../assets/abi/DexPool.json';
import ERC20 from '../assets/abi/ERC20.json';

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

//getting approval to spent tokens
export const approveToken = async (tokenAddress, spenderAddress, account, amount) => {
    //cerating instance of token contract
    const tokenContract = new web3.eth.Contract(ERC20.abi, tokenAddress);

    //getting the approval
    const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
    await tokenContract.methods.approve(spenderAddress, amountInWei).send({ from: account });

    console.log(`Approved ${amount} tokens for ${spenderAddress}`);
};

//adding liquidity to a designated pool
export const addLiquidity = async (poolAddress, amountToken1, amountToken2, account) => {
    //creating contract instance
    const poolContract = getDexPoolContract(poolAddress);

    // getting tokens addresses
    const token1 = await poolContract.methods.token1().call();
    const token2 = await poolContract.methods.token2().call();

    //need approval for DexPool to be able to spend the necessery amount of tokens :
    await approveToken(token1, poolAddress, account, amountToken1);
    await approveToken(token2, poolAddress, account, amountToken2);

    //converting everything in wei
    const amountToken1InWei = web3.utils.toWei(amountToken1.toString(), 'ether');
    const amountToken2InWei = web3.utils.toWei(amountToken2.toString(), 'ether');

    //reqeust to SC
    await poolContract.methods.addLiquidity(amountToken1InWei, amountToken2InWei).send({from: account});

    console.log(`Liquidity added to pool : ${poolAddress}`);
}