# Simple-DEX (Smart-contracts)

## Overview

This project is a simple decentralized exchange (DEX) built using Solidity and Truffle. This directory is the one containing all "Blockchian related" code. It is supposed to work with the developped front-end. **All the contracts are compatible with ERC-20 @openzeppelin standards**. This simple DEX allows users to:

- Create liquidity pools.
- Add or remove liquidity.
- Swap ERC-20 tokens.

This project is intended for learning purposes and runs on a simulated blockchain using Ganache.

## Technologies Used

- **Solidity** : Smart contract programming language.
- **Truffle** : Ethereum development framework.
- **Ganache** : Local blockchain for development and testing.
- **Web3.js** : JavaScript library for interacting with Ethereum blockchain.
- **Chai** : Testing framework.

## Project Structure

```
project-root/
│── contracts/             # Solidity contracts
│   ├── DexFactory.sol     # Factory contract for managing liquidity pools
│   ├── DexPool.sol        # Handles liquidity management and swaps
│   ├── DexLiquidityToken.sol  # Simple ERC-20 token for liquidity providers
│   ├── TestToken.sol      # Fictitious ERC-20 tokens for testing
│   ├── Migrations.sol     # Truffle migration contract
│── migrations/            # Deployment scripts
│── test/                  # Tests written in JavaScript
│── build/                 # Compiled contract artifacts
│── truffle-config.js      # Truffle configuration file
```

## Contracts Overview

**DexFactory.sol :**

- Responsible for creating and managing liquidity pools.
- Stores deployed pools to prevent duplicate pairs.

**DexPool.sol :**

- Manages token reserves.
- Allows adding and removing liquidity.
- Enables token swaps (appliying fees to remunerate Liquidity Providers).

**DexLiquidityToken.sol :**

- Simple ERC-20 token distributed to liquidity providers in exchange for deposits.
- Permission are managed with **@openzeppelin AccessControl**

**TestToken.sol :**

- A simple ERC-20 token contract used to simulate trading pairs.
- ERC-20 tokens are generated using **@openzeppelin strandards**

## Testing

To run the test suite:

```
truffle test
```

This will execute the tests found in test/DexPool.test.js, ensuring functionality such as liquidity addition and swaps work correctly.

## Usage

### Adding Liquidity

Before adding liquidity, approve the pool contract to spend tokens on your behalf:

```
await tokenABC.approve(dexPool.address, web3.utils.toWei("100"));
await tokenDEF.approve(dexPool.address, web3.utils.toWei("100"));
await dexPool.addLiquidity(web3.utils.toWei("100"), web3.utils.toWei("100"));
```

### Swapping Tokens

To swap TokenABC for TokenDEF, approve the DEX and execute a swap:

```
await tokenABC.approve(dexPool.address, web3.utils.toWei("10"));
await dexPool.swapTokens(
    tokenABC.address,
    tokenDEF.address,
    web3.utils.toWei("10"),
    web3.utils.toWei("9")
);
```

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- Node.js (v14-v18)
- Truffle (npm install -g truffle)
- Ganache (GUI or CLI)

### Clone the repository

```
git clone git@github.com:yannduffo/simple-dex.git
cd smart-contract
```

### Install dependencies

```
npm install
```

### Start Ganache

Run Ganache CLI:

```
ganache-cli --port 7545
```

Or open the Ganache GUI and start a workspace.

### Deploy contracts

Compile and deploy the smart contracts:

```
truffle compile
truffle migrate --reset
```

## Limitations

- Not production-ready: This is strictly an educational project, not intended for deployment on mainnets.

<br>
<br>
<br>
Created by Yann Duffo
