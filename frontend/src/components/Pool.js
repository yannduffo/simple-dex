import React, {useState, useEffect} from 'react';
import { dexFactory } from '../utils/contracts';
import web3 from '../utils/web3';

//import components
import WalletBox from './WalletBox';
import PoolItem from './PoolItem';

const Pool = () => {
    const [pools, setPools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connectedAccount, setConnectedAccount] = useState(null);
    //form inputs
    const [tokenA, setTokenA] = useState('');
    const [tokenB, setTokenB] = useState('');

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
    );
};

export default Pool;