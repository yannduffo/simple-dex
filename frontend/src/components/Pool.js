import React, {useState} from 'react';
import { dexPool } from '../utils/contracts';

const Pool = () => {
    //state variable
    const [tokenA, setTokenA] = useState('');
    const [tokenB, setTokenB] = useState('');
    const [amountTokenA, setAmountTokenA] = useState('');
    const [amountTokenB, setAmountTokenB] = useState('');

    //handle liquidity providing by calling SC
    const handleAddLiquidity = async () => {
        //get account to use (theorically from metamask)
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        const account = accounts[0];

        //adding liquidity to a pool 
        await dexPool.methods.addLiquidity(amountTokenA, amountTokenB).send({from: account});
        alert("Liquidity successfuly added");
    }

    return (
        <div>
            <h1>Pool</h1>
            <input placeholder="Token A" value={tokenA} onChange={(e) => setTokenA(e.target.value)} />
            <input placeholder="Token B" value={tokenB} onChange={(e) => setTokenB(e.target.value)} />
            <input placeholder="Amount Token A" value={amountTokenA} onChange={(e) => setAmountTokenA(e.target.value)} />
            <input placeholder="Amount Token B" value={amountTokenB} onChange={(e) => setAmountTokenB(e.target.value)} />
            <button onClick={handleAddLiquidity}>Add liquidity</button>
        </div>
    );
};

export default Pool;