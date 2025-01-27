import React, {useEffect, useState} from "react";
import web3 from "../utils/web3";
//import utils
import { getPoolDetails } from "../utils/poolContract";

const PoolItem = ({poolAddress}) => {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const fetchPoolDetails = async () => {
            try {
                //fetch token infos and pool reserve calling utils/poolContract.js
                const poolDetails = await getPoolDetails(poolAddress);
                setDetails(poolDetails);
            } catch (err) {
                console.error("Error while fetching pool details : ", err);
            }
        };

        fetchPoolDetails();
    }, [poolAddress]);

    if(!details) return <div>Loading pool details...</div>

    return(
        <div>
            <p>Pool address : {poolAddress}</p>
            <p>Token A : {details.tokenA}</p>
            <p>Token B : {details.tokenB}</p>
            <p>Reserves : {web3.utils.fromWei(details.reserves.tokenA, 'ether')} / {web3.utils.fromWei(details.reserves.tokenB, 'ether')}</p>
        </div>
    );
};

export default PoolItem;