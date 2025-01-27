import React, {useState, useEffect} from 'react';

//import utils
import { dexFactory } from '../utils/factoryContract';
import { addLiquidity, removeLiquidity } from '../utils/poolContract';
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
        if(!web3.utils.isAddress(tokenA) || !web3.utils.isAddress(tokenB)){
            alert("invalid address for token A or token B");
            return;
        }

        //calling createPool method from dexFactory SC
        try {
            setLoading(true);
            await dexFactory.methods.createPool(tokenA, tokenB).send({from: connectedAccount});
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
        <div>
            <WalletBox
                connectedAccount={connectedAccount}
                setConnectedAccount={setConnectedAccount}
            />
            <p>Available pools</p>
            <div>
            {pools.length === 0 ? (
                <p>Not any pool created</p>
            ):(
                pools.map((pool, index) => <PoolItem key={index} poolAddress={pool}/>)
            )}
            </div>
            <div>
                <p>Add a new pool</p>
                <label>
                    TokenA address
                    <input type='text' value={tokenA} onChange={(e) => setTokenA(e.target.value)}/>
                </label>
                <label>TokenB address
                    <input type='text' value={tokenB} onChange={(e) => setTokenB(e.target.value)}/>
                </label>
                <button onClick={createPool} disabled={!connectedAccount || loading}>Create pool</button>
            </div>
            <div>
                <p>Add liquidity</p>
                <label>
                    Pool address
                    <input type='text' value={selectedPool} onChange={(e) => setSelectedPool(e.target.value)}/>
                </label>
                <label>
                    Token1 amount
                    <input type='text' value={amountToken1} onChange={(e) => setAmountToken1(e.target.value)}/>
                </label>
                <label>
                    Token2 amount
                    <input type='text' value={amountToken2} onChange={(e) => setAmountToken2(e.target.value)}/>
                </label>
                <button onClick={handleAddLiquidity} disabled={!connectedAccount || loading}>Add Liquidity</button>
            </div>
            <div>
                <p>Remove Liquidity</p>
                <label>
                    Pool address
                    <input type='text' value={selectedPool} onChange={(e) => setSelectedPool(e.target.value)}/>
                </label>
                <label>
                    LPToken amount to remove
                    <input type='text' value={amountLPToken} onChange={(e) => setAmountLPToken(e.target.value)}/>
                </label>
                <button onClick={handleRemoveLiquidity} disabled={!connectedAccount || loading}>Remove Liquidity</button>
            </div>
        </div>
    );
};

export default Pool;