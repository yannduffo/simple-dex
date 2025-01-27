// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./DexPool.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DexFactory {
    mapping(address => mapping(address => address)) public getPool;
    address[] public allPools;

    event PoolCreated(
        address indexed addrTokenA,
        address indexed addrTokenB,
        address poolAddress,
        uint nbPools
    );

    /**
     * @notice Creates a new liquidity pool for a pair of tokens
     * @param addrTokenA The address of the first token in the pair
     * @param addrTokenB The address of the second token in the pair
     * @return poolAddress The address of the newly created pool
     * @dev Ensures the tokens are not identical and a pool for the pair does not already exist.
     */
    function createPool(
        address addrTokenA,
        address addrTokenB
    ) external returns (address poolAddress) {
        //checkings -------------------------------------------------------------------------------
        require(addrTokenA != addrTokenB, "Identical tokens");
        require(
            getPool[addrTokenA][addrTokenB] == address(0),
            "Pool already exists"
        );

        //deploy a new DexPool instance with dynamic LP token creation ----------------------------
        //genere name and symbol for the dynamic LP token
        string memory LPTokenName = string(
            abi.encodePacked(
                "LP-",
                ERC20(addrTokenA).symbol(),
                "-",
                ERC20(addrTokenB).symbol()
            )
        );
        string memory LPTokenSymbol = string(
            abi.encodePacked(
                "LPT-",
                ERC20(addrTokenA).symbol(),
                "-",
                ERC20(addrTokenB).symbol()
            )
        );

        //deploy the DexPool contract intance
        DexPool newPool = new DexPool(
            addrTokenA,
            addrTokenB,
            LPTokenName,
            LPTokenSymbol
        );
        poolAddress = address(newPool);

        //register the pool -----------------------------------------------------------------------
        getPool[addrTokenA][addrTokenB] = poolAddress;
        getPool[addrTokenB][addrTokenA] = poolAddress; //symetric pools are identical
        allPools.push(poolAddress);

        //emit the event --------------------------------------------------------------------------
        emit PoolCreated(addrTokenA, addrTokenB, poolAddress, allPools.length);
    }

    /**
     * @notice Returns an array of the addresses of all pools created
     * @return allPools An array containing the addresses of all pools
     */
    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }

    /**
     * @notice Fetches the address of the liquidity pool for a given token pair
     * @param addrTokenA The address of the first token in the pair
     * @param addrTokenB The address of the second token in the pair
     * @return adress The address of the pool for the specified token pair
     * @dev Returns the address from the `getPool` mapping.
     */
    function getPoolAddress(
        address addrTokenA,
        address addrTokenB
    ) external view returns (address) {
        //retuning the info contained in the mapping
        return getPool[addrTokenA][addrTokenB];
    }
}
