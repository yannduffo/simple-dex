import React, { useState } from 'react';
import { dexPool, tokenABCContract } from '../utils/contracts';
import web3 from '../utils/web3';

const Swap = () => {
    //state variables 
    const [tokenA, setTokenA] = useState('');
    const [tokenB, setTokenB] = useState('');
    const [amountIn, setAmountIn] = useState('');
    const [amountOut, setAmountOut] = useState('');

    //handle swap by calling SC
    const handleSwap = async () => {
        //get account to use
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        const account = accounts[0];

        //converting amountIn to wei values
        const amountInInWei = web3.utils.toWei(amountIn.toString(), "ether");

        //getting expectedAmountOut from the SC
        const expectedAmountOut = await dexPool.methods.getExpectedAmountOut(tokenA, tokenB, amountInInWei).call();
        setAmountOut(expectedAmountOut); //the value retrun already is in WEI

        //approve DexPool contract to spend amountIn of TokenA
        await tokenABCContract.methods.approve(dexPool.options.address, amountInInWei).send({from: account});

        console.log("amountInWei : ", amountInInWei);
        console.log("amountOut : ", amountOut);

        //swaping
        await dexPool.methods.swapTokens(tokenA, tokenB, amountInInWei, amountOut).send({from: account});
        alert("Swap successfuly done");
    }

    return(
        <div>
            <h1>Swap</h1>
            <input placeholder="Token A" value={tokenA} onChange={(e) => setTokenA(e.target.value)} />
            <input placeholder="Token B" value={tokenB} onChange={(e) => setTokenB(e.target.value)} />
            <input type="number" placeholder="Amount" value={amountIn} onChange={(e) => setAmountIn(e.target.value)} />
            <button onClick={handleSwap}>Swap</button>
        </div>
    );
};

export default Swap;