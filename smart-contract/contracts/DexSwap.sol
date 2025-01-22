// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./DexPool.sol";

contract DexSwap {
    //defining state variable
    address[] public allPairs;
    mapping(address => mapping(address => DexPool)) public getPair;

    event PairCreated(
        address indexed token1,
        address indexed token2,
        address pair
    );

    function createPairs(
        address token1,
        address token2,
        string calldata token1Name,
        string calldata token2Name
    ) external returns (address) {
        //checkings
        require(token1 != token2, "Identical addresses are not allowed");
        require(
            address(getPair[token1][token2]) == address(0),
            "Pair already exists"
        );

        //dynamic liquidity token name and symbol definition
        string memory liquidityTokenName = string(
            abi.encodePacked("Liquid-", token1Name, "-", token2Name)
        );
        string memory liquidityTokenSymbol = string(
            abi.encodePacked("LP-", token1Name, "-", token2Name)
        );

        //pool creation
        DexPool dexPool = new DexPool(
            token1,
            token2,
            liquidityTokenName,
            liquidityTokenSymbol
        );
        getPair[token1][token2] = dexPool;
        getPair[token2][token1] = dexPool; //pools are bidirectionals
        allPairs.push(address(dexPool));

        //emit pair creation event
        emit PairCreated(token1, token2, address(dexPool));

        return address(dexPool);
    }

    function allPairsLenght() external view returns (uint) {
        return allPairs.length;
    }

    //get the whole table (not only index selected one which is automatly created as "allParis" is Public)
    function getPairs() external view returns (address[] memory) {
        return allPairs;
    }
}
