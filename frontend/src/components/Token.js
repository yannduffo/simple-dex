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
        <div class="flex justify-center items-center mt-20">
            <div class="flex flex-col bg-blue-50 p-4 border gap-2 rounded-xl">
                <div>
                    <h1 class=" font-bold text-xl ">Fictive tokens list</h1>
                </div>
                <table class="w-full bg-blue-100 rounded-md p-2">
                    <thead class="text-left">
                        <tr>
                            <th class="px-4 py-2">Name</th>
                            <th class="px-4 py-2">Symbol</th>
                            <th class="px-4 py-2">Adress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokens.map((token, index) => (
                            <tr key={index} className="hover:bg-blue-200">
                                <td class="px-4 py-2">{token.name}</td>
                                <td class="px-4 py-2">{token.symbol}</td>
                                <td class="px-4 py-2">{token.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
       
    );
}

export default Token;