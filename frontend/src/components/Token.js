import React, {useEffect, useState} from 'react';

//import utils
import { corTableNameAddr, corTableSymbAddr } from '../utils/tokenContract';

const Token = () => {
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        //creating an array from correspondanceTables 
        const tokensArray = Array.from(corTableNameAddr.entries()).map(([name, address]) => {
            //get the symbol
            const symbol = Array.from(corTableSymbAddr.entries()).find(([, addr]) => addr === address)?.[0];
            return {name, symbol, address};
        })

        setTokens(tokensArray);
    }, []);

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