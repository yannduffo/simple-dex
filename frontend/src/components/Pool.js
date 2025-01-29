import React, {useState, useEffect} from 'react';

//import utils
import { dexFactory } from '../utils/factoryContract';
import { addLiquidity, removeLiquidity } from '../utils/poolContract';
import { corTableSymbAddr } from '../utils/tokenContract';
import web3 from '../utils/web3';

//import components
import WalletBox from './WalletBox';
import PoolItem from './PoolItem';

const Pool = () => {
    const [pools, setPools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connectedAccount, setConnectedAccount] = useState(null);
    //form inputs for creating a pool
    const [tokenA, setTokenA] = useState('');
    const [tokenB, setTokenB] = useState('');
    //form inputs for adding liquidity
    const [amountToken1, setAmountToken1] = useState('');
    const [amountToken2, setAmountToken2] = useState('');
    const [selectedPool, setSelectedPool] = useState('');
    //form inputs for removing liquidity
    const [amountLPToken, setAmountLPToken] = useState('');

    //load existing pools
    useEffect(() => {
        const fetchPools = async () => {
            try {
                //calling methods getAllPools from DexFactory SC
                const poolAddresses = await dexFactory.methods.getAllPools().call();
                setPools(poolAddresses);
            } catch (error) {
                console.error('Error while fetching pools', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPools();
    }, []);

    //create a new pool
    const createPool = async () => {
        //checkings
        if(!connectedAccount) {
            alert("Please connect a wallet first");
            return;
        }
        if(!web3.utils.isAddress(corTableSymbAddr.get(tokenA)) || !web3.utils.isAddress(corTableSymbAddr.get(tokenB))){
            alert("invalid address for token A or token B");
            return;
        }

        //calling createPool method from dexFactory SC
        try {
            setLoading(true);
            await dexFactory.methods.createPool(corTableSymbAddr.get(tokenA), corTableSymbAddr.get(tokenB)).send({from: connectedAccount});
            alert("Pool successfully created");

            //reload pool list
            const updatePools = await dexFactory.methods.getAllPools().call();
            setPools(updatePools);
        } catch (error) {
            console.error("Error while creating pool", error);
            alert("Error while creating the pool");
        } finally {
            setLoading(false)
        }
    }

    //adding liquidity
    const handleAddLiquidity = async () => {
        //checkings
        if(!connectedAccount) {
            alert("Please connect a wallet first"); 
            return;
        }
        if(!web3.utils.isAddress(selectedPool)){
            alert("Invalid pool address");
            return;
        }
        if(!amountToken1 || !amountToken2){
            alert("Please provide valid amount for tokenA tokenB");
            return;
        }

        //calling function from utils/poolContracts.js
        try {
            setLoading(true);
            await addLiquidity(selectedPool, amountToken1, amountToken2, connectedAccount);
            alert("Liquidity successfully added");
        } catch (err) {
            console.error("Error while adding Liquidity", err);
        } finally {
            setLoading(false);
        }
    };

    //removing liquidity
    const handleRemoveLiquidity = async () => {
        //checkings
        if(!connectedAccount) {
            alert("Please connect a wallet first"); 
            return;
        }
        if(!web3.utils.isAddress(selectedPool)){
            alert("Invalid pool address");
            return;
        }
        if(!amountLPToken || amountLPToken <= 0) {
            alert("Please enter a valid amount of LPToken to remove");
        }

        try {
            setLoading(true);
            await removeLiquidity(selectedPool, amountLPToken, connectedAccount);
            alert("Liquidity successfully removed");
        } catch (err) {
            console.error("Error while removing liquidity", err);
        } finally {
            setLoading(false);
        }
    }

    if(loading) return <p>Loading...</p>

    return(
        <div class="flex justify-center items-center my-20">
            <div class="flex flex-col bg-blue-50 p-4 border gap-2 rounded-xl w-full max-w-3xl">
                <div>
                    <h1 class=" font-bold text-xl ">Pools</h1>
                </div>
                <WalletBox
                    connectedAccount={connectedAccount}
                    setConnectedAccount={setConnectedAccount}
                />
                <div class="bg-blue-100 rounded-lg p-2">
                    <h2 class="font-bold text-lg">Available pools</h2>
                    <div class="flex flex-col gap-2">
                    {pools.length === 0 ? (
                        <p class="italic">Not any pool created</p>
                    ):(
                        pools.map((pool, index) => <PoolItem key={index} poolAddress={pool}/>)
                    )}
                    </div>
                </div>
                <div class="bg-blue-100 rounded-lg p-2">
                    <h2 class="font-bold text-lg">Add a new pool</h2>
                    <div class="flex flex-col items-center gap-2">
                        <label class="flex justify-around w-full">
                            TokenA symbol
                            <input type='text' placeholder='Txxx' value={tokenA} onChange={(e) => setTokenA(e.target.value)}/>
                        </label>
                        <label class="flex justify-around w-full">
                            TokenB symbol
                            <input type='text' placeholder='Tyyy' value={tokenB} onChange={(e) => setTokenB(e.target.value)}/>
                        </label>
                        <button 
                            onClick={createPool} 
                            disabled={!connectedAccount || loading}
                            class="py-1.5 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 w-2/5
                            disabled:bg-gray-200 disabled:text-gray-50 disabled:cursor-not-allowed"
                        >Create pool</button>
                    </div>
                </div>
                <div class="bg-blue-100 rounded-lg p-2">
                    <h2 class="font-bold text-lg">Add liquidity</h2>
                    <div class="flex flex-col items-center gap-2">
                        <label class="flex justify-around w-full">
                            Pool address
                            <input class="w-1/2 ml-3" type='text' placeholder="0x..." value={selectedPool} onChange={(e) => setSelectedPool(e.target.value)}/>
                        </label>
                        <label class="flex justify-around w-full">
                            Token1 amount
                            <input class="w-1/2" type='text' placeholder="1000" value={amountToken1} onChange={(e) => setAmountToken1(e.target.value)}/>
                        </label>
                        <label class="flex justify-around w-full">
                            Token2 amount
                            <input class="w-1/2" type='text' placeholder="1000" value={amountToken2} onChange={(e) => setAmountToken2(e.target.value)}/>
                        </label>
                        <button 
                            onClick={handleAddLiquidity} 
                            disabled={!connectedAccount || loading}
                            class="py-1.5 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 w-2/5
                            disabled:bg-gray-200 disabled:text-gray-50 disabled:cursor-not-allowed"
                        >Add Liquidity</button>
                    </div>
                    
                </div>
                <div class="bg-blue-100 rounded-lg p-2">
                    <h2 class="font-bold text-lg">Remove Liquidity</h2>
                    <div class="flex flex-col items-center gap-2">
                        <label class="flex justify-around w-full">
                            Pool address
                            <input class="w-1/2 ml-6" type='text' placeholder="0x..." value={selectedPool} onChange={(e) => setSelectedPool(e.target.value)}/>
                        </label>
                        <label class="flex justify-around w-full">
                            LPToken amount
                            <input class="w-1/2" type='text' placeholder="1000" value={amountLPToken} onChange={(e) => setAmountLPToken(e.target.value)}/>
                        </label>
                        <button 
                            onClick={handleRemoveLiquidity} 
                            disabled={!connectedAccount || loading}
                            class="py-1.5 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 w-2/5
                            disabled:bg-gray-200 disabled:text-gray-50 disabled:cursor-not-allowed"
                        >Remove Liquidity</button>
                    </div>
                    
                </div>
            </div>
        </div>
        
    );
};

export default Pool;