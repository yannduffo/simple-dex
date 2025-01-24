import React, { useState } from 'react';
import { dexPool } from '../utils/contracts';

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

        //getting expectedAmountOut from the SC
        const expectedAmountOut = await dexPool.methods.getExpectedAmountOut(tokenA, tokenB, amountIn).call();
        setAmountOut(expectedAmountOut);

        console.log("amountIn : ", amountIn);
        console.log("amountOut : ", amountOut);

        //swaping
        await dexPool.methods.swapTokens(tokenA, tokenB, amountIn, amountOut).send({from: account});
        alert("Swap successfuly done");
    }

    return(
        <div>
            <h1>Swap</h1>
            <input placeholder="Token A" value={tokenA} onChange={(e) => setTokenA(e.target.value)} />
            <input placeholder="Token B" value={tokenB} onChange={(e) => setTokenB(e.target.value)} />
            <input placeholder="Amount" value={amountIn} onChange={(e) => setAmountIn(e.target.value)} />
            <button onClick={handleSwap}>Swap</button>
        </div>
    );
};

export default Swap;