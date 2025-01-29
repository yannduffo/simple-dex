import React, {useEffect, useState} from "react";
import web3 from "../utils/web3";

//import utils
import { getPoolDetails, getLPTokenInfo } from "../utils/poolContract";
import { corTableAddrSymbol } from "../utils/tokenContract";

const PoolItem = ({poolAddress}) => {
    const [details, setDetails] = useState('');
    const [LPTokenInfo, setLPTokenInfo] = useState('');

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

        const fetchLPTokenInfo = async () => {
            try {
                //fetch LP token infos using utils
                const LPDetails = await getLPTokenInfo(poolAddress);
                setLPTokenInfo(LPDetails);
            } catch (err) {
                console.error("Error while fetching LP token info :", err);
            }
        }

        fetchPoolDetails();
        fetchLPTokenInfo();
    }, [poolAddress]);

    if(!details) return <div>Loading pool details...</div>

    return(
        <div class="bg-blue-200 rounded-md p-2">
            <p>Pool address : {poolAddress}</p>
            <p>Token A : {corTableAddrSymbol.get(details.tokenA)}</p>
            <p>Token B : {corTableAddrSymbol.get(details.tokenB)}</p>
            <p>Reserves : {web3.utils.fromWei(details.reserves.tokenA, 'ether')} / {web3.utils.fromWei(details.reserves.tokenB, 'ether')}</p>

            <p>LPToken : {LPTokenInfo.name}</p>
            {/* <p>LPToken address : {LPTokenInfo.lpTokenAddress}</p>*/}
        </div>
    );
};

export default PoolItem;