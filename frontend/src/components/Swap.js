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

        //calculate theorical amountOut
        //for a 1 to 1 conversion rate, the expected amountOut should be amountIn - fee
        setAmountOut(amountIn * 0.95); //95% de amountIn 

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