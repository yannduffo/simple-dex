import React, {useEffect, useState} from 'react';

//import utils
import tokenContracts from '../utils/tokenContract';

const Token = () => {
    const [tokens, setTokens] = useState('');
    const [loading, setLoading] = useState('true');

    useEffect(() => {
        const fetchTockens = async () => {
            try {
                //func to get token details
                const fetchTokenDetails = async (tokenContrat, tokenAddress) => {
                    try{
                        const name = await tokenContrat.methods.name().call();
                        const symbol = await tokenContrat.methods.symbol().call();
                        return {name, symbol, address: tokenAddress};
        
                    } catch(err) {
                        console.error("Error during token detail fetching", err);
                        return null;
                    }
                };
        
                //get details from all fictive tokens
                const tokenDetails = await Promise.all(
                    Object.entries(tokenContracts).map(([tokenAddress, tokenContrat]) => fetchTokenDetails(tokenContrat, tokenAddress))
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