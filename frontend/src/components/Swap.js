import React, { useState, useEffect } from 'react';

//import utils
import { getPoolAddress} from '../utils/factoryContract';
import { getDexPoolContract, getPoolDetails} from '../utils/poolContract';
import { approveToken, corTableSymbAddr, corTableAddrSymbol } from '../utils/tokenContract';
import web3 from '../utils/web3';

//import components
import WalletBox from './WalletBox';

const Swap = () => {
    //state variables 
    const [tokenA, setTokenA] = useState('');
    const [tokenB, setTokenB] = useState('');
    const [amountIn, setAmountIn] = useState('');
    const [poolAddress, setPoolAddress] = useState('');
    const [details, setDetails] = useState('');
    //for account connexion
    const [connectedAccount, setConnectedAccount] = useState(null)
    const [loading, setLoading] = useState(false);
    //for ui 
    const [expectedAmountOutEth, setExpectedAmountOutEth] = useState(null);

    //handle pool selection
    const findPool = async () => {
        try {
            setLoading(true);
            const address = await getPoolAddress(corTableSymbAddr.get(tokenA), corTableSymbAddr.get(tokenB));
            console.log("Pool found : ", address);
            fetchPoolDetails(address.toString());
            setPoolAddress(address);
        } catch (err) {
            alert("No pool available to swap these 2 tokens, check the tokens or the pool list")
            setPoolAddress('');
        } finally {
            setLoading(false);
        }
    }

    const fetchPoolDetails = async (poolAddr) => {
        try {
            //fetch token infos and pool reserve calling utils/poolContract.js
            const poolDetails = await getPoolDetails(poolAddr);
            setDetails(poolDetails);
        } catch (err) {
            console.error("Error while fetching pool details : ", err);
        }
    };

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
                const expectedAmountOut = await poolContract.methods.getExpectedAmountOut(corTableSymbAddr.get(tokenA), corTableSymbAddr.get(tokenB), amountInInWei).call();
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
            const expectedAmountOut = await poolContract.methods.getExpectedAmountOut(corTableSymbAddr.get(tokenA), corTableSymbAddr.get(tokenB), amountInInWei).call();
            console.log("expectedAmountOut", expectedAmountOut);
            console.log("converions en uint avec toString");
            const uintAmountOut = expectedAmountOut.toString();

            //approve poolContract to spend amountIn of tokenA
            await approveToken(corTableSymbAddr.get(tokenA), poolAddress, connectedAccount, amountIn);

            //debuging logs 
            console.log("amountInWei : ", amountInInWei);
            console.log("amountOut : ", uintAmountOut);

            //perform swap
            await poolContract.methods.swapTokens(corTableSymbAddr.get(tokenA), corTableSymbAddr.get(tokenB), amountInInWei, uintAmountOut).send({from: connectedAccount});
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
        <div class="flex justify-center items-center mt-20">
            <div class="flex flex-col bg-slate-50 p-4 border gap-2 rounded-xl w-full max-w-xl shadow-lg">
                <div>
                    <h1 class=" font-bold text-xl ">Swap</h1>
                </div>
                <div>
                    <WalletBox
                        connectedAccount={connectedAccount}
                        setConnectedAccount={setConnectedAccount}
                    />
                </div>
                <div class="flex flex-col bg-slate-100 rounded-lg p-2 gap-2 items-center">
                    <label class="flex justify-between w-full">
                        TokenA symbol
                        <input type='text' placeholder='Txxx' value={tokenA} onChange={(e) => setTokenA(e.target.value)} />
                    </label>
                    <label class="flex justify-between w-full">
                        TokenB symbol
                        <input type='text' placeholder='Tyyy' value={tokenB} onChange={(e) => setTokenB(e.target.value)} />
                    </label>
                    <label class="flex justify-between w-full">
                        Amount to swap (A to B)
                        <input type="number" placeholder="Amount" value={amountIn} onChange={(e) => setAmountIn(e.target.value)} />
                    </label>
                    <button 
                        onClick={findPool} 
                        disabled={loading}
                        class="py-1.5 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-slate-700 w-2/5
                        disabled:bg-gray-200 disabled:text-gray-50 disabled:cursor-not-allowed"
                    >Find the pool</button>
                    {/* Pool found & expected amoount printings */}
                    {poolAddress && 
                    <p class="w-full">Selected pool :
                        <span className="ml-1">{corTableAddrSymbol.get(details.tokenA)} - {corTableAddrSymbol.get(details.tokenB)}</span>
                    </p>}
                    {expectedAmountOutEth !== null && (
                        <p class=" bg-slate-200 flex justify-start w-full rounded-md p-2">Expected amout out from swap : {expectedAmountOutEth}</p>
                    )}
                    <button 
                        onClick={handleSwap} 
                        disabled={loading || !poolAddress || !connectedAccount || !expectedAmountOutEth}
                        class="py-1.5 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-slate-700 w-2/5
                        disabled:bg-gray-200 disabled:text-gray-50 disabled:cursor-not-allowed"
                    >Swap</button>
                </div>
            </div>
        </div>
        
    );
};

export default Swap;