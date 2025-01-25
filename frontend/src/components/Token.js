// "token.js" component for dev propose
// print a list of all fictive token deployed on the simulation blockchain
// 
// on a production infrasctucture this could be handle by calling an API 
// to ask the DEX server what token are managed by the DEX

import React, {useEffect, useState} from 'react';
import { tokenABCContract, tokenDEFContract } from '../utils/contracts';

const Token = () => {
    const [tokens, setTokens] = useState('');
    const [loading, setLoading] = useState('true');

    useEffect(() => {
        const fetchTockens = async () => {
            try {
                //func to get token details
                const fetchTokenDetails = async (tokenContrat) => {
                    try{
                        const name = await tokenContrat.methods.name().call();
                        const symbol = await tokenContrat.methods.symbol().call();
                        const address = tokenContrat._address;
                        return {name, symbol, address};
        
                    } catch(err) {
                        console.error("Error during token detail fetching", err);
                        return null;
                    }
                };
        
                //get details from all fictive tokens
                const tokenContracts = [tokenABCContract, tokenDEFContract];
                const tokenDetails = await Promise.all(
                    tokenContracts.map((contract) => fetchTokenDetails(contract))
                );
                setTokens(tokenDetails.filter(Boolean)); //filter to add only valid tokens to local state variable
        
            } catch (error) {
                console.error(" Error while charging token details", error);
            } finally{
                setLoading(false);
            }
        }
        
        fetchTockens();
    }, []);

    if(loading) return <p>Tokens fetching...</p>

    return(
        <div>
            <p>Fictive tokens list</p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Symbol</th>
                        <th>Adress</th>
                    </tr>
                </thead>
                <tbody>
                    {tokens.map((token, index) => (
                        <tr key={index}>
                            <td>{token.name}</td>
                            <td>{token.symbol}</td>
                            <td>{token.address}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Token;