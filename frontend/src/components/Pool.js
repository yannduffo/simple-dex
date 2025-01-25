import React, {useState} from 'react';
//import { dexPool, tokenABCContract, tokenDEFContract } from '../utils/contracts';
import web3 from '../utils/web3';

const Pool = () => {
    // //state variable
    // const [tokenA, setTokenA] = useState('');
    // const [tokenB, setTokenB] = useState('');
    // const [amountTokenA, setAmountTokenA] = useState('');
    // const [amountTokenB, setAmountTokenB] = useState('');

    // //handle liquidity providing by calling SC
    // const handleAddLiquidity = async () => {
    //     //get account to use (theorically from metamask)
    //     const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    //     const account = accounts[0];

    //     //converting amout to Wei values
    //     const amountTokenAInWei = web3.utils.toWei(amountTokenA.toString(), "ether");
    //     const amountTokenBInWei = web3.utils.toWei(amountTokenB.toString(), "ether");

    //     //approve DexPool contract to spend right number of tokenABC and tokenDEF from user
    //     await tokenABCContract.methods.approve(dexPool.options.address, amountTokenAInWei).send({from: account});
    //     await tokenDEFContract.methods.approve(dexPool.options.address, amountTokenBInWei).send({from: account});

    //     //adding liquidity to a pool 
    //     await dexPool.methods.addLiquidity(amountTokenAInWei, amountTokenBInWei).send({from: account});
    //     alert("Liquidity successfuly added");
    // }

    // return (
    //     <div>
    //         <h1>Pool</h1>
    //         <input placeholder="Token A" value={tokenA} onChange={(e) => setTokenA(e.target.value)} />
    //         <input placeholder="Token B" value={tokenB} onChange={(e) => setTokenB(e.target.value)} />
    //         <input type="number" placeholder="Amount Token A" value={amountTokenA} onChange={(e) => setAmountTokenA(e.target.value)} />
    //         <input type="number" placeholder="Amount Token B" value={amountTokenB} onChange={(e) => setAmountTokenB(e.target.value)} />
    //         <button onClick={handleAddLiquidity}>Add liquidity</button>
    //     </div>
    // );
    return(
        <p>pool</p>
    );
};

export default Pool;