import React from "react";

const WalletBox = ({connectedAccount, setConnectedAccount}) => {
    const connectWallet = async () => {
        try {
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            setConnectedAccount(accounts[0]); //update parent state
            //alert("Metamask connected");
        } catch (err) {
            console.error("Error while connecting metamask wallet", err);
            alert("Metamask wallet connection failed");
        }
    };

    const disconnectWallet = () => {
        setConnectedAccount(null); //update parent state
        //alert("Metamask disconnected");
    }

    return (
        <div class="bg-slate-100 rounded-lg p-2 ">
            { connectedAccount ? (
                <div class="flex justify-between items-center">
                    <div class="mr-8">
                        <p class="text-md">Connected as : </p>
                        <p class="text-xs">{connectedAccount}</p>
                    </div>
                    <button 
                        onClick={disconnectWallet}
                        class="py-1.5 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-slate-700"
                    >Disconnect Metamask</button>
                </div>
            ) : (
                <div class="flex justify-between items-center">
                    <p>Wallet connexion</p>
                    <button 
                        onClick={connectWallet}
                        class="py-1.5 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-slate-700"
                    >Connect Metamask</button>
                </div>
            )}
        </div>
    );
}

export default WalletBox;