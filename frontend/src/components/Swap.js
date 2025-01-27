import React, { useState, useEffect } from 'react';
import web3 from '../utils/web3';

//import utils
import { getPoolAddress} from '../utils/contracts';
import { getDexPoolContract, approveToken } from '../utils/poolContract';

//import components
import WalletBox from './WalletBox';

const Swap = () => {
    //state variables 
    const [tokenA, setTokenA] = useState('');
    const [tokenB, setTokenB] = useState('');
    const [amountIn, setAmountIn] = useState('');
    const [poolAddress, setPoolAddress] = useState('');
    //for account connexion
    const [connectedAccount, setConnectedAccount] = useState(null)
    const [loading, setLoading] = useState(false);
    //for ui 
    const [expectedAmountOutEth, setExpectedAmountOutEth] = useState(null);

    //handle pool selection
    const findPool = async () => {
        try {
            setLoading(true);
            const address = await getPoolAddress(tokenA, tokenB);
            console.log("Pool found : ", address);
            setPoolAddress(address);
        } catch (err) {
            alert("No pool available to swap these 2 tokens")
            setPoolAddress('');
        } finally {
            setLoading(false);
        }
    }

    //printing expectedValue in ETH before swapping
    useEffect(() => {
        const calculateExpectedAmoutOut = async () => {
            if(!amountIn || !tokenA || !tokenB || !poolAddress) {
                setExpectedAmountOutEth(null);
                return;
            }

            try {
                const poolContract = getDexPoolContract(poolAddress);
                const amountInInWei = web3.utils.toWei(amountIn.toString(), 'ether');
                const expectedAmountOut = await poolContract.methods.getExpectedAmountOut(tokenA, tokenB, amountInInWei).call();
                const exptAmountOutEth = web3.utils.fromWei(expectedAmountOut.toString(), 'ether');
                setExpectedAmountOutEth(exptAmountOutEth)
            } catch (err) {
                console.error("Error while calculating expected amount out for prinitng", err);
                setExpectedAmountOutEth(null);
            }
        }
        calculateExpectedAmoutOut();

    }, [amountIn, poolAddress, tokenA, tokenB]); //recalculate each form input changement

    //handle swap by calling SC
    const handleSwap = async () => {
        //cheking
        if(!poolAddress){
            alert("No pool found for these pair of tokens")
        }

        try {
            setLoading(true);

            //converting amountIn to wei values
            const amountInInWei = web3.utils.toWei(amountIn.toString(), "ether");

            //getting expectedAmountOut from the SC
            const poolContract = getDexPoolContract(poolAddress);
            const expectedAmountOut = await poolContract.methods.getExpectedAmountOut(tokenA, tokenB, amountInInWei).call();
            console.log("expectedAmountOut", expectedAmountOut);
            console.log("converions en uint avec toString");
            const uintAmountOut = expectedAmountOut.toString();

            //approve poolContract to spend amountIn of tokenA
            await approveToken(tokenA, poolAddress, connectedAccount, amountIn);

            //debuging logs 
            console.log("amountInWei : ", amountInInWei);
            console.log("amountOut : ", uintAmountOut);

            //perform swap
            await poolContract.methods.swapTokens(tokenA, tokenB, amountInInWei, uintAmountOut).send({from: connectedAccount});
            alert("Swap successfuly done");
            
        } catch (err) {
            console.error("Error while swaping : ", err);
            alert("An error occured while swapping");
        } finally {
            setLoading(false);
        }
    }

    if(loading) return <p>Loading...</p>

    return(
        <div>
            <WalletBox
                connectedAccount={connectedAccount}
                setConnectedAccount={setConnectedAccount}
            />
            <h1>Swap</h1>
            <label>
                TokenA address
                <input type='text' value={tokenA} onChange={(e) => setTokenA(e.target.value)} />
            </label>
            <label>
                TokenB address
                <input type='text' value={tokenB} onChange={(e) => setTokenB(e.target.value)} />
            </label>
            <label>
                Amount to swap (from A to B)
                <input type="number" placeholder="Amount" value={amountIn} onChange={(e) => setAmountIn(e.target.value)} />
            </label>
            {poolAddress && <p>Selected pool : {poolAddress}</p>}
            {expectedAmountOutEth !== null && (
                <p>Expected amout out from swap : {expectedAmountOutEth}</p>
            )}
            <button onClick={findPool} disabled={loading}>Find the pool</button>
            <button onClick={handleSwap} disabled={loading || !poolAddress || !connectedAccount || !expectedAmountOutEth}>Swap</button>
        </div>
    );
};

export default Swap;