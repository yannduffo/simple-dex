import React from "react";

const WalletBox = ({connectedAccount, setConnectedAccount}) => {
    const connectWallet = async () => {
        try {
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            setConnectedAccount(accounts[0]); //update parent state
            alert("Metamask connected");
        } catch (err) {
            console.error("Error while connecting metamask wallet", err);
            alert("Metamask wallet connection failed");
        }
    };

    const disconnectWallet = () => {
        setConnectedAccount(null); //update parent state
        alert("Metamask disconnected");
    }

    return (
        <div>
            <p>Wallet box</p>
            { connectedAccount ? (
                <div>
                    <p>Connected as : {connectedAccount}</p>
                    <button onClick={disconnectWallet}>Disconnect Metamask</button>
                </div>
            ) : (
                <button onClick={connectWallet}>Connect Metamask</button>
            )}
        </div>
    );
}

export default WalletBox;