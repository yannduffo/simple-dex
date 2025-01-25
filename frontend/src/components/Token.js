// "token.js" component for dev propose
// print a list of all fictive token deployed on the simulation blockchain
// 
// on a production infrasctucture this could be handle by calling an API 
// to ask the DEX server what token are managed by the DEX

import React, {useEffect, useState} from 'react';
import { tokenABCContract, tokenDEFContract } from '../utils/contracts';

const Token = () => {
    // const [tokens, setTokens] = useState('');

    // useEffect(() => {
    //     //func to get token details
    //     const fetchTokenDetails = async (tokenContrat) => {
    //         try{
    //             const name = await tokenContrat.methods.name().call();
    //             const symbol = await tokenContrat.methods.symbol().call();
    //             const address = tokenContrat._address;
    //             return {name, symbol, address};

    //         } catch(err) {
    //             console.error("Error during token detail fetching", err);
    //             return null;
    //         }
    //     };

    //     //func to get details from all fictive tokens
    //     const loadTokens = async () => {
    //         const tokenContracts = [tokenABCContract, tokenDEFContract];
    //         const tokenDetails = await Promise.all(
    //             tokenContracts.map((contract) => fetchTokenDetails(contract))
    //         );
    //         setTokens(tokenDetails.filter(Boolean)); //filter to add only valid tokens to local state variable
    //     };

    //     loadTokens();
    // }, []);

    return(
        <p>token</p>
    );
}

export default Token;