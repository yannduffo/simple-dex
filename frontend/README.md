# Simple DEX (Frontend)

## Overview

This is the frontend for a simple decentralized exchange (DEX). It works with the associated smart-contracts coded in Solidity and deployed on a Ganache simulation blockchain. This frontend allows users to:

- Swap ERC-20 fictive tokens.
- Create and manage liquidity pools.
- Using a browser wallet (Metamask) to interact with the simulation blockchain.

This project is designed for learning purposes and operates on a local blockchain simulated with Ganache.

## Technologies Used

- **React** : Frontend library.
- **Web3.js** : Ethereum blockchain interaction.
- **Tailwind CSS** : Styling.
- **React Router** : Navigation between pages.
- **Metamask** : Wallet integration.

## Project Structure

```
frontend/
│── src/
│ ├── components/ # UI Components
│ │ ├── Navbar.js # Navigation bar
│ │ ├── WalletBox.js # Wallet connection component
│ │ ├── PoolItem.js # Single pool representation
│ │ ├── Pool.js # Page Liquidity pool management
│ │ ├── Swap.js # Page Token swapping interface
│ │ ├── Token.js # Page List of fictitious tokens
│ ├── utils/ # Blockchain interaction utilities
│ │ ├── factoryContract.js # Factory contract interactions
│ │ ├── poolContract.js # Pool contract interactions
│ │ ├── tokenContract.js # Token contract interactions
│ │ ├── web3.js # Token contract interactions
│ ├── assets/ # ABIs and static files
│ ├── App.js # Main application component
│ ├── index.js
│ ├── index.css # Main CSS file
│ ├── App.css # App CSS file
│── public/ # Static files
│ ├── index.html
│── .env #environement variables
│── copyAbis.js #Script to import simulation blockchain contracts ABI
│── copyTokens.js #Script to import fictive tokens info
│── package-lock.json
│── package.json # Dependencies and scripts
│── package-lock.json
│── tailwind.config.js # Config file for tailwindCSS
```

## Usage

### Connecting a Wallet

To use the application, you must connect your Metamask wallet:

- Open the app in your browser.
- Click on "Connect Wallet".
- Accept the Metamask connection request.

### Swapping Tokens

- Select two tokens to swap.
- Click Find the pool to locate a pool.
- Approve the DEX to spend your tokens.
- Click Swap to execute the transaction.

### Managing Liquidity Pools

#### Creating a Pool:

- Enter the symbols of two tokens.
- Click Create Pool.

#### Adding Liquidity:

- Enter the pool address.
- Approve the required tokens.
- Click Add Liquidity.

#### Removing Liquidity:

- Enter the pool address.
- Specify the amount of LP tokens you want to get back.
- Click Remove Liquidity.

## Frontend Components

### Pages

- **Swap.js** : UI for swapping tokens.
- **Pool.js** : Allows users to manage liquidity pools.
- **Token.js** : Displays a list of available tokens.

### UI Components

- **Navbar.js** : Navigation bar.
- **WalletBox.js** : Handles Metamask wallet connection.
- **PoolItem.js** : Displays individual pool information.

### Smart Contract Interaction

#### Contracts Used

- **DexFactory.sol** : Manages liquidity pools.
- **DexPool.sol** : Handles liquidity, swaps, and reserves.
- **DexLiquidityToken.sol** : Represents shares of liquidity pools.
- **TestToken.sol** Token : Fictitious tokens used for testing.

#### Utilities for Blockchain Interaction

Located in utils/:

- **factoryContract.js** : Fetches pools and interacts with the DexFactory contract.
- **poolContract.js** : Manages liquidity pools (add/remove liquidity, get details).
- t**okenContract.js** : Handles ERC-20 approvals and balances.

## Installation & Setup

### Prerequisites

Ensure you have:

- Node.js (v14 or later)
- Metamask installed in your browser.
- Ganache running a local blockchain (with all SC deployed).

### Clone the repository

```
git clone git@github.com:yannduffo/simple-dex.git
cd frontend
```

### Install dependencies

```
npm install
```

### Start the frontend

```
npm start
```

Make sure your Ganache blockchain is running before interacting with the DEX. At frontend starting, **all the ABI files** from the truffle/ganache development environemnet **are copied automatically** from `smart-contract/build/contarcts/` to `frontend/src/assets/abi` thanks to the _copyAbis.js_ script.

<br>
<br>
<br>
Created by Yann Duffo
