// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./DexPool.sol";

contract DexFactory {
    mapping(address => mapping(address => address)) public getPool;
    address[] public allPools;

    event PoolCreated(
        address indexed tokenA,
        address indexed tokenB,
        address pool,
        uint nbPools
    );

    function createPool(
        address tokenA,
        address tokenB
    ) external returns (address pool) {
        //checkings -------------------------------------------------------------------
        require(tokenA != tokenB, "Identical tokens");
        require(getPool[tokenA][tokenB] == address(0), "Pool already exists");

        //deploy a new DexPool instance
        // TODO : dynamic LP Token ?
        DexPool newPool = new DexPool(tokenA, tokenB, "LPToken", "LPT");
        pool = address(newPool);

        //register the pool
        getPool[tokenA][tokenB] = pool;
        getPool[tokenB][tokenA] = pool; //symetric pools are identical
        allPools.push(pool);

        emit PoolCreated(tokenA, tokenB, pool, allPools.length);
    }

    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }

    function getPoolAddress(
        address tokenA,
        address tokenB
    ) external view returns (address) {
        //retuning the info contained in the mapping
        return getPool[tokenA][tokenB];
    }
}
